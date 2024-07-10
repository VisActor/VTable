# Excel导出

`@visactor/vtable-export`包是为了 VTable 表格导出所封装的工具，它支持CSV和Excel两种格式的导出。

## 使用方式

### import

首先，你需要在你的应用中安装`@visactor/vtable`和`@visactor/vtable-export`包，然后在你的代码中引入它们生成一个表格实例，并导出：

```js
import * as VTable from '@visactor/vtable';
import { downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';

// config option
// ......
const tableInstance = new VTable.ListTable(option);

// donload csv file
downloadExcel(exportVTableToExcel(tableInstance, optionForExport), 'export-csv');
```

* `exportVTableToExcel`：表格输出工具，将表格实例输出为一个Excel格式的ArrayBuffer；option为可选参数，详见下方配置项
* `downloadExcel`：下载工具，在浏览器环境中将Excel格式的ArrayBuffer下载为文件
* 如果是服务端环境，可以自行处理`exportVTableToExcel`转换出的Excel格式的ArrayBuffer
* 目前excel导出功能正在完善中，目前只支持文字类型的单元格导出，后续会支持迷你图等更多类型

参考[demo](../../demo/export/table-export)

### umd

也可以在HTML中直接引入`@visactor/vtable-export`包的umd产物：

```html
<script src="https://unpkg.com/@visactor/vtable-export@latest/dist/vtable-export.js"></script>
```

在全局变量`VTable.export`中找到相应工具，使用方法同上：

```js
const { downloadCsv, exportVTableToCsv } = VTable.export;
// ......
```

## 配置项

### ignoreIcon

默认情况下，单元格中有图标时，图标和文字会统一当做图片被导出；如果不需要导出图标，可以设置`ignoreIcon`为true，只输出文字

### formatExportOutput

默认情况下，表格导出时，会将导出单元格的内文字或图片输出到Excel中，如果需要自定义导出内容，可以设置`formatExportOutput`为一个函数，函数的参数为单元格信息，函数的返回值为导出字符串，如果返回`undefined`，则按照默认导出逻辑处理

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
downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```

### formatExcelJSCell

对于导出样式有进一步的定制化需求的话，可以设置`formatExcelJSCell`为一个函数，函数的参数为单元格信息和ExcelJS的单元格对象，函数的返回值为ExcelJS的单元格对象，如果返回`undefined`，则按照默认导出逻辑处理。可以在函数中自动设置ExcelJS的单元格属性，具体可以参考 https://github.com/exceljs/exceljs?tab=readme-ov-file#styles

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
  formatExceljsCell?: (cellInfo: CellInfo, cellInExceljs: ExcelJS.Cell) => ExcelJS.Cell;
};
```

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cell) => {
    if (cellInfo.col === 1) {
      cell.numFmt = '0.00%';
    }
    return cell;
  }
};
downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```