import { ExcelEditCellKeyboardPlugin } from '../src/excel-edit-cell-keyboard';

describe('ExcelEditCellKeyboardPlugin', () => {
  it('should instantiate with default options', () => {
    const plugin = new ExcelEditCellKeyboardPlugin();
    expect(plugin).toBeInstanceOf(ExcelEditCellKeyboardPlugin);
    expect(plugin.name).toBe('Excel Edit Cell Keyboard');
  });

  it('should have an id and runTime', () => {
    const plugin = new ExcelEditCellKeyboardPlugin();
    expect(plugin.id).toContain('excel-edit-cell-keyboard-');
    expect(Array.isArray(plugin.runTime)).toBe(true);
  });
});

describe('ExcelEditCellKeyboardPlugin handleKeyDown', () => {
  let plugin: ExcelEditCellKeyboardPlugin;
  let mockTable: any;
  let mockEditorManager: any;
  beforeEach(() => {
    mockEditorManager = {
      beginTriggerEditCellMode: 'keydown',
      editingEditor: true,
      editCell: { col: 1, row: 2 },
      completeEdit: jest.fn(),
    };
    mockTable = {
      editorManager: mockEditorManager,
      selectCell: jest.fn(),
      getElement: () => ({ focus: jest.fn() }),
      stateManager: { select: { cellPos: { col: 1, row: 2 } } },
      getSelectedCellInfos: jest.fn(() => [[{ col: 1, row: 2 }]]),
      changeCellValue: jest.fn(),
    };
    plugin = new ExcelEditCellKeyboardPlugin();
    plugin.table = mockTable;
  });

  it('should handle Enter key', () => {
    const event = { key: 'Enter', stopPropagation: jest.fn(), preventDefault: jest.fn(), shiftKey: false, ctrlKey: false, metaKey: false };
    plugin.handleKeyDown(event as any);
    expect(mockEditorManager.completeEdit).toHaveBeenCalled();
    expect(mockTable.selectCell).toHaveBeenCalledWith(1, 3);
  });

  it('should handle Tab key', () => {
    const event = { key: 'Tab', stopPropagation: jest.fn(), preventDefault: jest.fn(), shiftKey: false, ctrlKey: false, metaKey: false };
    plugin.handleKeyDown(event as any);
    expect(mockTable.selectCell).toHaveBeenCalledWith(2, 2);
  });

  it('should handle ArrowLeft key', () => {
    const event = { key: 'ArrowLeft', stopPropagation: jest.fn(), preventDefault: jest.fn(), shiftKey: false, ctrlKey: false, metaKey: false };
    plugin.handleKeyDown(event as any);
    expect(mockTable.selectCell).toHaveBeenCalledWith(0, 2);
  });

  it('should handle Delete key', () => {
    mockEditorManager.beginTriggerEditCellMode = undefined;
    const event = { key: 'Delete', stopPropagation: jest.fn(), preventDefault: jest.fn() };
    (global as any).deleteSelectRange = (selectCells: any, tableInstance: any) => {
      selectCells.forEach((row: any[]) => row.forEach(cell => tableInstance.changeCellValue(cell.col, cell.row, '')));
    };
    plugin.handleKeyDown(event as any);
    expect(mockTable.changeCellValue).toHaveBeenCalledWith(1, 2, '');
  });
});
