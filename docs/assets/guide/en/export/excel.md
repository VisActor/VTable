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

// donload csv file
downloadExcel(exportVTableToExcel(tableInstance, optionForExport), 'export-csv');
```

* `exportVTableToExcel`: Table output tool, outputs table instances as an ArrayBuffer in Excel format; option is an optional parameter, see below for configuration items
* `downloadExcel`: Download tool to download the ArrayBuffer in Excel format as a file in the browser environment
* If it is a server environment, you can process the Excel format ArrayBuffer converted by `exportVTableToExcel` yourself.
* The excel export function is currently being improved. Currently, it only supports the export of text-type cells, and will support more types such as sparkline in the future.

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
downloadExcel(await exportVTableToExcel(tableInstance, excelOption));
```