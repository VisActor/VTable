import { FormulaEngine } from '../formula-engine';

describe('FormulaEngine.adjustFormulaReferences - Core Functionality', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  describe('Insert Operations', () => {
    test('insert row - basic formula adjustment', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6=B5+B4
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 1 });
      expect(formula).toBe('=B6+B5');
    });

    test('insert row - formula cell movement', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B1+A1'); // B2=B1+A1
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(formula).toBe('=B2+A2');
    });

    test('insert column - basic formula adjustment', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=C5+B5'); // B6=C5+B5
      engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 1, 1);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 2 });
      expect(formula).toBe('=D5+C5'); // C→D, B→C
    });
  });

  describe('Delete Operations', () => {
    test('delete row - formula cell deletion', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });
      expect(formula).toBe('=B6+1'); // B7 moved to B6

      const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 };
      expect(engine.isCellFormula(b7Cell)).toBe(false); // B7 deleted
    });

    test('delete row - reference adjustment', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 4, 1); // Delete row 5

      const b5Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      const b6Formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });

      expect(b5Formula).toBe('=B5+1'); // B6 moved to B5
      expect(b6Formula).toBe('=B5+1'); // B7 moved to B6
    });

    test('delete column - formula cell deletion', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=B6+1'); // C6=B6+1

      engine.adjustFormulaReferences('Sheet1', 'delete', 'column', 1, 1);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 5, col: 1 });
      expect(formula).toBe('=B6+1'); // C6 moved to B6

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

      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

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

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      const newB6Cell = { sheet: 'Sheet1', row: 5, col: 1 };
      const newB6Precedents = engine.getCellPrecedents(newB6Cell);

      expect(newB6Precedents.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    test('no error with empty formula cells', () => {
      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);
      }).not.toThrow();
    });

    test('handles other sheet formulas correctly', () => {
      engine.addSheet('Sheet2');
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=Sheet2!B5+B4');

      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 6, col: 1 });
      expect(formula).toBe('=Sheet2!B6+B5'); // B5->B6, B4->B5
    });

    test('handles circular dependencies', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B7+1');
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1');

      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);
      }).not.toThrow();

      const b6Cell = { sheet: 'Sheet1', row: 6, col: 1 };
      const b7Cell = { sheet: 'Sheet1', row: 7, col: 1 };
      expect(engine.isCellFormula(b6Cell)).toBe(true);
      expect(engine.isCellFormula(b7Cell)).toBe(true);
    });
  });
});
