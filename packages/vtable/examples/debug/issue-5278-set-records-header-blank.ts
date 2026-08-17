import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';
const TOOLBAR_ID = 'issue5278Toolbar';
const STATUS_ID = 'issue5278Status';

const baseColumns = [
  'Order ID',
  'Customer ID',
  'Product Name',
  'Category',
  'Sub-Category',
  'Region',
  'City',
  'Order Date',
  'Quantity',
  'Sales',
  'Profit'
];

const records = Array.from({ length: 6 }, (_, index) => {
  const record: Record<string, string | number> = {
    'Order ID': `CA-2026-${1000 + index}`,
    'Customer ID': `C-${100 + index}`,
    'Product Name': ['Bookcase', 'Chair', 'Table', 'Phone', 'Binder', 'Storage'][index],
    Category: ['Furniture', 'Technology', 'Office Supplies'][index % 3],
    'Sub-Category': ['Bookcases', 'Chairs', 'Tables', 'Phones', 'Binders', 'Storage'][index],
    Region: ['East', 'West', 'Central'][index % 3],
    City: ['New York', 'Seattle', 'Chicago', 'Boston', 'Austin', 'Denver'][index],
    'Order Date': `2026-01-${String(index + 1).padStart(2, '0')}`,
    Quantity: index + 1,
    Sales: 100 + index * 20,
    Profit: 10 + index * 5
  };

  for (let col = 0; col < 300; col++) {
    record[`Sales${col}`] = 1000 + index * 300 + col;
  }

  return record;
});

const columns: VTable.ColumnsDefine = [
  ...baseColumns.map(field => ({
    field,
    title: field,
    width: 'auto'
  })),
  ...Array.from({ length: 300 }, (_, index) => ({
    field: `Sales${index}`,
    title: `Sales${index}`,
    width: 120
  }))
];

const setStatus = (message: string) => {
  const status = document.getElementById(STATUS_ID);
  if (status) {
    status.textContent = message;
  }
};

export function createTable() {
  document.getElementById(TOOLBAR_ID)?.remove();

  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '900px';
  container.style.height = '420px';

  const toolbar = document.createElement('div');
  toolbar.id = TOOLBAR_ID;
  toolbar.style.cssText = ['display: flex', 'gap: 8px', 'align-items: center', 'height: 40px', 'font-size: 12px'].join(
    ';'
  );

  const runButton = document.createElement('button');
  runButton.id = 'issue5278Run';
  runButton.textContent = 'scroll right + setRecords([])';
  const resetButton = document.createElement('button');
  resetButton.id = 'issue5278Reset';
  resetButton.textContent = 'reset records';
  const status = document.createElement('strong');
  status.id = STATUS_ID;

  toolbar.append(runButton, resetButton, status);
  container.before(toolbar);

  const tableInstance = new VTable.ListTable(container, {
    records: records.slice(),
    frozenRowCount: 3,
    bottomFrozenRowCount: 1,
    frozenColCount: 2,
    rightFrozenColCount: 2,
    columns,
    widthMode: 'standard',
    rowSeriesNumber: {
      width: 50,
      format: () => '',
      cellType: 'checkbox',
      headerType: 'checkbox'
    }
  });

  const scrollToRight = () => {
    tableInstance.setScrollLeft(100000);
  };

  const run = () => {
    scrollToRight();
    tableInstance.setRecords([]);
    setStatus(`records=${tableInstance.records.length}, scrollLeft=${tableInstance.getScrollLeft()}`);
  };

  const reset = () => {
    tableInstance.setRecords(records.slice());
    scrollToRight();
    setStatus(`records=${tableInstance.records.length}, scrollLeft=${tableInstance.getScrollLeft()}`);
  };

  runButton.addEventListener('click', run);
  resetButton.addEventListener('click', reset);

  const release = tableInstance.release.bind(tableInstance);
  tableInstance.release = () => {
    document.getElementById(TOOLBAR_ID)?.remove();
    release();
  };

  (window as any).tableInstance = tableInstance;
  (window as any).issue5278Run = run;
  (window as any).issue5278Reset = reset;

  requestAnimationFrame(() => {
    scrollToRight();
    setStatus(`records=${tableInstance.records.length}, scrollLeft=${tableInstance.getScrollLeft()}`);
  });
}
