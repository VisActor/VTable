# CSV 导出

`@visactor/vtable-export`包是为了 VTable 表格导出所封装的工具，它支持 CSV 和 Excel 两种格式的导出。

## 使用方式

### import

首先，你需要在你的应用中安装`@visactor/vtable`和`@visactor/vtable-export`包，然后在你的代码中引入它们生成一个表格实例，并导出：

```js
import * as VTable from '@visactor/vtable';
import { downloadCsv, exportVTableToCsv } from '@visactor/vtable-export';

// config option
// ......
const tableInstance = new VTable.ListTable(option);

// download csv file
downloadCsv(exportVTableToCsv(tableInstance), 'export-csv');
```

- `exportVTableToCsv`：表格输出工具，将表格实例输出为一个 CSV 格式的字符串
- `downloadCsv`：下载工具，在浏览器环境中将 CSV 格式的字符串下载为文件
- 如果是服务端环境，可以自行处理`exportVTableToCsv`转换出的 CSV 格式的字符串

参考[demo](../../demo/export/table-export)

### umd

也可以在 HTML 中直接引入`@visactor/vtable-export`包的 umd 产物：

```html
<script src="https://unpkg.com/@visactor/vtable-export@latest/dist/vtable-export.js"></script>
```

在全局变量`VTable.export`中找到相应工具，使用方法同上：

```js
const { downloadCsv, exportVTableToCsv } = VTable.export;
// ......
```

## 配置项

### exportAllData

默认情况下，只导出表格中当前页的数据；如果有设置分页时，想导出所有数据，而不是当前页，可以设置`exportAllData`为 true

### formatExportOutput

默认情况下，表格导出时，会将导出单元格的内文字或图片输出到 Excel 中，如果需要自定义导出内容，可以设置`formatExportOutput`为一个函数，函数的参数为单元格信息，函数的返回值为导出字符串，如果返回`undefined`，则按照默认导出逻辑处理

```ts
type CellInfo = {
  cellType: string;
  cellValue: string;
  table: IVTable;
  col: number;
  row: number;
};

type ExportVTableToExcelOptions = {
  // ......
  formatExportOutput?: (cellInfo: CellInfo) => string | undefined;
};
```

```js
const excelOption = {
  formatExportOutput: ({ cellType, cellValue, table, col, row }) => {
    if (cellType === 'checkbox') {
      return table.getCellCheckboxState(col, row) ? 'true' : 'false';
    }
  }
};
await downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```

### excape

是否需要将字符串中的特殊符号进行转义，以避免干扰CSV解析，默认为`false`