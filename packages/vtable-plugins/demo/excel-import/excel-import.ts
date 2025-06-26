import * as VTable from '@visactor/vtable';
import { ExcelImportPlugin } from '../../src/excel-import';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      col0: '张三',
      col1: '25',
      col2: '技术部',
      col3: '8000'
    },
    {
      col0: '李四',
      col1: '30',
      col2: '销售部',
      col3: '6000'
    }
  ];
  const columns: VTable.ColumnsDefine = [
    {
      field: 'col0',
      title: '姓名',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col1',
      title: '年龄',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col2',
      title: '部门',
      cellType: 'text',
      headerType: 'text'
    },
    {
      field: 'col3',
      title: '工资',
      cellType: 'text',
      headerType: 'text'
    }
  ];
  const excelImportPlugin = new ExcelImportPlugin({
    exportData: true
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
  const panelContainer = document.createElement('div');
  const buttonContainer = document.createElement('div');
  const textareaContainer = document.createElement('div');
  textareaContainer.style.marginTop = '8px';
  const dataTextArea = document.createElement('textarea');
  dataTextArea.rows = 5;
  dataTextArea.cols = 50;
  dataTextArea.placeholder = '在此粘贴JSON或CSV数据(格式需正确)';
  dataTextArea.style.width = '100%';
  dataTextArea.style.boxSizing = 'border-box';
  dataTextArea.style.padding = '8px';

  panelContainer.style.position = 'absolute';
  panelContainer.style.top = '10px';
  panelContainer.style.right = '10px';
  panelContainer.style.zIndex = '1000';
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
    let jsonData: string | object;
    if (dataTextArea.value.trim()) {
      try {
        jsonData = JSON.parse(dataTextArea.value.trim());
      } catch (error) {
        console.error('JSON格式错误');
        return;
      }
    } else {
      jsonData = [
        {
          "col0": "赵六",
          "col1": "32",
          "col2": "市场部",
          "col3": "7000"
        },
        {
          "col0": "钱七",
          "col1": "26",
          "col2": "技术部",
          "col3": "8500"
        },
        {
          "col0": "孙八",
          "col1": "29",
          "col2": "人事部",
          "col3": "6500"
        }
      ];
    }
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
    const csvData =
      dataTextArea.value.trim() ||
      `姓名;年龄;部门;工资
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
  panelContainer.appendChild(buttonContainer);
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  textareaContainer.appendChild(dataTextArea);
  panelContainer.appendChild(textareaContainer);
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer && tableContainer.parentElement) {
    tableContainer.appendChild(panelContainer);
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
