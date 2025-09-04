import { FormulaRangeSelector } from '../formula/formula-range-selector';

describe('FormulaRangeSelector', () => {
  let rangeSelector: FormulaRangeSelector;
  let mockInput: HTMLInputElement;

  beforeEach(() => {
    rangeSelector = new FormulaRangeSelector(null);
    mockInput = document.createElement('input');

    // Mock dispatchEvent to avoid actual event dispatch
    mockInput.dispatchEvent = jest.fn();

    // Mock setSelectionRange to avoid DOM manipulation
    mockInput.setSelectionRange = jest.fn();
  });

  describe('insertA1ReferenceInFunction', () => {
    test('在空函数中插入引用', () => {
      // 设置初始状态
      mockInput.value = '=SUM()';
      const cursorPos = 5; // 光标在括号内
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 5, end: 5 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'A1:B2');

      // 验证结果
      expect(mockInput.value).toBe('=SUM(A1:B2)');
    });

    test('在已有参数后追加新参数', () => {
      // 设置初始状态
      mockInput.value = '=SUM(A1)';
      const cursorPos = 7; // 光标在 A1 后面
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 5, end: 7 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'C3:D4');

      // 验证结果
      expect(mockInput.value).toBe('=SUM(A1, C3:D4)');
    });

    test('在逗号后追加新参数', () => {
      // 设置初始状态
      mockInput.value = '=SUM(A1, )';
      const cursorPos = 9; // 光标在逗号后空格后
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 5, end: 9 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'C3:D4');

      // 验证结果 - 应该避免多余的空格和逗号
      expect(mockInput.value).toBe('=SUM(A1, C3:D4)');
    });

    test('在参数中间插入新参数', () => {
      // 设置初始状态
      mockInput.value = '=SUM(A1, B2, C3)';
      const cursorPos = 9; // 光标在 A1 和 B2 之间
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 5, end: 15 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'D4:E5');

      // 验证结果
      expect(mockInput.value).toBe('=SUM(A1, D4:E5, B2, C3)');
    });

    test('处理嵌套函数的参数', () => {
      // 设置初始状态
      mockInput.value = '=IF(SUM(A1)>10, "大", "小")';
      const cursorPos = 10; // 光标在 SUM(A1) 中的 A1 后面
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 8, end: 10 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'B2:C3');

      // 验证结果
      expect(mockInput.value).toBe('=IF(SUM(A1, B2:C3)>10, "大", "小")');
    });

    test('在公式末尾追加参数', () => {
      // 设置初始状态
      mockInput.value = '=SUM(I11:I19)';
      const cursorPos = 12; // 光标在 I19) 后面
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 5, end: 12 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'J1:J10');

      // 验证结果
      expect(mockInput.value).toBe('=SUM(I11:I19, J1:J10)');
    });

    test('在逗号后追加参数 - Excel风格场景', () => {
      // 设置初始状态 - 用户在 I19 后输入逗号，表示想要追加新范围
      mockInput.value = '=SUM(I11:I19,';
      const cursorPos = 13; // 光标在逗号后
      mockInput.selectionStart = cursorPos;

      // 设置函数参数位置
      rangeSelector['functionParamPosition'] = { start: 5, end: 13 };

      // 执行插入
      rangeSelector.insertA1ReferenceInFunction(mockInput, 'J1:J10');

      // 验证结果
      expect(mockInput.value).toBe('=SUM(I11:I19, J1:J10');
    });
  });

  describe('selectionsToA1Notation', () => {
    test('转换单个单元格选择', () => {
      const selections = [{ startRow: 0, startCol: 0, endRow: 0, endCol: 0 }];
      const addressFromCoord = (row: number, col: number) => `R${row + 1}C${col + 1}`;

      const result = rangeSelector.selectionsToA1Notation(selections, addressFromCoord);
      expect(result).toBe('R1C1');
    });

    test('转换单元格范围选择', () => {
      const selections = [{ startRow: 0, startCol: 0, endRow: 2, endCol: 2 }];
      const addressFromCoord = (row: number, col: number) => `R${row + 1}C${col + 1}`;

      const result = rangeSelector.selectionsToA1Notation(selections, addressFromCoord);
      expect(result).toBe('R1C1:R3C3');
    });

    test('转换多个选择', () => {
      const selections = [
        { startRow: 0, startCol: 0, endRow: 0, endCol: 0 },
        { startRow: 2, startCol: 2, endRow: 3, endCol: 3 }
      ];
      const addressFromCoord = (row: number, col: number) => `R${row + 1}C${col + 1}`;

      const result = rangeSelector.selectionsToA1Notation(selections, addressFromCoord);
      expect(result).toBe('R1C1,R3C3:R4C4');
    });
  });

  describe('findCurrentArgumentPosition', () => {
    test('基本参数位置检测 - 光标在第一个参数', () => {
      const formula = '=SUM(A1, B2)';
      const cursorPos = 6; // 光标在 A1 中间

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 5, end: 7 });
    });

    test('基本参数位置检测 - 光标在第二个参数', () => {
      const formula = '=SUM(A1, B2)';
      const cursorPos = 10; // 光标在 B2 中间

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 9, end: 11 });
    });

    test('光标在参数末尾 - 末尾参数识别问题修复', () => {
      const formula = '=SUM(H6,H9:H10)';
      const cursorPos = 14; // 光标在 H10 后面

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 8, end: 15 });
    });

    test('嵌套函数处理', () => {
      const formula = '=IF(SUM(A1:A10)>10, "大", "小")';
      const cursorPos = 12; // 光标在 A10 中间

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 8, end: 15 });
    });

    test('带引号的参数处理', () => {
      const formula = '=CONCATENATE("Hello, World", A1)';
      const cursorPos = 18; // 光标在 Hello, World 中的逗号后

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 13, end: 26 });
    });

    test('多层嵌套函数处理', () => {
      const formula = '=IF(AND(A1>0, B1>0), SUM(C1:C10), MAX(D1,D5))';
      const cursorPos = 16; // 光标在 AND 函数的第二个参数 B1>0 中

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 14, end: 19 });
    });

    test('公式末尾位置', () => {
      const formula = '=SUM(A1:A10)';
      const cursorPos = 12; // 光标在右括号前

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 5, end: 12 });
    });

    test('空参数处理', () => {
      const formula = '=SUM(,B2)';
      const cursorPos = 5; // 光标在第一个逗号前

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toEqual({ start: 5, end: 5 });
    });

    test('光标在函数名称处', () => {
      const formula = '=SUM(A1:A10)';
      const cursorPos = 2; // 光标在 SUM 中

      const result = rangeSelector['findCurrentArgumentPosition'](formula, cursorPos);
      expect(result).toBeNull();
    });
  });
});
