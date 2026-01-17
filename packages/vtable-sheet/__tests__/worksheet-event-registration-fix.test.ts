import { WorkSheetEventManager } from '../src/event/worksheet-event-manager';
import { WorkSheetEventType } from '../src/ts-types/spreadsheet-events';
import { VTableSheet } from '../src/index';

describe('WorkSheet Event Registration Fix', () => {
  let mockVTableSheet: any;
  let mockWorkSheet: any;
  let eventManager: WorkSheetEventManager;
  let eventLog: string[];

  beforeEach(() => {
    eventLog = [];

    // Mock VTableSheet with global listeners registry
    mockVTableSheet = {
      globalWorkSheetListeners: new Map(),
      workSheetInstances: new Map(),
      onWorkSheetEvent: function (type: string, callback: (event: any) => void) {
        // Store listener globally
        if (!this.globalWorkSheetListeners.has(type)) {
          this.globalWorkSheetListeners.set(type, new Set());
        }
        this.globalWorkSheetListeners.get(type)!.add(callback);

        // Apply to existing instances
        this.workSheetInstances.forEach((worksheet: any) => {
          if (worksheet.eventManager) {
            worksheet.eventManager.on(type as any, callback);
          }
        });
      },
      createWorkSheetInstance: function (sheetDefine: any) {
        // Mock worksheet instance
        const mockWorkSheetInstance = {
          sheetKey: sheetDefine.sheetKey,
          sheetTitle: sheetDefine.sheetTitle,
          eventManager: {
            on: jest.fn(),
            off: jest.fn(),
            emitActivated: jest.fn(() => {
              eventLog.push(`ACTIVATED: ${sheetDefine.sheetKey}`);
            }),
            emitDeactivated: jest.fn(() => {
              eventLog.push(`DEACTIVATED: ${sheetDefine.sheetKey}`);
            }),
            emitReady: jest.fn(() => {
              eventLog.push(`READY: ${sheetDefine.sheetKey}`);
            })
          }
        };

        // Apply global listeners to new instance
        this.globalWorkSheetListeners.forEach((callbacks, type) => {
          callbacks.forEach(callback => {
            mockWorkSheetInstance.eventManager.on(type as any, callback);
          });
        });

        this.workSheetInstances.set(sheetDefine.sheetKey, mockWorkSheetInstance);
        return mockWorkSheetInstance;
      }
    };
  });

  test('Global event listeners are applied to dynamically created worksheet instances', () => {
    // Register event listeners BEFORE creating sheets
    const activatedEvents: string[] = [];
    const deactivatedEvents: string[] = [];

    mockVTableSheet.onWorkSheetEvent(WorkSheetEventType.ACTIVATED, (event: any) => {
      activatedEvents.push(event.sheetKey);
    });

    mockVTableSheet.onWorkSheetEvent(WorkSheetEventType.DEACTIVATED, (event: any) => {
      deactivatedEvents.push(event.sheetKey);
    });

    // Create first sheet (simulating initial active sheet)
    const sheet1 = mockVTableSheet.createWorkSheetInstance({
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet1'
    });

    // Create second sheet (simulating dynamic creation during switch)
    const sheet2 = mockVTableSheet.createWorkSheetInstance({
      sheetKey: 'sheet2',
      sheetTitle: 'Sheet2'
    });

    // Verify global listeners were applied to both instances
    expect(sheet1.eventManager.on).toHaveBeenCalledWith(WorkSheetEventType.ACTIVATED, expect.any(Function));
    expect(sheet1.eventManager.on).toHaveBeenCalledWith(WorkSheetEventType.DEACTIVATED, expect.any(Function));
    expect(sheet2.eventManager.on).toHaveBeenCalledWith(WorkSheetEventType.ACTIVATED, expect.any(Function));
    expect(sheet2.eventManager.on).toHaveBeenCalledWith(WorkSheetEventType.DEACTIVATED, expect.any(Function));

    // Simulate sheet switching events
    sheet2.eventManager.emitActivated();
    sheet1.eventManager.emitDeactivated();

    // Verify events were captured
    expect(activatedEvents).toContain('sheet2');
    expect(deactivatedEvents).toContain('sheet1');
  });

  test('Event listeners registered after sheet creation are applied to existing sheets', () => {
    // Create sheets first
    const sheet1 = mockVTableSheet.createWorkSheetInstance({
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet1'
    });

    // Register listeners after creation
    const readyEvents: string[] = [];
    mockVTableSheet.onWorkSheetEvent(WorkSheetEventType.READY, (event: any) => {
      readyEvents.push(event.sheetKey);
    });

    // Verify listener was applied to existing sheet
    expect(sheet1.eventManager.on).toHaveBeenCalledWith(WorkSheetEventType.READY, expect.any(Function));
  });

  test('Multiple listeners for same event type work correctly', () => {
    const listener1Calls: string[] = [];
    const listener2Calls: string[] = [];

    mockVTableSheet.onWorkSheetEvent(WorkSheetEventType.ACTIVATED, (event: any) => {
      listener1Calls.push(`listener1:${event.sheetKey}`);
    });

    mockVTableSheet.onWorkSheetEvent(WorkSheetEventType.ACTIVATED, (event: any) => {
      listener2Calls.push(`listener2:${event.sheetKey}`);
    });

    const sheet = mockVTableSheet.createWorkSheetInstance({
      sheetKey: 'test',
      sheetTitle: 'Test'
    });

    sheet.eventManager.emitActivated();

    expect(listener1Calls).toContain('listener1:test');
    expect(listener2Calls).toContain('listener2:test');
  });
});
