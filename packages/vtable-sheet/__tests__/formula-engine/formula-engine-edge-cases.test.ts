import { FormulaEngine } from '../../src/formula/formula-engine';

describe('FormulaEngine.adjustFormulaReferences - Edge Cases', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    engine.addSheet('Sheet1');
  });

  describe('Boundary Conditions', () => {
    test('should handle insert at row 0', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=B1+A1'); // B1=B1+A1
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 1, col: 1 });
      expect(formula).toBe('=B2+A2'); // B1→B2, A1→A2
    });

    test('should handle insert at last row', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 999, col: 1 }, '=B1000+A1000');
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 999, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 1000, col: 1 });
      expect(formula).toBe('=B1001+A1001');
    });

    test('should handle delete at row 0', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B2+A2'); // B2=B2+A2
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 0, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 0, col: 1 });
      expect(formula).toBe('=B1+A1'); // B2→B1, A2→A1
    });

    test('should handle insert at column 0', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 0 }, '=A1+Z1'); // A2=A1+Z1
      engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 0, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 1, col: 1 });
      expect(formula).toBe('=B1+AA1'); // A1→B1, Z1→AA1
    });

    test('should handle delete at column 0', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B2+C2'); // B2=B2+C2
      engine.adjustFormulaReferences('Sheet1', 'delete', 'column', 0, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 1, col: 0 });
      expect(formula).toBe('=#REF!+B2'); // B2→#REF!, C2→B2
    });
  });

  describe('Multiple Operations', () => {
    test('should handle multiple inserts', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=B2+B1'); // B3=B2+B1

      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1, 100, 100); // Insert at row 0
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100); // Insert at row 1

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 4, col: 1 });
      expect(formula).toBe('=B4+B3'); // B3→B4, B2→B3
    });

    test('should handle multiple deletes', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=B5+B4'); // B5=B5+B4

      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 0, 1, 100, 100); // Delete row 0
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 1, 1, 100, 100); // Delete row 1

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(formula).toBe('=B3+B2'); // B5→B3, B4→B2
    });

    test('should handle mixed insert and delete', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=B2+B1'); // B3=B2+B1

      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100); // Insert at row 1
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 0, 1, 100, 100); // Delete row 0

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(formula).toBe('=B2+#REF!'); // B1 becomes #REF! after deletion
    });
  });

  describe('Large Count Operations', () => {
    test('should handle insert with large count', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 10, col: 1 }, '=B10+B9'); // B11=B10+B9
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 5, 10, 100, 100); // Insert 10 rows

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 20, col: 1 });
      expect(formula).toBe('=B20+B19'); // B11→B20, B10→B19
    });

    test('should handle delete with large count', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 20, col: 1 }, '=B20+B19'); // B21=B20+B19
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 10, 100, 100); // Delete 10 rows

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 10, col: 1 });
      expect(formula).toBe('=B10+B9'); // B20→B10, B19→B9
    });
  });

  describe('Complex Reference Patterns', () => {
    test('should handle formulas with multiple references to same cell', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=B2+B2+B2'); // B3=B2+B2+B2
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 3, col: 1 });
      expect(formula).toBe('=B3+B3+B3'); // All B2 references become B3
    });

    test('should handle formulas with mixed row and column references', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 2 }, '=C2+B3+C3'); // C3=C2+B3+C3
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 3, col: 2 });
      expect(formula).toBe('=C3+B4+C4'); // C2→C3, B3→B4, C3→C4
    });

    test('should handle formulas with references in different orders', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=Z2+B2+AA2'); // B3=Z2+B2+AA2
      engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 2 });
      expect(formula).toBe('=AA2+C2+AB2'); // Z2→AA2, B2→C2, AA2→AB2
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent sheet gracefully', () => {
      expect(() => {
        engine.adjustFormulaReferences('NonExistentSheet', 'insert', 'row', 1, 1, 100, 100);
      }).not.toThrow();
    });

    test('should handle negative indices', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 0, col: 1 }, '=B1+A1'); // B1=B1+A1
      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', -1, 1, 100, 100);
      }).not.toThrow();
    });

    test('should handle zero count', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B2+A2'); // B2=B2+A2
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 0, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 1, col: 1 });
      expect(formula).toBe('=B2+A2'); // Should remain unchanged
    });
  });

  describe('Dependency Relationship Edge Cases', () => {
    test('should handle empty dependency graph', () => {
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);
      // Should not throw error
      expect(true).toBe(true);
    });

    test('should handle single formula cell', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=1+1'); // B2=1+1
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(formula).toBe('=1+1'); // Should remain unchanged
    });

    test('should handle formulas with no references', () => {
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=PI()*2'); // B2=PI()*2
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1, 100, 100);

      const formula = engine.getFormulaString({ sheet: 'Sheet1', row: 2, col: 1 });
      expect(formula).toBe('=PI()*2'); // Should remain unchanged
    });
  });
});
