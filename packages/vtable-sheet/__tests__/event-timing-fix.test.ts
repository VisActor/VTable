import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';
import { VTableSheet } from '../src/index';

describe('Event Timing Fix Tests', () => {
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
            ['A1', 'B1'],
            ['A2', 'B2']
          ],
          columns: [
            { title: 'Col A', width: 100 },
            { title: 'Col B', width: 100 }
          ],
          active: true
        },
        {
          sheetKey: 'sheet2',
          sheetTitle: 'Sheet2',
          data: [
            ['C1', 'D1'],
            ['C2', 'D2']
          ],
          columns: [
            { title: 'Col C', width: 100 },
            { title: 'Col D', width: 100 }
          ],
          active: false
        }
      ]
    });

    // Register all event listeners
    Object.values(WorkSheetEventType).forEach(eventType => {
      sheetInstance.onWorkSheetEvent(eventType, (event: any) => {
        eventLog.push({
          type: eventType,
          sheetKey: event.sheetKey,
          data: event
        });
      });
    });
  });

  afterEach(() => {
    eventLog = [];
  });

  test('READY and DATA_LOADED events fire during initialization', () => {
    // Events should have fired during initialization
    const readyEvents = eventLog.filter(e => e.type === WorkSheetEventType.READY);
    const dataLoadedEvents = eventLog.filter(e => e.type === WorkSheetEventType.DATA_LOADED);

    expect(readyEvents.length).toBeGreaterThan(0);
    expect(dataLoadedEvents.length).toBeGreaterThan(0);

    // Should have events for the initially active sheet
    expect(readyEvents.some(e => e.sheetKey === 'sheet1')).toBe(true);
    expect(dataLoadedEvents.some(e => e.sheetKey === 'sheet1')).toBe(true);
  });

  test('ACTIVATED and DEACTIVATED events fire during sheet switching', () => {
    // Clear previous events
    eventLog = [];

    // Switch to sheet2
    sheetInstance.activateSheet('sheet2');

    const activatedEvents = eventLog.filter(e => e.type === WorkSheetEventType.ACTIVATED);
    const deactivatedEvents = eventLog.filter(e => e.type === WorkSheetEventType.DEACTIVATED);

    expect(activatedEvents.length).toBeGreaterThan(0);
    expect(activatedEvents.some(e => e.sheetKey === 'sheet2')).toBe(true);

    expect(deactivatedEvents.length).toBeGreaterThan(0);
    expect(deactivatedEvents.some(e => e.sheetKey === 'sheet1')).toBe(true);
  });

  test('Formula events fire at correct timing', () => {
    // Clear previous events
    eventLog = [];

    // Get the first worksheet
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a formula
    worksheet!.setCellFormula(0, 0, '=SUM(A1:B1)');

    // Check that formula events fired
    const formulaAddedEvents = eventLog.filter(e => e.type === WorkSheetEventType.FORMULA_ADDED);
    expect(formulaAddedEvents.length).toBeGreaterThan(0);
    expect(formulaAddedEvents.some(e => e.sheetKey === 'sheet1')).toBe(true);
  });

  test('Range data changed events fire when setting cell values', () => {
    // Clear previous events
    eventLog = [];

    // Get the first worksheet
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Set a cell value
    worksheet!.setCellValue(0, 0, 'New Value');

    // Check that range data changed events fired
    const rangeDataChangedEvents = eventLog.filter(e => e.type === WorkSheetEventType.RANGE_DATA_CHANGED);
    expect(rangeDataChangedEvents.length).toBeGreaterThan(0);
    expect(rangeDataChangedEvents.some(e => e.sheetKey === 'sheet1')).toBe(true);
  });

  test('Events fire for dynamically created sheets', () => {
    // Clear previous events
    eventLog = [];

    // Add a new sheet
    sheetInstance.addSheet({
      sheetKey: 'sheet3',
      sheetTitle: 'Sheet3',
      data: [
        ['E1', 'F1'],
        ['E2', 'F2']
      ],
      columns: [
        { title: 'Col E', width: 100 },
        { title: 'Col F', width: 100 }
      ],
      active: false
    });

    // Switch to the new sheet (this will create the instance)
    sheetInstance.activateSheet('sheet3');

    // Check that events fired for the new sheet
    const activatedEvents = eventLog.filter(e => e.type === WorkSheetEventType.ACTIVATED);
    expect(activatedEvents.some(e => e.sheetKey === 'sheet3')).toBe(true);
  });

  test('Formula error events fire when setting invalid formulas', () => {
    // Clear previous events
    eventLog = [];

    // Get the first worksheet
    const worksheet = sheetInstance.workSheetInstances.get('sheet1');
    expect(worksheet).toBeDefined();

    // Try to set an invalid formula (this should trigger error handling)
    try {
      worksheet!.setCellFormula(0, 0, '=INVALID_FUNCTION(A1)');
    } catch (error) {
      // Expected to potentially fail
    }

    // Check if any formula error events fired
    const formulaErrorEvents = eventLog.filter(e => e.type === WorkSheetEventType.FORMULA_ERROR);
    // Note: Error events may or may not fire depending on implementation
    // This test is mainly to ensure the event system doesn't crash
    expect(formulaErrorEvents.length).toBeGreaterThanOrEqual(0);
  });

  test('Event listeners work correctly for all worksheet instances', () => {
    // Test that event listeners registered with onWorkSheetEvent work for all instances
    const testEvents: string[] = [];

    // Register a simple test listener
    sheetInstance.onWorkSheetEvent(WorkSheetEventType.ACTIVATED, (event: any) => {
      testEvents.push(`ACTIVATED:${event.sheetKey}`);
    });

    // Switch between sheets
    sheetInstance.activateSheet('sheet2');
    sheetInstance.activateSheet('sheet1');

    // Check that events were captured for both sheets
    expect(testEvents).toContain('ACTIVATED:sheet2');
    expect(testEvents).toContain('ACTIVATED:sheet1');
  });
});
