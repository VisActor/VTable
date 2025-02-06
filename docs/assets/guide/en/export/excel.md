# Excel export

The `@visactor/vtable-export` package is a tool packaged for VTable table export. It supports export in both CSV and Excel formats.

## Usage

### import

First, you need to install the `@visactor/vtable` and `@visactor/vtable-export` packages in your application, then introduce them in your code to generate a table instance and export it:

```js
import * as VTable from '@visactor/vtable';
import { downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';

//config option
//......
const tableInstance = new VTable.ListTable(option);

// download csv file
await downloadExcel(exportVTableToExcel(tableInstance, optionForExport), 'export-csv');
```

- `exportVTableToExcel`: Table output tool, outputs table instances as an ArrayBuffer in Excel format; option is an optional parameter, see below for configuration items
- `downloadExcel`: Download tool to download the ArrayBuffer in Excel format as a file in the browser environment
- If it is a server environment, you can process the Excel format ArrayBuffer converted by `exportVTableToExcel` yourself.
- The excel export function is currently being improved. Currently, it only supports the export of text-type cells, and will support more types such as sparkline in the future.

Reference[demo](../../demo/export/table-export)

### umd

You can also directly introduce the umd product of the `@visactor/vtable-export` package in HTML:

```html
<script src="https://unpkg.com/@visactor/vtable-export@latest/dist/vtable-export.js"></script>
```

Find the corresponding tool in the global variable `VTable.export` and use the same method as above:

```js
const { downloadCsv, exportVTableToCsv } = VTable.export;
// ......
```

## Options

### ignoreIcon

By default, when the cell has an icon, the icon and text will be treated as an image when exporting. If you do not need to export the icon, you can set `ignoreIcon` to true, and only the text will be output.

### formatExportOutput

By default, when exporting, the text or image inside the exported cell will be output to Excel. If you need to customize the export content, you can set `formatExportOutput` to a function, and the return value of the function is the exported string. If the return value is `undefined`, the default export logic will be processed.

```ts
type CellInfo = {
  cellType: string;
  cellValue: string;
  table: IVTable;
  col: number;
  row: number;
};

type ExportVTableToExcelOptions = {
  ignoreIcon?: boolean;
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

### formatExcelJSCell

If you need to further customize the export style, you can set `formatExcelJSCell` to a function. The function parameters are cell information `cellInfo` and ExcelJS cell objects `cellInExceljs`. The function return value is the ExcelJS cell object. If `undefined` is returned, the default export logic is used. You can automatically set ExcelJS cell properties in the function. For details, please refer to https://github.com/exceljs/exceljs?tab=readme-ov-file#styles

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

Here is an example of specifying the number format for the first column as a percentage:

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cellInExceljs) => {
    if (cellInfo.col === 1) {
      cellInExceljs.numFmt = '0.00%';
    }
    return cellInExceljs;
  }
};
await downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```

If you want to export the original record field value instead of the format displayed in the table, you can use the table.getCellOriginValue(col,row) method to get it and assign it to cellInExceljs.value.

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cellInExceljs) => {
    cellInExceljs.value = table.getCellOriginValue(cellInfo.col, cellInfo.row);
    return cellInExceljs;
  }
};
await downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```

### excelJSWorksheetCallback

`@visactor/vtable-export` uses the `exceljs` library as a tool for exporting Excel files. If you need to further customize the ExcelJS Worksheet object (such as adding a page footer), you can set `excelJSWorksheetCallback` to a function whose parameter is the ExcelJS Worksheet object. You can operate the ExcelJS Worksheet in the function.For detailed usage of `exceljs`, please refer to [exceljs](https://github.com/exceljs/exceljs/blob/master/README.md)

```js
const excelOption = {
  excelJSWorksheetCallback: worksheet => {
    // Add page and footer
    worksheet.headerFooter.oddHeader = 'Hello Exceljs';
    worksheet.headerFooter.oddFooter = 'Hello World';
  }
};
await downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```
