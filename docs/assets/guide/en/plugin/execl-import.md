# Excel import plugin

## Function Introduction
The `ExcelImportPlugin` can import Excel files into the vtable and export the parsed files in JSON format for user debugging convenience.

Since the import is achieved by directly parsing the content in the Excel rows, it cannot support more special or complex table structures. It is only applicable for the import of regular tables.

## 插件配置
```
export interface ExcelImportOptions {
  id?: string;
  headerRowCount?: number;
  exportJson?: boolean;
  buttonText?: string;
  onImported?: (columns: any[], records: any[]) => void;
}
```

## 插件示例

You can select an Excel file through the interactive panel below and import it. The table will be automatically refreshed with new data.

```javascript livedemo template=vtable
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';

const IMPORT_PANEL_ID = 'excel-import-panel';
const excelImportPlugin = new VTablePlugins.ExcelImportPlugin({
  id: 'my-import-plugin',
  exportJson: true,
  buttonText: '自定义导入按钮',
  onImported: (columns, records) => {
    console.log('导入完成', columns, records);
  }
});

const columns = [
  { field: 'name', title: '姓名', width: 120 },
  { field: 'age', title: '年龄', width: 80 },
  { field: 'city', title: '城市', width: 120 }
];

let records = [
  { name: '张三', age: 18, city: '北京' },
  { name: '李四', age: 22, city: '上海' }
];

const option = {
  columns,
  records,
  plugins: [excelImportPlugin]
};

const container = document.getElementById(CONTAINER_ID);

// Create a packaging container
const wrapper = document.createElement('div');
wrapper.style.height = '100%';
wrapper.style.width = '100%';
wrapper.style.position = 'relative';
container.appendChild(wrapper);


// Create a table container
const tableContainer = document.createElement('div');
tableContainer.style.height = '100%';
tableContainer.style.width = '100%';
tableContainer.style.position = 'relative';
wrapper.appendChild(tableContainer);


// Create an instance of VTable
const table = new VTable.ListTable(tableContainer, option);
```
---

You can also adjust the 'options' parameter according to actual needs, for example:
- `headerRowCount`：Specify the number of table header layers. By default, it is automatically detected
- `exportJson`：Whether to export the JSON file? The default setting is false
- `buttonText`：Custom button text
- `onImported`：Custom import completion callback

# This document was contributed by:

[Abstract chips](https://github.com/Violet2314)