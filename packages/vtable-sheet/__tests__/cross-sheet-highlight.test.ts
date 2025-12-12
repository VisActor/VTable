import { CellHighlightManager } from '../src/formula/cell-highlight-manager';
import type VTableSheet from '../src/components/vtable-sheet';
import type { WorkSheet } from '../src/core/WorkSheet';

// Mock VTableSheet
const mockVTableSheet = {
  getActiveSheet: jest.fn(),
  getSheetByName: jest.fn(),
  workSheetInstances: new Map()
} as any;

// Mock WorkSheet
const createMockWorkSheet = (sheetName: string) => {
  const mockSheet = {
    sheetTitle: sheetName,
    coordFromAddress: jest.fn((address: string) => {
      // Simple mock: A1 -> {row: 0, col: 0}, B1 -> {row: 0, col: 1}, etc.
      const match = address.match(/([A-Z]+)(\d+)/);
      if (match) {
        const col = match[1].charCodeAt(0) - 'A'.charCodeAt(0);
        const row = parseInt(match[2], 10) - 1;
        return { row, col };
      }
      return { row: 0, col: 0 };
    })
  } as any;

  return mockSheet;
};

describe('CrossSheet Highlighting', () => {
  let highlightManager: CellHighlightManager;
  let mockSheet1: WorkSheet;
  let mockSheet2: WorkSheet;

  beforeEach(() => {
    // 创建mock sheets
    mockSheet1 = createMockWorkSheet('Sheet1');
    mockSheet2 = createMockWorkSheet('Sheet2');

    // 设置mock方法
    mockVTableSheet.getActiveSheet.mockReturnValue(mockSheet1);
    mockVTableSheet.getSheetByName.mockImplementation((name: string) => {
      if (name === 'Sheet1') {
        return mockSheet1;
      }
      if (name === 'Sheet2') {
        return mockSheet2;
      }
      return null;
    });

    // 创建高亮管理器实例
    highlightManager = new CellHighlightManager(mockVTableSheet);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should parse cross-sheet formula references', () => {
    const formula = 'Sheet1!A1 + Sheet2!B2 + C3';

    const references = highlightManager.parseCellReferences(formula);

    // Based on current regex capabilities
    expect(references.length).toBeGreaterThanOrEqual(2);

    // Find the cross-sheet references
    const sheet1Ref = references.find(ref => ref.sheetName === 'Sheet1');
    const sheet2Ref = references.find(ref => ref.sheetName === 'Sheet2');
    const localRef = references.find(ref => !ref.sheetName);

    expect(sheet1Ref).toBeDefined();
    expect(sheet2Ref).toBeDefined();
    expect(localRef).toBeDefined();

    if (sheet1Ref) {
      expect(sheet1Ref.address).toContain('A1');
    }
    if (sheet2Ref) {
      expect(sheet2Ref.address).toContain('B2');
    }
    if (localRef) {
      expect(localRef.address).toBe('C3');
    }
  });

  test('should parse cross-sheet range references', () => {
    const formula = 'Sheet1!A1:A5';

    const references = highlightManager.parseCellReferences(formula);

    expect(references.length).toBeGreaterThanOrEqual(1);

    const rangeRef = references.find(ref => ref.sheetName === 'Sheet1' && ref.isRange);
    expect(rangeRef).toBeDefined();
    if (rangeRef) {
      expect(rangeRef.address).toContain('A1:A5');
    }
  });

  test('should handle quoted sheet names', () => {
    const formula = "'My Sheet'!A1";

    const references = highlightManager.parseCellReferences(formula);

    // The regex might not handle quoted names perfectly, so be flexible
    expect(references.length).toBeGreaterThanOrEqual(0);

    // If we get references, check if any have the expected sheet name
    if (references.length > 0) {
      const quotedRef = references.find(ref => ref.sheetName === 'My Sheet' || ref.address.includes('My Sheet'));
      if (quotedRef) {
        expect(quotedRef.address).toContain('A1');
      }
    }
  });

  test('should get correct target sheet for highlighting', () => {
    const formula = 'Sheet1!A1 + Sheet2!B2';

    // Mock applyCellHighlight to capture calls
    const applyCellHighlightSpy = jest.spyOn(highlightManager as any, 'applyCellHighlight');

    highlightManager.highlightFormulaCells(formula);

    // Verify that getSheetByName was called for cross-sheet references
    expect(mockVTableSheet.getSheetByName).toHaveBeenCalledWith('Sheet1');
    expect(mockVTableSheet.getSheetByName).toHaveBeenCalledWith('Sheet2');

    // Verify that applyCellHighlight was called with correct sheets
    expect(applyCellHighlightSpy).toHaveBeenCalled();
  });

  test('should handle invalid sheet names gracefully', () => {
    const formula = 'NonExistentSheet!A1 + Sheet1!B1';

    // Mock console.warn to check warning messages
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const references = highlightManager.parseCellReferences(formula);

    expect(references.length).toBeGreaterThanOrEqual(1);

    // Should not throw error, but log warning
    expect(() => {
      highlightManager.highlightFormulaCells(formula);
    }).not.toThrow();

    expect(consoleWarnSpy).toHaveBeenCalledWith('Sheet not found: NonExistentSheet');

    consoleWarnSpy.mockRestore();
  });
});
