# Excel import plugin

## Feature Introduction

The `ExcelImportPlugin` is a plugin developed to enable VTable to support the import of Excel files, and it also supports the import of CSV, JSON, XLSX, and HTML files.

This plugin takes effect at the beginning of `VTable.TABLE EVENT TYPE.INITIALIZED`

When it is necessary to use this plugin, please call the `import` interface in `ExcelImportPlugin` to achieve file import

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

## Plugin example

Initialize the plugin object and add it to the "plugins" section of the configuration.
```
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
    const jsonData = [
      { name: '张三', age: 25, department: '技术部', salary: 8000 },
      { name: '李四', age: 30, department: '销售部', salary: 6000 },
      { name: '王五', age: 28, department: '市场部', salary: 7000 },
      { name: '赵六', age: 32, department: '人事部', salary: 6500 }
    ];
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
    const csvData = `姓名;年龄;部门;工资
张三;25;技术部;8000
李四;30;销售部;6000
王五;28;市场部;7000`;
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

  buttonContainer.appendChild(importButton);
  buttonContainer.appendChild(jsonButton);
  buttonContainer.appendChild(delimiterButton);
  
  const tableContainer = document.getElementById(CONTAINER_ID);
  if (tableContainer) {
    tableContainer.appendChild(buttonContainer);
  }
}

createTable();
```

# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)