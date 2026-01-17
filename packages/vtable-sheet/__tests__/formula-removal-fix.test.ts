import { VTableSheet } from '../src/index';
import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';

describe('Formula Removal Fix Tests', () => {
  let sheetInstance: VTableSheet;
  let eventLog: Array<{ type: string; sheetKey: string; data?: any }>;

  beforeEach(() => {
    eventLog = [];

    // Create a simple VTableSheet instance
    sheetInstance = new VTableSheet(document.createElement('div'), {
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet1',
          data: [
            ['1', '2'],
            ['3', '4']
          ],
          columns: [
            { title: 'Col A', width: 100 },
            { title: 'Col B', width: 100 }
          ],
          active: true
        }
      ]
    });

    // Register formula event listeners
    sheetInstance.onWorkSheetEvent(WorkSheetEventType.FORMULA_ADDED, (event: any) => {
      eventLog.push({ type: 'FORMULA_ADDED', sheetKey: event.sheetKey, data: event });
    });

    sheetInstance.onWorkSheetEvent(WorkSheetEventType.FORMULA_REMOVED, (event: any) => {
      eventLog.push({ type: 'FORMULA_REMOVED', sheetKey: event.sheetKey, data: event });
    });
  });

  test('Formula is properly removed when setting empty string', () => {
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a formula first
    worksheet!.setCellFormula(0, 0, '=SUM(A1:B1)');

    // Check that formula was added
    const addedEvents = eventLog.filter(e => e.type === 'FORMULA_ADDED');
    expect(addedEvents.length).toBeGreaterThan(0);

    // Clear the event log
    eventLog = [];

    // Set empty string to remove the formula
    worksheet!.setCellValue(0, 0, '');

    // Check that formula removal event fired
    const removedEvents = eventLog.filter(e => e.type === 'FORMULA_REMOVED');
    expect(removedEvents.length).toBeGreaterThan(0);
    expect(removedEvents[0].sheetKey).toBe('sheet1');
  });

  test('Formula is properly removed when setting non-formula value', () => {
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a formula first
    worksheet!.setCellFormula(0, 0, '=A1+B1');

    // Clear the event log
    eventLog = [];

    // Set a regular value to remove the formula
    worksheet!.setCellValue(0, 0, 'Regular Text');

    // Check that formula removal event fired
    const removedEvents = eventLog.filter(e => e.type === 'FORMULA_REMOVED');
    expect(removedEvents.length).toBeGreaterThan(0);
  });

  test('Formula cache is properly cleared after removal', () => {
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a formula
    worksheet!.setCellFormula(0, 0, '=A1*2');

    // Verify formula exists
    const hasFormulaBefore = worksheet!.vtableSheet.formulaManager.isCellFormula({
      sheet: 'sheet1',
      row: 0,
      col: 0
    });
    expect(hasFormulaBefore).toBe(true);

    // Remove the formula by setting empty string
    worksheet!.setCellValue(0, 0, '');

    // Verify formula no longer exists
    const hasFormulaAfter = worksheet!.vtableSheet.formulaManager.isCellFormula({
      sheet: 'sheet1',
      row: 0,
      col: 0
    });
    expect(hasFormulaAfter).toBe(false);
  });

  test('Multiple formula operations work correctly', () => {
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set formula 1
    worksheet!.setCellFormula(0, 0, '=A1+B1');
    expect(eventLog.filter(e => e.type === 'FORMULA_ADDED').length).toBe(1);

    // Set formula 2 (should trigger removal of first formula)
    eventLog = [];
    worksheet!.setCellFormula(0, 0, '=A1*B1');

    // Should have both removal and addition events
    const removedEvents = eventLog.filter(e => e.type === 'FORMULA_REMOVED');
    const addedEvents = eventLog.filter(e => e.type === 'FORMULA_ADDED');

    expect(removedEvents.length).toBeGreaterThan(0);
    expect(addedEvents.length).toBeGreaterThan(0);
  });

  test('Formula removal works through formula manager directly', () => {
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a formula through formula manager
    worksheet!.vtableSheet.formulaManager.setCellContent({ sheet: 'sheet1', row: 0, col: 0 }, '=SUM(A1:A10)');

    // Clear event log
    eventLog = [];

    // Remove formula by setting empty value
    worksheet!.vtableSheet.formulaManager.setCellContent({ sheet: 'sheet1', row: 0, col: 0 }, '');

    // Check that removal event fired
    const removedEvents = eventLog.filter(e => e.type === 'FORMULA_REMOVED');
    expect(removedEvents.length).toBeGreaterThan(0);
  });

  test('Formula removal with null value works correctly', () => {
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a formula
    worksheet!.setCellFormula(0, 0, '=A1/B1');

    // Clear event log
    eventLog = [];

    // Remove formula by setting null (should be converted to empty string)
    worksheet!.setCellValue(0, 0, null as any);

    // Check that removal event fired
    const removedEvents = eventLog.filter(e => e.type === 'FORMULA_REMOVED');
    expect(removedEvents.length).toBeGreaterThan(0);
  });
});
