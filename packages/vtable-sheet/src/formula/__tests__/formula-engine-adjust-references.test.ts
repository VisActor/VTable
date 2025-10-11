import { FormulaEngine } from '../formula-engine';

describe('FormulaEngine.adjustFormulaReferences', () => {
  let engine: FormulaEngine;

  beforeEach(() => {
    engine = new FormulaEngine();
    // 添加测试用工作表
    engine.addSheet('Sheet1');
  });

  describe('Insert Row Operations', () => {
    test('should adjust formula references when inserting a row', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6=B5+B4

      // 在第2行插入一行（index=1）
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      // 验证B7的公式是否正确调整
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 6, col: 1 }); // B7
      expect(result.value).toBe('=B6+B5'); // 公式应该被调整
    });

    test('should move formula cells when inserting a row', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B1+A1'); // B2=B1+A1

      // 在第1行插入一行（index=0）
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1);

      // 验证B3的公式是否正确
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }); // B3
      expect(result.value).toBe('=B2+A2');
    });

    test('should handle complex dependency chains when inserting rows', () => {
      // 设置依赖链：B2→B1+A1, C3→B2+B1, D4→C3+B2+A1
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B1+A1'); // B2=B1+A1
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 2 }, '=B2+B1'); // C3=B2+B1
      engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 3 }, '=C3+B2+A1'); // D4=C3+B2+A1

      // 在第1行插入一行
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 0, 1);

      // 验证所有公式都正确调整
      const b3Result = engine.getCellValue({ sheet: 'Sheet1', row: 2, col: 1 }); // B3
      expect(b3Result.value).toBe('=B2+A2'); // B3=B2+A2

      const c4Result = engine.getCellValue({ sheet: 'Sheet1', row: 3, col: 2 }); // C4
      expect(c4Result.value).toBe('=B3+B2'); // C4=B3+B2

      const d5Result = engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 3 }); // D5
      expect(d5Result.value).toBe('=C4+B3+A2'); // D5=C4+B3+A2
    });

    test('should maintain dependency relationships after insert', () => {
      // 设置依赖关系
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6依赖B5和B4

      // 获取初始依赖关系
      const initialCell = { sheet: 'Sheet1', row: 5, col: 1 }; // B6
      const initialDependents = engine.getCellDependents(initialCell);
      const initialPrecedents = engine.getCellPrecedents(initialCell);

      // 在第2行插入一行
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      // 验证新的依赖关系
      const newCell = { sheet: 'Sheet1', row: 6, col: 1 }; // B7
      const newDependents = engine.getCellDependents(newCell);
      const newPrecedents = engine.getCellPrecedents(newCell);

      // B7应该存在依赖关系
      expect(newPrecedents.length).toBeGreaterThan(0);
    });
  });

  describe('Delete Row Operations', () => {
    test('should delete formula cells when deleting their row', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      // 删除第6行（index=5）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      // 验证B6的公式被删除，B7的公式移动到B6
      const b6Result = engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 1 }); // B6
      expect(b6Result.value).toBe('=B6+1'); // B7移动到B6

      const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 }; // B7
      expect(engine.isCellFormula(b7Cell)).toBe(false); // B7被删除
    });

    test('should adjust references when deleting a referenced row', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      // 删除第5行（index=4）- 这将影响B6的引用
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 4, 1);

      // 验证引用正确调整
      const b5Result = engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 1 }); // B5
      expect(b5Result.value).toBe('=B5+1'); // B6移动到B5，引用也调整

      const b6Result = engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 1 }); // B6
      expect(b6Result.value).toBe('=B5+1'); // B7移动到B6，引用也调整
    });

    test('should handle deleting multiple rows', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 1 }, '=B4+1'); // B5=B4+1
      engine.setCellContent({ sheet: 'Sheet1', row: 4, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B6+1'); // B7=B6+1

      // 删除第4-5行（index=3，count=2）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 3, 2);

      // 验证所有公式正确调整
      const b4Result = engine.getCellValue({ sheet: 'Sheet1', row: 3, col: 1 }); // B4
      expect(b4Result.value).toBe('=B5+1'); // B5移动到B4

      const b5Result = engine.getCellValue({ sheet: 'Sheet1', row: 4, col: 1 }); // B5
      expect(b5Result.value).toBe('=B4+1'); // B6移动到B5

      const b6Cell = { sheet: 'Sheet1', row: 5, col: 1 }; // B6
      expect(engine.isCellFormula(b6Cell)).toBe(false); // B6被删除

      const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 }; // B7
      expect(engine.isCellFormula(b7Cell)).toBe(false); // B7被删除
    });

    test('should maintain dependency relationships after delete', () => {
      // 设置依赖关系
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6依赖B5和B4
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+B5'); // B7依赖B6和B5

      // 删除第6行
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      // 验证依赖关系正确更新
      const b6Cell = { sheet: 'Sheet1', row: 5, col: 1 }; // B6（原B7）
      const b6Dependents = engine.getCellDependents(b6Cell);
      const b6Precedents = engine.getCellPrecedents(b6Cell);

      // B6应该存在依赖关系
      expect(b6Precedents.length).toBeGreaterThan(0);
    });
  });

  describe('Insert Column Operations', () => {
    test('should adjust formula references when inserting a column', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+A5'); // B6=B5+A5

      // 在第B列插入一列（index=1）
      engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 1, 1);

      // 验证C6的公式是否正确调整
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 2 }); // C6
      expect(result.value).toBe('=C5+B5'); // B→C, A→B
    });

    test('should move formula cells when inserting a column', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=B1+A1'); // B2=B1+A1

      // 在第A列插入一列（index=0）
      engine.adjustFormulaReferences('Sheet1', 'insert', 'column', 0, 1);

      // 验证C2的公式是否正确
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 1, col: 2 }); // C2
      expect(result.value).toBe('=C1+B1'); // B→C, A→B
    });
  });

  describe('Delete Column Operations', () => {
    test('should delete formula cells when deleting their column', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+1'); // B6=B5+1
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=B6+1'); // C6=B6+1

      // 删除第B列（index=1）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'column', 1, 1);

      // 验证B6的公式被删除，C6的公式移动到B6
      const b6Result = engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 1 }); // B6
      expect(b6Result.value).toBe('=B6+1'); // C6移动到B6

      const c6Cell = { sheet: 'Sheet1', row: 5, col: 2 }; // C6
      expect(engine.isCellFormula(c6Cell)).toBe(false); // C6被删除
    });

    test('should adjust references when deleting a referenced column', () => {
      // 设置初始数据
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+A5'); // B6=B5+A5
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 2 }, '=B6+C6'); // C6=B6+C6

      // 删除第B列（index=1）
      engine.adjustFormulaReferences('Sheet1', 'delete', 'column', 1, 1);

      // 验证引用正确调整
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 5, col: 1 }); // B6
      expect(result.value).toBe('=B6+B6'); // C6移动到B6，引用调整
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty formula cells', () => {
      // 没有公式单元格
      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);
      }).not.toThrow();
    });

    test('should handle formulas from other sheets', () => {
      engine.addSheet('Sheet2');
      // 设置跨表引用
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=Sheet2!B5+B4');

      // 在Sheet1中插入行
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      // 只应该影响Sheet1中的公式
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 6, col: 1 }); // B6
      expect(result.value).toBe('=Sheet2!B5+B5'); // 只有B4被调整
    });

    test('should handle circular dependencies gracefully', () => {
      // 设置循环依赖：B6=B7+1, B7=B6+1
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B7+1'); // B6=B7+1
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+1'); // B7=B6+1

      // 插入行不应该导致无限循环
      expect(() => {
        engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);
      }).not.toThrow();

      // 验证公式仍然存在
      const b6Cell = { sheet: 'Sheet1', row: 6, col: 1 }; // B6
      const b7Cell = { sheet: 'Sheet1', row: 7, col: 1 }; // B7
      expect(engine.isCellFormula(b6Cell)).toBe(true);
      expect(engine.isCellFormula(b7Cell)).toBe(true);
    });

    test('should handle formulas with range references', () => {
      // 设置范围引用
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=SUM(B4:B6)'); // B6=SUM(B4:B6)

      // 在第5行插入一行
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 4, 1);

      // 验证范围引用正确调整
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 6, col: 1 }); // B7
      expect(result.value).toBe('=SUM(B5:B7)'); // B4→B5, B6→B7
    });

    test('should handle mixed absolute and relative references', () => {
      // 设置混合引用（简化测试，假设引擎支持$符号）
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B$5+$A6'); // B6=B$5+$A6

      // 在第2行插入一行
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      // 验证混合引用正确调整
      const result = engine.getCellValue({ sheet: 'Sheet1', row: 6, col: 1 }); // B7
      expect(result.value).toBe('=B$6+$A7'); // 只有相对引用部分被调整
    });
  });

  describe('Dependency Relationship Maintenance', () => {
    test('should update dependencies when formula cells move', () => {
      // 设置依赖关系
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6依赖B5和B4

      // 获取初始依赖关系
      const initialCell = { sheet: 'Sheet1', row: 5, col: 1 }; // B6
      const initialDependents = engine.getCellDependents(initialCell);
      const initialPrecedents = engine.getCellPrecedents(initialCell);

      // 插入行
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);

      // 验证新的依赖关系正确
      const newCell = { sheet: 'Sheet1', row: 6, col: 1 }; // B7
      const newDependents = engine.getCellDependents(newCell);
      const newPrecedents = engine.getCellPrecedents(newCell);

      // B7应该存在依赖关系
      expect(newPrecedents.length).toBeGreaterThan(0);
    });

    test('should clean up dependencies of deleted formula cells', () => {
      // 设置依赖关系
      engine.setCellContent({ sheet: 'Sheet1', row: 5, col: 1 }, '=B5+B4'); // B6依赖B5和B4
      engine.setCellContent({ sheet: 'Sheet1', row: 6, col: 1 }, '=B6+B5'); // B7依赖B6和B5

      // 获取初始依赖关系
      const b6Cell = { sheet: 'Sheet1', row: 5, col: 1 }; // B6
      const b7Cell = { sheet: 'Sheet1', row: 6, col: 1 }; // B7

      const initialB6Precedents = engine.getCellPrecedents(b6Cell);
      const initialB7Precedents = engine.getCellPrecedents(b7Cell);

      expect(initialB6Precedents.length).toBeGreaterThan(0);
      expect(initialB7Precedents.length).toBeGreaterThan(0);

      // 删除包含B6的行
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 5, 1);

      // 验证B6的依赖关系被清理（B6不存在了）
      const newB6Cell = { sheet: 'Sheet1', row: 5, col: 1 }; // 新的B6（原B7）
      const newB6Precedents = engine.getCellPrecedents(newB6Cell);

      // 新的B7应该存在依赖关系
      const newB7Cell = { sheet: 'Sheet1', row: 6, col: 1 }; // B7
      const newB7Precedents = engine.getCellPrecedents(newB7Cell);

      expect(newB6Precedents.length).toBeGreaterThan(0);
    });

    test('should handle dependency updates for multiple operations', () => {
      // 设置复杂的依赖关系
      engine.setCellContent({ sheet: 'Sheet1', row: 1, col: 1 }, '=A1+1'); // B2
      engine.setCellContent({ sheet: 'Sheet1', row: 2, col: 1 }, '=B2+1'); // B3
      engine.setCellContent({ sheet: 'Sheet1', row: 3, col: 1 }, '=B3+1'); // B4

      // 执行多次操作
      engine.adjustFormulaReferences('Sheet1', 'insert', 'row', 1, 1);
      engine.adjustFormulaReferences('Sheet1', 'delete', 'row', 2, 1);

      // 验证依赖关系仍然一致
      const b3Cell = { sheet: 'Sheet1', row: 2, col: 1 }; // B3
      const b4Cell = { sheet: 'Sheet1', row: 3, col: 1 }; // B4

      const b3Precedents = engine.getCellPrecedents(b3Cell);
      const b4Precedents = engine.getCellPrecedents(b4Cell);

      expect(b3Precedents.length).toBeGreaterThan(0);
      expect(b4Precedents.length).toBeGreaterThan(0);
    });
  });
});
