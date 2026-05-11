import { FormulaEngine } from '../../src/formula/formula-engine';

describe('FormulaEngine.adjustFormulaReferences - Core Functionality', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  describe('Insert Operations', () => {
    test('insert row - basic formula adjustment', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6=B5+B4
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 1 });
      expect(formula).toBe('=B6+B5');
    });

    test('insert row - formula cell movement', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B1+A1'); // B2=B1+A1
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(formula).toBe('=B2+A2');
    });

    test('insert column - basic formula adjustment', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=C5+B5'); // B6=C5+B5
      engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 2 });
      expect(formula).toBe('=D5+C5'); // C→D, B→C
    });
  });

  describe('Delete Operations', () => {
    test('delete row - formula cell deletion', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });
      expect(formula).toBe('=#REF!+1'); // B7 moved to B6, but B6 reference becomes #REF!

      const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 };
      expect(engine.isCellFormula(b7Cell)).toBe(false); // B7 deleted
    });

    test('delete row - reference adjustment', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 4, 1, 100, 100); // Delete row 5

      const b5Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      const b6Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });

      expect(b5Formula).toBe('=#REF!+1'); // B6 moved to B5, but B5 reference becomes #REF!
      expect(b6Formula).toBe('=B5+1'); // B7 moved to B6, reference adjusted correctly
    });

    test('delete column - formula cell deletion', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=B6+1'); // C6=B6+1

      engine.adjustFormulaReferences('Sheet1', 'delete', 'column', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });
      expect(formula).toBe('=#REF!+1'); // C6 moved to B6, but C6 reference becomes #REF!

      const c6Cell = { sheet: 'Sheet1', row: 5, col: 2 };
      expect(engine.isCellFormula(c6Cell)).toBe(false); // C6 deleted
    });
  });

  describe('Dependency Maintenance', () => {
    test('dependencies updated after insert', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4');

      const initialCell = { sheet: 'Sheet1', row: 5, col: 1 };
      const initialPrecedents = engine.getCellPrecedents(initialCell);
      expect(initialPrecedents.length).toBeGreaterThan(0);

      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const newCell = { sheet: 'Sheet1', row: 6, col: 1 };
      const newPrecedents = engine.getCellPrecedents(newCell);
      expect(newPrecedents.length).toBeGreaterThan(0);
    });

    test('dependencies cleaned up after delete', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4');
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+B5');

      const b6Cell = { sheet: 'Sheet1', row: 5, col: 1 };
      const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 };

      const initialB6Precedents = engine.getCellPrecedents(b6Cell);
      const initialB7Precedents = engine.getCellPrecedents(b7Cell);

      expect(initialB6Precedents.length).toBeGreaterThan(0);
      expect(initialB7Precedents.length).toBeGreaterThan(0);

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1, 100, 100);

      const newB6Cell = { sheet: 'Sheet1', row: 5, col: 1 };
      const newB6Precedents = engine.getCellPrecedents(newB6Cell);

      expect(newB6Precedents.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    test('no error with empty formula cells', () => {
      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);
      }).not.toThrow();
    });

    test('handles other sheet formulas correctly', () => {
      engine.addSheet('Sheet2');
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=Sheet2!B5+B4');

      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 1 });
      expect(formula).toBe('=Sheet2!B6+B5'); // B5->B6, B4->B5
    });

    test('handles circular dependencies', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B7+1');
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1');

      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);
      }).not.toThrow();

      const b6Cell = { sheet: 'Sheet1', row: 6, col: 1 };
      const b7Cell = { sheet: 'Sheet1', row: 7, col: 1 };
      expect(engine.isCellFormula(b6Cell)).toBe(true);
      expect(engine.isCellFormula(b7Cell)).toBe(true);
    });
  });

  describe('Common function evaluation', () => {
    test('math functions FLOOR/CEILING/SQRT/POWER/MOD', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, '=FLOOR(5.7)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 0, col: 0 }).value).toBe(5);

      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=FLOOR(5.7,0.5)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 1, col: 0 }).value).toBe(5.5);

      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=CEILING(5.2)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 2, col: 0 }).value).toBe(6);

      engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, '=CEILING(5.2,0.5)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 3, col: 0 }).value).toBe(5.5);

      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=SQRT(9)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 0 }).value).toBe(3);

      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 0 }, '=POWER(2,3)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 0 }).value).toBe(8);

      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 0 }, '=MOD(10,3)');
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 6, col: 0 }).value).toBe(1);
    });

    test('date and time functions YEAR/MONTH/DAY/HOUR/MINUTE/SECOND', () => {
      const date = new Date(2020, 0, 15, 10, 20, 30); // 2020-01-15 10:20:30
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 0 }, date); // A1

      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=YEAR(A1)');
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 0 }, '=MONTH(A1)');
      engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 0 }, '=DAY(A1)');
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 0 }, '=HOUR(A1)');
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 0 }, '=MINUTE(A1)');
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 0 }, '=SECOND(A1)');

      expect(engine.getCellValue({ sheet: 'Sheet1', row: 1, col: 0 }).value).toBe(2020);
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 2, col: 0 }).value).toBe(1);
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 3, col: 0 }).value).toBe(15);
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 0 }).value).toBe(10);
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 0 }).value).toBe(20);
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 6, col: 0 }).value).toBe(30);

      // YEAR(NOW()) 至少不报错且返回当前年份
      engine.setCellContent({ sheet: 'Sheet1', row: 7, col: 0 }, '=YEAR(NOW())');
      const currentYear = new Date().getFullYear();
      expect(engine.getCellValue({ sheet: 'Sheet1', row: 7, col: 0 }).value).toBe(currentYear);
    });
  });
});
