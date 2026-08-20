import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    { orderId: 'A001', product: 'Laptop', price: 1200 },
    { orderId: 'A002', product: 'Keyboard', price: 120 },
    { orderId: 'A003', product: 'Mouse', price: 80 }
  ];

  const columns: VTable.ColumnsDefine = [
    {
      field: 'orderId',
      title: 'Order ID',
      width: 160
    },
    {
      field: 'product',
      title: 'Product',
      width: 180
    },
    {
      field: 'price',
      title: 'Price',
      width: 120
    }
  ];

  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, {
    records,
    columns,
    defaultRowHeight: 40,
    tooltip: {
      renderMode: 'html'
    }
  });

  tableInstance.on('mouseenter_cell', args => {
    const { col, row } = args;
    if (col !== 0 || row < tableInstance.columnHeaderLevelCount) {
      return;
    }

    const rect = tableInstance.getVisibleCellRangeRelativeRect({ col, row });
    tableInstance.showTooltip(col, row, {
      content: `showTooltip appearDelay=1000ms: ${tableInstance.getCellValue(col, row)}`,
      referencePosition: { rect, placement: VTable.TYPES.Placement.right },
      className: 'defineTooltip',
      appearDelay: 1000,
      disappearDelay: 100,
      style: {
        bgColor: '#202328',
        color: '#fff',
        padding: [8, 12],
        arrowMark: true
      }
    });
  });

  (window as any).tableInstance = tableInstance;
}
