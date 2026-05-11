import * as VTable from '@visactor/vtable';
import * as VTablePlugins from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const columns: VTable.ColumnsDefine = [
    {
      field: 'name',
      title: 'Name',
      width: 150
    },
    {
      field: 'sales',
      title: 'Sales',
      width: 150,
      fieldFormat: rec => {
        if (rec.sales) {
          return `$${rec.sales}`;
        }
        return '';
      }
    }
  ];

  const records = [{ name: 'John', sales: 100 }, { name: 'Jane', sales: 200 }, { name: 'Doe', sales: 300 }, {}, {}, {}];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID)!,
    columns,
    records,
    excelOptions: {
      fillHandle: true
    },
    plugins: [new VTablePlugins.AutoFillPlugin()]
  };

  const instance = new VTable.ListTable(option);
  (window as any).tableInstance = instance;
}
