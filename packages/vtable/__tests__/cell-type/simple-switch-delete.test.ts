// Simple test for switch cell deletion
import { ListTable } from '../../src';
import { createDiv } from '../dom';

(global as any).__VERSION__ = 'none';

describe('simple switch delete test', () => {
  test('basic delete functionality', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '1000px';
    containerDom.style.height = '800px';

    const records = [
      { id: 1, enabled: false },
      { id: 2, enabled: true }
    ];

    const table = new ListTable(containerDom, {
      records,
      columns: [
        { field: 'id', title: 'ID', width: 80 },
        {
          field: 'enabled',
          title: 'Enabled',
          width: 100,
          cellType: 'switch' as const
        }
      ],
      widthMode: 'standard',
      defaultRowHeight: 40,
      heightMode: 'autoHeight'
    });

    // Check initial state
    expect(table.getCellSwitchState(1, 1)).toBe(false);
    expect(table.getCellSwitchState(1, 2)).toBe(true);

    // Delete first row
    table.deleteRecords([0]);

    // After deletion, we should have 1 row left
    expect(table.rowCount - 1).toBe(1); // -1 for header

    // The remaining row should have the correct state
    const remainingState = table.getCellSwitchState(1, 1);

    // Call renderWithRecreateCells
    table.renderWithRecreateCells();

    // Check state after render
    const stateAfterRender = table.getCellSwitchState(1, 1);

    // The state should be true (from the original row 2)
    // If this fails, it means the bug still exists
    expect(stateAfterRender).toBe(true);
  });
});
