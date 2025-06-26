# Excel import plugin

## Feature Introduction

The `ExcelImportPlugin` is a plugin developed to enable VTable to support the import of Excel files, and it also supports the import of CSV, JSON, XLSX, and HTML files.

This plugin takes effect at the beginning of `VTable.TABLE EVENT TYPE.INITIALIZED`

When it is necessary to use this plugin, please call the `import` interface in `ExcelImportPlugin` to achieve file import

Currently, this plugin does not support the import of pivot tables.

## Plugin Configuration

When calling the constructor `ExcelImportPlugin`, the configured `ExcelImportOptions` need to be passed in.

```
ExcelImportOptions {
  id?: string;
  headerRowCount?: number;
  exportData?: boolean;
  supportedTypes?: string[];
  autoTable?: boolean;
  autoColumns?: boolean;
  delimiter?: string;
  encoding?: string;
  batchSize?: number;
  enableBatchProcessing?: boolean;
  asyncDelay?: number;
}
```

This is the import method called by our plugin

```
  async import(
    type: 'file' | 'csv' | 'json' | 'xlsx' | 'html',
    source?: string | object | HTMLInputElement,
    options?: Partial<ExcelImportOptions>
  ): Promise<ImportResult>
```

Because the `import` method we call can accept at most three parameters, that is to say, when we `import` a file and need to define the `delimiter`, we need to pass the second parameter as the `source`, and then pass our `option`, where we define the `delimiter` in this `option`. Of course, we can also pass the `delimiter` we need when initializing the `ExcelImportPlugin` at the very beginning.

```
      await importPlugin.import('file', undefined, {
        delimiter: ','
      });
```

## Plugin example

Initialize the plugin object and add it to the "plugins" section of the configuration.
```
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
```

```javascript livedemo template=vtable
function createTable() {
  const records = [];
  const columns = [
    { field: 'col0', title: '示例列1', width: 200 },
    { field: 'col1', title: '示例列2', width: 200 }
  ];
  const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
    exportData: true,
    supportedTypes: ['csv', 'json', 'xlsx', 'html'],
    autoTable: true,
    autoColumns: true
  });
  const option = {
    container: document.getElementById(CONTAINER_ID),
    records,
    columns,
    theme: VTable.themes.DEFAULT,
    select: { disableSelect: false },
    plugins: [excelImportPlugin]
  };
  const tableInstance = new VTable.ListTable(option);
  addImportButton(excelImportPlugin, tableInstance);
  window.tableInstance = tableInstance;
}

function addImportButton(importPlugin, tableInstance) {
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
      //注意，如果用户需要使用文件传入csv并且文件中的分隔符需要自定义的话，我需要传入第二个参数为undefined
      const result = await importPlugin.import('file');
      console.log('导入成功:', result);
    } catch (error) {
      console.error('导入失败:', error);
      alert('导入失败: ' + (error.message || error));
    }
  });

  const jsonButton = document.createElement('button');
  jsonButton.textContent = '导入JSON数据';
  jsonButton.addEventListener('click', async () => {
    let jsonData;
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
      const result = await importPlugin.import('json', jsonData);
      console.log('JSON导入成功:', result);
    } catch (error) {
      console.error('JSON导入失败:', error);
      alert('JSON导入失败: ' + (error.message || error));
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
      const result = await importPlugin.import('csv', csvData, {
        delimiter: ';'
      });
      console.log('分号分隔CSV导入成功:', result);
    } catch (error) {
      console.error('分号分隔CSV导入失败:', error);
      alert('分号分隔CSV导入失败: ' + (error.message || error));
    }
  });

  panelContainer.appendChild(buttonContainer);
  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  textareaContainer.appendChild(dataTextArea);
  panelContainer.appendChild(textareaContainer);
  
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer) {
    tableContainer.appendChild(panelContainer);
  }
}

createTable();
```

# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)