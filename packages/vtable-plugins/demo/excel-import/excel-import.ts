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
    exportData: true,
    supportedTypes: ['csv', 'json', 'xlsx', 'html'],
    autoTable: true,
    autoColumns: true
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
  addImportButton(excelImportPlugin);
  window.tableInstance = tableInstance;
}

function addImportButton(importPlugin: ExcelImportPlugin) {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.top = '10px';
  buttonContainer.style.right = '10px';
  buttonContainer.style.zIndex = '1000';
  buttonContainer.style.display = 'flex';
  buttonContainer.style.gap = '8px';
  buttonContainer.style.flexWrap = 'wrap';

  const importButton = document.createElement('button');
  importButton.textContent = '导入文件';
  importButton.addEventListener('click', async () => {
    try {
      await importPlugin.import('file', undefined, {
        delimiter: ',' //注意，如果用户需要使用文件传入csv并且文件中的分隔符需要自定义的话，我需要传入第二个参数为undefined
      });
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + (error as Error).message);
    }
  });

  const jsonButton = document.createElement('button');
  jsonButton.textContent = '导入JSON';
  jsonButton.addEventListener('click', async () => {
    const jsonData = [
      { name: '赵六', age: 32, department: '市场部', salary: 7000 },
      { name: '钱七', age: 26, department: '技术部', salary: 8500 },
      { name: '孙八', age: 29, department: '人事部', salary: 6500 }
    ];
    try {
      await importPlugin.import('json', jsonData);
    } catch (error) {
      console.error('JSON导入失败:', error);
      alert('JSON导入失败: ' + (error as Error).message);
    }
  });

  const delimiterButton = document.createElement('button');
  delimiterButton.textContent = '分号分隔CSV';

  delimiterButton.addEventListener('click', async () => {
    const csvData = `姓名;年龄;部门;工资
张三;25;技术部;8000
李四;30;销售部;6000
王五;28;技术部;9000`;
    try {
      await importPlugin.import('csv', csvData, {
        delimiter: ';'
      });
    } catch (error) {
      console.error('自定义分隔符导入失败:', error);
      alert('自定义分隔符导入失败: ' + (error as Error).message);
    }
  });
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer && tableContainer.parentElement) {
    tableContainer.appendChild(buttonContainer);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.createElement('div');
  mainContainer.style.position = 'relative';
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  container.style.position = 'relative';
  container.style.width = 'calc(100% - 40px)';
  container.style.height = 'calc(100% - 120px)';
  container.style.margin = '0 20px 20px 20px';
  mainContainer.appendChild(container);
  document.body.appendChild(mainContainer);
  createTable();
});
