# Data Import Plugin

## Function Introduction

ExcelImportPlugin is an import plugin designed to provide users with an efficient solution for importing multiple formats of external data files. This plugin supports data import in Excel, CSV, JSON and HTML formats.

## Plugin Description

The plugin will add importFile method to the table instance.

- importFile: import file, will pop up a file selector, and the user will select the file, and the file data will be automatically imported.

```ts
await tableInstance.importFile();
```

You can also directly call the import method, pass in the file path, or file object, or file content. The following has been introduced:

### Supported data formats
- Excel File
- CSV File (Supporting Custom Delimiters)
- JSON Object
- HTML Data

### Service restrictions
The current version does not support the import function of PivotTable data.

## Plugin configuration

### ExcelImportOptions
The plugin constructor accepts a configuration object, which must implement the `ExcelImportOptions` interface. The following is a complete description of the configuration parameters:

```
interface ExcelImportOptions {
  id?: string;                        // The unique identifier of the plugin instance, which by default will use excel-import-plugin-${Date.now()};
  headerRowCount?: number;             // The number of header rows in an Excel file is only valid for Excel format. If not specified, it will be automatically detected.
  exportData?: boolean;                // Whether to export as JavaScript object format. The default is false.
  autoTable?: boolean;                 // Whether to automatically replace the table data. The default setting is true.
  autoColumns?: boolean;               // Whether to automatically generate column configuration, default is true
  delimiter?: string;                  // CSV file delimiter, default is the English comma
  batchSize?: number;                  // Batch processing data row count, default value is 1000
  enableBatchProcessing?: boolean;     // Whether to enable batch processing mode. The default is true.
  asyncDelay?: number;                 // Asynchronous processing delay time (in milliseconds), default value is 5
}
```

| name of parameter | type | default | explain |
|---------|------|--------|------|
| `id` | string | excel-import-plugin-${Date.now()} | Plugin instance identifier, used to distinguish multiple plugin instances|
| `headerRowCount` | number | - | Specify the number of header rows in the Excel file. This setting is only applicable to Excel files. |
| `exportData` | boolean | false | Control whether to export the data in JavaScript object format |
| `autoTable` | boolean | true | Control whether to automatically replace the existing data in the table |
| `autoColumns` | boolean | true | Control whether columns are automatically configured based on the imported data |
| `delimiter` | string | ',' | The field delimiter of a CSV file|
| `batchSize` | number | 1000 | The number of data rows processed in each batch under batch processing mode |
| `enableBatchProcessing` | boolean | true | Should the batch processing mode be enabled to optimize memory usage? |
| `asyncDelay` | number | 5 | Delay time (in milliseconds) during the asynchronous processing process |

### import function

The core method of the plugin is responsible for performing the data import operation.

```ts
async import(
  type: 'file' | 'csv' | 'json' | 'html',
  source?: string | object,
  options?: Partial<ExcelImportOptions>
): Promise<ImportResult>
```

**type（necessary）**
- type：`'file' | 'csv' | 'json' | 'html'`
- explain：Specify the type of imported data
  - `'file'`：Import files through the file selector
  - `'csv'`：Import string data in CSV format
  - `'json'`：Import data objects in JSON format
  - `'html'`：Import data in HTML table format

**source（optional）**
- type：`string | object`
- explain：Data source content
  - When `type` is set to `'file'`, this parameter is invalid.
  - When `type` is either `'csv'`, `'html'`, or `'json'`, a string or object in the corresponding format should be passed in.

**options（optional）**
- type：`Partial<ExcelImportOptions>`
- explain：The runtime configuration parameters will temporarily override the configuration set during the plugin initialization.

## operating guide

### Plugin initialization

First, a plugin instance needs to be created and added to the plugin configuration of the VTable:

```ts
//初始化插件
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

### Usage example

#### File import

Import local files through the file selector:

```ts
await excelImportPlugin.import('file');

await excelImportPlugin.import('file', undefined, {
  exportData: true,
  delimiter: ';' 
});
```

#### CSV data import

Import string data in CSV format:

```ts
const csvData1 = `姓名,年龄,部门
张三,25,技术部
李四,30,销售部
王五,28,市场部`;

await excelImportPlugin.import('csv', csvData1);

const csvData2 = `姓名;年龄;部门
张三;25;技术部
李四;30;销售部`;

await excelImportPlugin.import('csv', csvData2, {
  delimiter: ';'
});

```

#### Disable automatic table updates

Only obtain data without automatically updating the table:

```javascript
const result = await excelImportPlugin.import('json', jsonData, {
  autoTable: false,
});
```

## 演示代码

```javascript livedemo template=vtable
function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
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
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];
    const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
      exportData: true
    });
    const option = {
      container: document.getElementById(CONTAINER_ID),
      records:data,
      columns,
      theme: VTable.themes.DEFAULT,
      select: { disableSelect: false },
      plugins: [excelImportPlugin]
    };
    const tableInstance = new VTable.ListTable(option);
    addImportButton(excelImportPlugin, tableInstance);
    window.tableInstance = tableInstance;
  })
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
  panelContainer.style.opacity = '0.9';
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