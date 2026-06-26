import * as VTable from '../../src';
import data from '../../__tests__/data/North_American_Superstore_data.json';

const CONTAINER_ID = 'vTable';

type DemoRecord = Record<string, unknown> & {
  vtableMergeName?: string;
  children?: DemoRecord[];
};

export function createTable() {
  const columns: VTable.ColumnsDefine = [
    { field: 'Order ID', title: 'Order ID', width: 'auto' },
    { field: 'Customer ID', title: 'Customer ID', width: 'auto' },
    { field: 'Product Name', title: 'Product Name', width: 'auto' },
    { field: 'Category', title: 'Category', width: 'auto' },
    { field: 'Sub-Category', title: 'Sub-Category', width: 'auto' },
    { field: 'Region', title: 'Region', width: 'auto' },
    { field: 'Sales', title: 'Sales', width: 'auto' },
    { field: 'Profit', title: 'Profit', width: 'auto' }
  ];

  const records = (data as DemoRecord[]).slice(0, 100);
  const nextRecords = (data as DemoRecord[]).slice(100, 200);
  const dom = document.getElementById(CONTAINER_ID) as HTMLElement;
  let useNextRecords = false;

  const createOption = (currentRecords: DemoRecord[]): VTable.ListTableConstructorOptions => ({
    records: currentRecords,
    columns,
    widthMode: 'standard',
    groupConfig: {
      groupBy: ['Category', 'Sub-Category'],
      titleFieldFormat: (record: DemoRecord) => `${record.vtableMergeName}(${record.children?.length ?? 0})`,
      enableTreeStickCell: true
    },
    theme: VTable.themes.DEFAULT.extends({
      groupTitleStyle: {
        fontWeight: 'bold',
        color: 'orange',
        bgColor: args => {
          const index = args.table.getGroupTitleLevel(args.col, args.row);
          return index === undefined ? undefined : ['#f7f1ff', '#e8f4ff', '#fff7e6'][index % 3];
        }
      }
    })
  });

  const tableInstance = new VTable.ListTable(dom, createOption(records));
  window.tableInstance = tableInstance;

  dom.style.width = '1000px';
  dom.style.height = '600px';
  tableInstance.updateOption(createOption(records));

  const toolbar = document.createElement('div');
  toolbar.style.margin = '12px 0';
  const button = document.createElement('button');
  button.textContent = 'updateOption 替换 records';
  button.onclick = async () => {
    useNextRecords = !useNextRecords;
    await tableInstance.updateOption(createOption(useNextRecords ? nextRecords : records));
  };
  toolbar.appendChild(button);
  document.getElementById(CONTAINER_ID)?.parentElement?.insertBefore(toolbar, document.getElementById(CONTAINER_ID));

  setTimeout(() => {
    void button.onclick?.(new MouseEvent('click'));
  }, 0);
}
