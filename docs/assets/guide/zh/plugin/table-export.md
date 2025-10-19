# 表格导出插件
我们在`@visactor/vtable-plugins`中封装了表格导出插件，使用该插件可以方便的导出VTable表格为Excel和CSV文件。

## 插件说明

该插件会向table实例添加exportToCsv和exportToExcel方法。

- exportToCsv：导出CSV文件
- exportToExcel：导出Excel文件


## 插件配置介绍

插件初始化传入插件配置，配置项如下：

```js
export type TableExportPluginOptions = {
  exportExcelOptions?: ExportVTableToExcelOptions; // Excel导出配置
  exportCsvOptions?: ExportVTableToCsvOptions; // CSV导出配置
  exportOnIdle?: boolean; // 是否空闲时导出下载，默认false
};
```
其中`exportExcelOptions`和`exportCsvOptions`为导出配置，`exportOnIdle`为是否空闲时导出下载，默认false。

`exportExcelOptions`和`exportCsvOptions`的配置项如下：

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
下面意义介绍各个配置项：

### ignoreIcon

默认情况下，单元格中有图标时，图标和文字会统一当做图片被导出；如果不需要导出图标，可以设置`ignoreIcon`为 true，只输出文字

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
const tableExportPlugin = new VTablePlugins.TableExportPlugin({
  exportExcelOptions: excelOption
});
```

### formatExcelJSCell

对于导出样式有进一步的定制化需求的话，可以设置`formatExcelJSCell`为一个函数，函数的参数为单元格信息 cellInfo 和 ExcelJS 的单元格对象 cellInExceljs，函数的返回值为 ExcelJS 的单元格对象，如果返回`undefined`，则按照默认导出逻辑处理。可以在函数中自动设置 ExcelJS 的单元格属性，具体可以参考 https://github.com/exceljs/exceljs?tab=readme-ov-file#styles

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

以下为指定第一列的数字格式为百分比的例子：

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

如果想要导出原始 record 字段值 而不是表格中显示的 format 之后的，可以借助 table.getCellOriginValue(col,row)方法来获取后，将其赋值到 cellInExceljs.value 中。

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

`@visactor/vtable-export`使用`exceljs`库作为导出 Excel 文件的工具，如果需要对 ExcelJS 的 Worksheet 对象进行进一步的定制化（例如添加页面页脚），可以设置`excelJSWorksheetCallback`为一个函数，函数的参数为 ExcelJS 的 Worksheet 对象，可以在函数中操作 ExcelJS 的 Worksheet。`exceljs`的详细使用方法请参考 [exceljs](https://github.com/exceljs/exceljs/blob/master/README.md)

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

默认情况下，表格导出时，非文本类型的单元格会导出图片；如果不需要导出图片，可以设置`skipImageExportCellType`为`['image', 'video', 'progressbar', 'sparkline', 'chart', 'custom', 'textWithIcon']`


### downloadFile

默认情况下，导出文件不会自动下载，需要手动调用`downloadFile`方法下载文件；如果需要自动下载文件，可以设置`downloadFile`为true

### fileName

默认情况下，导出文件名称为`export`；如果需要自定义文件名，可以设置`fileName`为文件名

## 用法示例
可参考[表格导出](../../demo/export/table-export)