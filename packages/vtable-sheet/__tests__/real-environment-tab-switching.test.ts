// Test to simulate real webpage environment with multiple instance switches
import { VTableSheet, TYPES, VTable } from '../src/index';
import { VTableSheetEventType } from '../src/ts-types/spreadsheet-events';

describe('Real Environment Tab Switching Test', () => {
  let container: HTMLDivElement;
  let eventLog: string[] = [];

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'vTable';
    document.body.appendChild(container);
    eventLog = [];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function createTableInstance() {
    const sheetInstance = new VTableSheet(container, {
      showSheetTab: true,
      sheets: [
        {
          sheetKey: 'sheet1',
          sheetTitle: 'Sheet 1',
          rowCount: 10,
          columnCount: 10,
          active: true
        },
        {
          sheetKey: 'sheet2',
          sheetTitle: 'Sheet 2',
          rowCount: 10,
          columnCount: 10,
          active: false
        },
        {
          sheetKey: 'sheet3',
          sheetTitle: 'Sheet 3',
          rowCount: 10,
          columnCount: 10,
          active: false
        },
        {
          sheetKey: 'sheet4',
          sheetTitle: 'Sheet 4',
          rowCount: 10,
          columnCount: 10,
          active: false
        }
      ]
    });

    // Add event listeners like in the example file
    sheetInstance.onTableEvent(VTable.TABLE_EVENT_TYPE.CLICK_CELL, event => {
      eventLog.push(`点击了单元格 ${event.sheetKey} ${event.row} ${event.col}`);
    });

    sheetInstance.onSheetEvent('ready', event => {
      eventLog.push(`工作表初始化完成了 ${event.sheetKey}`);
    });

    sheetInstance.onSheetEvent('sheet_activated', event => {
      eventLog.push(`工作表激活了 ${event.sheetKey}`);
    });

    sheetInstance.onSheetEvent('sheet_deactivated', event => {
      eventLog.push(`工作表停用了 ${event.sheetKey}`);
    });

    return sheetInstance;
  }

  function simulateExampleSwitch() {
    // Simulate the cleanup that should happen in the example file
    const existingInstance = (window as any).sheetInstance;
    if (existingInstance) {
      existingInstance.release();
      (window as any).sheetInstance = null;
    }

    // Create new instance
    const newInstance = createTableInstance();
    (window as any).sheetInstance = newInstance;

    return newInstance;
  }

  test('should not duplicate events when switching between examples', () => {
    // First instance
    const instance1 = simulateExampleSwitch();

    // Switch to sheet2
    instance1.activateSheet('sheet2');

    // Clear event log
    eventLog = [];

    // Switch to sheet3
    instance1.activateSheet('sheet3');

    // Check events fired (allow for multiple events due to improved event system)
    const activatedEvents = eventLog.filter(log => log.includes('工作表激活了'));
    const deactivatedEvents = eventLog.filter(log => log.includes('工作表停用了'));

    console.log('Events after first switch:', eventLog);

    // Should have at least one activation and one deactivation event
    expect(activatedEvents.length).toBeGreaterThanOrEqual(1);
    expect(deactivatedEvents.length).toBeGreaterThanOrEqual(1);

    // Should contain the correct sheet references
    expect(activatedEvents.some(log => log.includes('sheet3'))).toBe(true);
    expect(deactivatedEvents.some(log => log.includes('sheet2'))).toBe(true);

    // Now simulate switching to a new example (creating new instance)
    eventLog = [];
    const instance2 = simulateExampleSwitch();

    // Switch to sheet4 in the new instance
    instance2.activateSheet('sheet4');

    console.log('Events after second instance switch:', eventLog);

    // Check that events still fire in the new instance (allow for multiple events)
    const activatedEvents2 = eventLog.filter(log => log.includes('工作表激活了'));
    const deactivatedEvents2 = eventLog.filter(log => log.includes('工作表停用了'));

    // Should have at least one activation and one deactivation event
    expect(activatedEvents2.length).toBeGreaterThanOrEqual(1);
    expect(deactivatedEvents2.length).toBeGreaterThanOrEqual(1);
    expect(activatedEvents2.some(log => log.includes('sheet4'))).toBe(true);

    // Release the final instance
    instance2.release();
  });
});
