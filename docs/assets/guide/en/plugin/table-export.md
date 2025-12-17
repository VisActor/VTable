# Table Export Plugin

We encapsulated the table export plugin in `@visactor/vtable-plugins`, which can be used to easily export VTable tables as Excel and CSV files.

## Plugin Description

The plugin will add exportToCsv and exportToExcel methods to the table instance.

- exportToCsv: export CSV file
- exportToExcel: export Excel file

## Plugin Configuration Introduction

The plugin initialization passes in the plugin configuration, and the configuration items are as follows:

```js
export type TableExportPluginOptions = {
  exportExcelOptions?: ExportVTableToExcelOptions; // Excel export configuration
  exportCsvOptions?: ExportVTableToCsvOptions; // CSV export configuration
  exportOnIdle?: boolean; // Whether to export and download when idle, default false
};
```
Where `exportExcelOptions` and `exportCsvOptions` are export configurations, and `exportOnIdle` is whether to export and download when idle, default false.

The configuration items of `exportExcelOptions` and `exportCsvOptions` are as follows:

```js
export type ExportVTableToExcelOptions = {
  ignoreIcon?: boolean;
  exportAllData?: boolean;
  formatExportOutput?: (cellInfo: CellInfo) => string | undefined;
  formatExcelJSCell?: (cellInfo: CellInfo, cellInExcelJS: ExcelJS.Cell) => ExcelJS.Cell;
  excelJSWorksheetCallback?: (worksheet: ExcelJS.Worksheet) => void;
  skipImageExportCellType?: SkipImageExportCellType[];
  downloadFile?: boolean;
  fileName?: string;
};
```

```js

export type ExportVTableToCsvOptions = {
  formatExportOutput?: (cellInfo: CellInfo) => string | undefined;
  escape?: boolean;
  exportAllData?: boolean;
  downloadFile?: boolean;
  fileName?: string;
};
```
The following explains each configuration item:

### ignoreIcon

By default, when a cell has an icon, the icon and text are treated as images and exported together; if you do not want to export the icon, you can set `ignoreIcon` to true and only output text

### exportAllData

By default, only the data on the current page of the table is exported; if you have set pagination, if you want to export all data instead of the current page, you can set `exportAllData` to true

### formatExportOutput

By default, when exporting the table, the text or image inside the exported cell is output to Excel; if you need to customize the exported content, you can set `formatExportOutput` to a function, the parameter of the function is the cell information, the return value of the function is the exported string, if the return value is `undefined`, the default export logic is followed

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
const tableExportPlugin = new VTablePlugins.TableExportPlugin({
  exportExcelOptions: excelOption
});
```

### formatExcelJSCell

If you have further customization requirements for the export style, you can set `formatExcelJSCell` to a function, the parameter of the function is the cell information cellInfo and the cell object cellInExceljs of ExcelJS, the return value of the function is the cell object of ExcelJS, if the return value is `undefined`, the default export logic is followed. You can automatically set the cell properties of ExcelJS in the function, please refer to https://github.com/exceljs/exceljs?tab=readme-ov-file#styles

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

The following is an example of specifying the number format of the first column as a percentage:

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cellInExceljs) => {
    if (cellInfo.col === 1) {
      cellInExceljs.numFmt = '0.00%';
    }
    return cellInExceljs;
  }
};
const tableExportPlugin = new VTablePlugins.TableExportPlugin({
  exportExcelOptions: excelOption
});

```

If you want to export the original record field value instead of the formatted value displayed in the table, you can use the table.getCellOriginValue(col,row) method to get the original value, and then assign it to cellInExceljs.value.

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cellInExceljs) => {
    cellInExceljs.value = table.getCellOriginValue(cellInfo.col, cellInfo.row);
    return cellInExceljs;
  }
};
const tableExportPlugin = new VTablePlugins.TableExportPlugin({
  exportExcelOptions: excelOption
});
```

### excelJSWorksheetCallback

`@visactor/vtable-export` uses the `exceljs` library as a tool for exporting Excel files. If you need to further customize the Worksheet object of ExcelJS (for example, add page footers), you can set `excelJSWorksheetCallback` to a function, the parameter of the function is the Worksheet object of ExcelJS, and you can operate the Worksheet of ExcelJS in the function. Please refer to [exceljs](https://github.com/exceljs/exceljs/blob/master/README.md) for the detailed usage of `exceljs`.

```js
const excelOption = {
  excelJSWorksheetCallback: worksheet => {
    // 添加页面与页脚
    worksheet.headerFooter.oddHeader = 'Hello Exceljs';
    worksheet.headerFooter.oddFooter = 'Hello World';
  }
};
const tableExportPlugin = new VTablePlugins.TableExportPlugin({
  exportExcelOptions: excelOption
});
```

### skipImageExportCellType

By default, when exporting the table, non-textual cells will export images; if you do not want to export images, you can set `skipImageExportCellType` to `['image', 'video', 'progressbar', 'sparkline', 'chart', 'custom', 'textWithIcon']`


### downloadFile

By default, the exported file will not be automatically downloaded, and you need to manually call the `downloadFile` method to download the file; if you want to automatically download the file, you can set `downloadFile` to true

### fileName

By default, the exported file name is `export`; if you need to customize the file name, you can set `fileName` to the file name

## Usage Example
Please refer to [table export](../../demo/export/table-export)

## vtable-sheet usage

In VTableSheet, you can refer to [VTableSheet export](../sheet/import_export).

Because the electronic spreadsheet needs to support exporting multiple sheets, so this plugin extends the interface ability to export all sheets, and specifically adds the exportMultipleVTablesToExcel method.