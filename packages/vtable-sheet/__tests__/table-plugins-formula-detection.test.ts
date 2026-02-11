// @ts-nocheck
import { createFormulaDetectionOptions } from '../src/core/table-plugins';

describe('table-plugins formula detection', () => {
  test('should use active worksheet key for formula lookup', () => {
    const formulaManager = {
      isCellFormula: jest.fn().mockReturnValue(true),
      getCellFormula: jest.fn().mockReturnValue('=SUM(C2:C4)'),
      setCellContent: jest.fn()
    };

    const vtableSheet = {
      formulaManager,
      getActiveSheet: () => ({
        getKey: () => 'sheet1'
      }),
      sheetManager: {
        _activeSheetKey: 'Sheet1',
        getActiveSheet: () => ({ sheetKey: 'sheet1' })
      }
    };

    const detection = createFormulaDetectionOptions(undefined, undefined, vtableSheet);

    detection.isFormulaCell(2, 6, null, {} as any);
    expect(formulaManager.isCellFormula).toHaveBeenCalledWith({ sheet: 'sheet1', row: 6, col: 2 });

    detection.getCellFormula(2, 6, null, {} as any);
    expect(formulaManager.getCellFormula).toHaveBeenCalledWith({ sheet: 'sheet1', row: 6, col: 2 });

    detection.setCellFormula(2, 6, '=SUM(C2:C4)', {} as any);
    expect(formulaManager.setCellContent).toHaveBeenCalledWith({ sheet: 'sheet1', row: 6, col: 2 }, '=SUM(C2:C4)');
  });
});
