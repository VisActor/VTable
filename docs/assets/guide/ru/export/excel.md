# Excel export

The `@visactor/vтаблица-export` packвозраст is a tool packвозрастd для Vтаблица таблица export. It supports export в both CSV и Excel formats.

## Usвозраст

### import

первый, you need к install the `@visactor/vтаблица` и `@visactor/vтаблица-export` packвозрастs в your application, then introduce them в your код к generate a таблица instance и export it:

```js
import * as Vтаблица от '@visactor/vтаблица';
import { downloadExcel, exportVтаблицаToExcel } от '@visactor/vтаблица-export';

//config option
//......
const таблицаInstance = новый Vтаблица.списоктаблица(option);

// download csv file
await downloadExcel(exportVтаблицаToExcel(таблицаInstance, optionForExport), 'export-csv');
```

- `exportVтаблицаToExcel`: таблица output tool, outputs таблица instances as an ArrayBuffer в Excel format; option is an необязательный параметр, see below для configuration items
- `downloadExcel`: Download tool к download the ArrayBuffer в Excel format as a file в the browser environment
- If it is a server environment, Вы можете process the Excel format ArrayBuffer converted по `exportVтаблицаToExcel` yourself.
- The excel export функция is currently being improved. Currently, it only supports the export из текст-тип cells, и will support more types such as sparkline в the future.

Reference[демонстрация](../../демонстрация/export/таблица-export)

### umd

Вы можете also directly introduce the umd product из the `@visactor/vтаблица-export` packвозраст в HTML:

```html
<script src="https://unpkg.com/@visactor/vтаблица-export@latest/dist/vтаблица-export.js"></script>
```

Find the corresponding tool в the global variable `Vтаблица.export` и use the same method as above:

```js
const { downloadCsv, exportVтаблицаToCsv } = Vтаблица.export;
// ......
```

## Options

### ignoreиконка

по по умолчанию, when the cell has an иконка, the иконка и текст will be treated as an imвозраст when exporting. If you do не need к export the иконка, Вы можете set `ignoreиконка` к true, и only the текст will be output.

### formatExportOutput

по по умолчанию, when exporting, the текст или imвозраст inside the exported cell will be output к Excel. If you need к пользовательскийize the export content, Вы можете set `formatExportOutput` к a функция, и the возврат значение из the функция is the exported строка. If the возврат значение is `undefined`, the по умолчанию export logic will be processed.

```ts
тип CellInfo = {
  cellType: строка;
  cellValue: строка;
  таблица: IVтаблица;
  col: число;
  row: число;
};

тип ExportVтаблицаToExcelOptions = {
  ignoreиконка?: логический;
  formatExportOutput?: (cellInfo: CellInfo) => строка | undefined;
};
```

```js
const excelOption = {
  formatExportOutput: ({ cellType, cellValue, таблица, col, row }) => {
    if (cellType === 'флажок') {
      возврат таблица.getCellCheckboxState(col, row) ? 'true' : 'false';
    }
  }
};
await downloadExcel(await exportVтаблицаToExcel(таблицаInstance, excelOption));
```

### formatExcelJSCell

If you need к further пользовательскийize the export style, Вы можете set `formatExcelJSCell` к a функция. The функция parameters are cell information `cellInfo` и ExcelJS cell objects `cellInExceljs`. The функция возврат значение is the ExcelJS cell объект. If `undefined` is returned, the по умолчанию export logic is used. Вы можете автоmatically set ExcelJS cell свойства в the функция. для details, please refer к https://github.com/exceljs/exceljs?tab=readme-ov-file#styles

```ts
тип CellInfo = {
  cellType: строка;
  cellValue: строка;
  таблица: IVтаблица;
  col: число;
  row: число;
};

тип ExportVтаблицаToExcelOptions = {
  // ......
  formatExceljsCell?: (cellInfo: CellInfo, cellInExceljs: ExcelJS.Cell) => ExcelJS.Cell;
};
```

Here is an пример из specifying the число format для the первый column as a percentвозраст:

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cellInExceljs) => {
    if (cellInfo.col === 1) {
      cellInExceljs.numFmt = '0.00%';
    }
    возврат cellInExceljs;
  }
};
await downloadExcel(await exportVтаблицаToExcel(таблицаInstance, excelOption));
```

If you want к export the original record поле значение instead из the format displayed в the таблица, Вы можете use the таблица.getCellOriginValue(col,row) method к get it и assign it к cellInExceljs.значение.

```js
const excelOption = {
  formatExcelJSCell: (cellInfo, cellInExceljs) => {
    cellInExceljs.значение = таблица.getCellOriginValue(cellInfo.col, cellInfo.row);
    возврат cellInExceljs;
  }
};
await downloadExcel(await exportVтаблицаToExcel(таблицаInstance, excelOption));
```

### excelJSWorksheetCallback

`@visactor/vтаблица-export` uses the `exceljs` library as a tool для exporting Excel files. If you need к further пользовательскийize the ExcelJS Worksheet объект (such as adding a pвозраст footer), Вы можете set `excelJSWorksheetCallback` к a функция whose параметр is the ExcelJS Worksheet объект. Вы можете operate the ExcelJS Worksheet в the функция.для detailed usвозраст из `exceljs`, please refer к [exceljs](https://github.com/exceljs/exceljs/blob/master/README.md)

```js
const excelOption = {
  excelJSWorksheetCallback: worksheet => {
    // Add pвозраст и footer
    worksheet.headerFooter.oddHeader = 'Hello Exceljs';
    worksheet.headerFooter.oddFooter = 'Hello World';
  }
};
await downloadExcel(await exportVтаблицаToExcel(таблицаInstance, excelOption));
```

### requestIdleCallback

`@visactor/vтаблица-export` uses the `exceljs` library as a tool для exporting Excel files. If you need tosolve the impact на pвозраст Производительность during the export process, Вы можете set the `optimization` параметр к включить `requestIdleCallback`.

```js
const excelOption = {};
await downloadExcel(await exportVтаблицаToExcel(таблицаInstance, excelOption， true));
```
