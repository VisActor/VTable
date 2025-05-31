import * as VTable from '@visactor/vtable';
import { ExcelImportPlugin } from '../../src/excel-import';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [];
  const columns: VTable.ColumnsDefine = [
    { field: 'col0', title: '示例列1', width: 200 },
    { field: 'col1', title: '示例列2', width: 200 }
  ];
  const excelImportPlugin = new ExcelImportPlugin({
    headerRowCount: 2,
    exportJson: false,
    buttonText: 'Excel导入',
    onImported: (columns, records) => {
      console.log('导入完成', columns, records);
    }
  });
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    theme: VTable.themes.DEFAULT,
    select: { disableSelect: false },
    plugins: [excelImportPlugin]
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.position = 'relative';
  container.style.width = '1000px';
  container.style.height = '600px';
  container.style.margin = '24px auto';
  document.body.appendChild(container);
  createTable();
});
