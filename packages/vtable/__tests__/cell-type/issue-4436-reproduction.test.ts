// Test to reproduce the exact issue #4436
import { ListTable } from '../../src';
import { createDiv } from '../dom';

(global as any).__VERSION__ = 'none';

describe('issue #4436 reproduction', () => {
  test('switch cell should reflect new row data after deletion and renderWithRecreateCells', () => {
    const containerDom: HTMLElement = createDiv();
    containerDom.style.position = 'relative';
    containerDom.style.width = '1000px';
    containerDom.style.height = '800px';

    // Create data that matches the issue description
    const records = [
      { id: 1, switchValue: false }, // First row: switch off (as per issue)
      { id: 2, switchValue: true }, // Second row: switch on
      { id: 3, switchValue: false } // Third row: switch off
    ];

    const table = new ListTable(containerDom, {
      records,
      columns: [
        { field: 'id', title: 'ID', width: 80 },
        {
          field: 'switchValue',
          title: 'Switch',
          width: 100,
          cellType: 'switch' as const
        }
      ],
      widthMode: 'standard',
      defaultRowHeight: 40,
      heightMode: 'autoHeight'
    });

    // Verify initial state
    expect(table.getCellSwitchState(1, 1)).toBe(false); // Row 1: switch off
    expect(table.getCellSwitchState(1, 2)).toBe(true); // Row 2: switch on
    expect(table.getCellSwitchState(1, 3)).toBe(false); // Row 3: switch off

    // Delete the first row (as described in the issue)
    table.deleteRecords([0]);

    // After deletion, the remaining rows should be:
    // Row 1: original row 2 (switchValue: true)
    // Row 2: original row 3 (switchValue: false)

    // Before renderWithRecreateCells - this might show the bug
    const stateBeforeRenderRow1 = table.getCellSwitchState(1, 1);
    const stateBeforeRenderRow2 = table.getCellSwitchState(1, 2);

    // Call renderWithRecreateCells (this is where the bug occurs)
    table.renderWithRecreateCells();

    // After renderWithRecreateCells, the first visible switch should reflect the new first row's value (true)
    // This is the core of the issue - it was showing false (old state) instead of true (new state)
    expect(table.getCellSwitchState(1, 1)).toBe(true); // Should be true (original row 2's data)
    expect(table.getCellSwitchState(1, 2)).toBe(false); // Should be false (original row 3's data)

    // Verify data integrity
    expect(table.getCellOriginValue(0, 1)).toBe(2); // ID should be 2 (original row 2)
    expect(table.getCellOriginValue(0, 2)).toBe(3); // ID should be 3 (original row 3)
  });
});
