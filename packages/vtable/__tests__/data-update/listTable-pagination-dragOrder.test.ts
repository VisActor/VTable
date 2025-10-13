// @ts-nocheck
import { ListTable } from '../../src';
import type * as VTable from '../../src/index';
import { createDiv } from '../dom';

global.__VERSION__ = 'none';

describe('listTable-pagination-dragOrder test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  const generateRecords = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      'Row ID': `${i + 1}`,
      'Order ID': `CA-2015-${100000 + i}`,
      'Order Date': '2015/1/4',
      'Ship Date': '2015/1/8',
      'Ship Mode': 'Standard Class',
      'Customer ID': `CUST-${1000 + i}`,
      'Customer Name': `Customer ${i + 1}`,
      Segment: 'Consumer',
      Country: 'United States',
      City: 'City',
      State: 'State',
      'Postal Code': '12345',
      Region: 'West',
      'Product ID': `PROD-${1000 + i}`,
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      'Product Name': `Product ${i + 1}`,
      Sales: `${10 + i}`,
      Quantity: `${1 + (i % 5)}`,
      Discount: '0.2',
      Profit: `${2 + i * 0.5}`
    }));
  };

  test('dragOrder with pagination - should work correctly after page change', () => {
    const records = generateRecords(20);

    const option: VTable.ListTableConstructorOptions = {
      records,
      columns: [
        {
          field: 'Order ID',
          title: 'Order ID',
          width: 'auto'
        },
        {
          field: 'Customer ID',
          title: 'Customer ID',
          width: 'auto'
        },
        {
          field: 'Product Name',
          title: 'Product Name',
          width: 'auto'
        },
        {
          field: 'Sales',
          title: 'Sales',
          width: 'auto'
        }
      ],
      widthMode: 'standard',
      rowSeriesNumber: {
        dragOrder: true,
        title: '序号',
        width: 'auto'
      },
      pagination: {
        perPageCount: 5,
        currentPage: 0
      }
    };

    const listTable = new ListTable(containerDom, option);

    // Verify initial state - first page (rowCount includes header, so 5 data rows + 1 header = 6)
    expect(listTable.rowCount).toBe(6);

    // Verify first page data using getRecordByCell
    expect(listTable.getRecordByCell(1, 1)?.['Order ID']).toBe('CA-2015-100000'); // First record on first page
    expect(listTable.getRecordByCell(1, 5)?.['Order ID']).toBe('CA-2015-100004'); // Last record on first page

    // Change to second page
    listTable.updatePagination({
      perPageCount: 5,
      currentPage: 1
    });

    // Verify second page data (rowCount includes header, so 5 data rows + 1 header = 6)
    expect(listTable.rowCount).toBe(6);
    expect(listTable.getRecordByCell(1, 1)?.['Order ID']).toBe('CA-2015-100005'); // First record on second page
    expect(listTable.getRecordByCell(1, 5)?.['Order ID']).toBe('CA-2015-100009'); // Last record on second page

    // Test dragOrder on second page - drag row 1 to row 3
    // changeOrder operates on the show indices, not cell row numbers
    // Row 1 in the grid corresponds to show index 0
    // Row 3 in the grid corresponds to show index 2

    // Debug: check current state before changeOrder
    console.log('Before changeOrder:');
    console.log('  Position 0:', listTable.getRecordByCell(1, 1)?.['Order ID']);
    console.log('  Position 1:', listTable.getRecordByCell(1, 2)?.['Order ID']);
    console.log('  Position 2:', listTable.getRecordByCell(1, 3)?.['Order ID']);

    listTable.internalProps.dataSource.changeOrder(0, 2); // Use show indices (0-based)

    // Debug: check current state after changeOrder
    console.log('After changeOrder:');
    console.log('  Position 0:', listTable.getRecordByCell(1, 1)?.['Order ID']);
    console.log('  Position 1:', listTable.getRecordByCell(1, 2)?.['Order ID']);
    console.log('  Position 2:', listTable.getRecordByCell(1, 3)?.['Order ID']);

    // After dragOrder: the records at show indices 0 and 2 should be swapped
    expect(listTable.getRecordByCell(1, 1)?.['Order ID']).toBe('CA-2015-100006'); // Show index 0 should now have what was at show index 2
    expect(listTable.getRecordByCell(1, 3)?.['Order ID']).toBe('CA-2015-100005'); // Show index 2 should now have what was at show index 0

    // Change back to first page and verify data integrity
    listTable.updatePagination({
      perPageCount: 5,
      currentPage: 0
    });

    // First page should remain unchanged
    expect(listTable.getRecordByCell(1, 1)?.['Order ID']).toBe('CA-2015-100000');
    expect(listTable.getRecordByCell(1, 5)?.['Order ID']).toBe('CA-2015-100004');

    // Change to third page and verify dragOrder didn't affect other pages
    listTable.updatePagination({
      perPageCount: 5,
      currentPage: 2
    });

    expect(listTable.getRecordByCell(1, 1)?.['Order ID']).toBe('CA-2015-100010');
    expect(listTable.getRecordByCell(1, 5)?.['Order ID']).toBe('CA-2015-100014');

    listTable.release();
  });

  test('dragOrder with pagination - multiple page changes and drag operations', () => {
    const records = generateRecords(15);

    const option: VTable.ListTableConstructorOptions = {
      records,
      columns: [
        {
          field: 'Order ID',
          title: 'Order ID',
          width: 'auto'
        },
        {
          field: 'Customer ID',
          title: 'Customer ID',
          width: 'auto'
        }
      ],
      widthMode: 'standard',
      rowSeriesNumber: {
        dragOrder: true,
        title: '序号',
        width: 'auto'
      },
      pagination: {
        perPageCount: 3,
        currentPage: 0
      }
    };

    const listTable = new ListTable(containerDom, option);

    // Initial state (rowCount includes header, so 3 data rows + 1 header = 4)
    expect(listTable.rowCount).toBe(4);
    expect(listTable.getCellOriginValue(1, 1)).toBe('CA-2015-100000');

    // Change to page 2
    listTable.updatePagination({
      perPageCount: 3,
      currentPage: 1
    });
    expect(listTable.getCellOriginValue(1, 1)).toBe('CA-2015-100003');

    // Drag on page 2 - swap show indices 1 and 2 (rows 2 and 3)
    listTable.internalProps.dataSource.changeOrder(1, 2);
    expect(listTable.getCellOriginValue(1, 1)).toBe('CA-2015-100003'); // Show index 0 should now have what was at show index 1
    expect(listTable.getCellOriginValue(1, 2)).toBe('CA-2015-100005'); // Show index 1 should now have what was at show index 0

    // Change to page 3
    listTable.updatePagination({
      perPageCount: 3,
      currentPage: 2
    });
    expect(listTable.getCellOriginValue(1, 1)).toBe('CA-2015-100006');

    // Drag on page 3
    listTable.internalProps.dataSource.changeOrder(1, 2);
    expect(listTable.getCellOriginValue(1, 1)).toBe('CA-2015-100006'); // Was row 2, now row 1
    expect(listTable.getCellOriginValue(1, 3)).toBe('CA-2015-100007'); // Was row 1, now row 2

    // Go back to page 2 and verify previous dragOrder is preserved
    listTable.updatePagination({
      perPageCount: 3,
      currentPage: 1
    });
    expect(listTable.getCellOriginValue(1, 1)).toBe('CA-2015-100003');
    expect(listTable.getCellOriginValue(1, 3)).toBe('CA-2015-100004');

    listTable.release();
  });

  test('dragOrder with pagination - edge case dragging to same position', () => {
    const records = generateRecords(10);

    const option: VTable.ListTableConstructorOptions = {
      records,
      columns: [
        {
          field: 'Order ID',
          title: 'Order ID',
          width: 'auto'
        }
      ],
      widthMode: 'standard',
      rowSeriesNumber: {
        dragOrder: true,
        title: '序号',
        width: 'auto'
      },
      pagination: {
        perPageCount: 4,
        currentPage: 1
      }
    };

    const listTable = new ListTable(containerDom, option);

    // Get initial state of page 2
    const initialValue = listTable.getRecordByCell(1, 3)?.['Order ID']; // Row 3 corresponds to show index 2

    // Try to drag row to same position (should be no-op)
    listTable.internalProps.dataSource.changeOrder(2, 2);

    // Should remain unchanged
    expect(listTable.getRecordByCell(1, 3)?.['Order ID']).toBe(initialValue);

    listTable.release();
  });
});
