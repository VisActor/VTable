# CSV export

The `@visactor/vtable-export` package is a tool packaged for VTable table export. It supports export in both CSV and Excel formats.

## Usage

### import

First, you need to install the `@visactor/vtable` and `@visactor/vtable-export` packages in your application, then introduce them in your code to generate a table instance and export it:

```js
import * as VTable from '@visactor/vtable';
import { downloadCsv, exportVTableToCsv } from '@visactor/vtable-export';

//config option
//......
const tableInstance = new VTable.ListTable(option);

// download csv file
downloadCsv(exportVTableToCsv(tableInstance), 'export-csv');
```

- `exportVTableToCsv`: Table output tool, outputs table instances as a string in CSV format
- `downloadCsv`: Download tool to download CSV format strings as files in a browser environment
- If it is a server environment, you can process the CSV format string converted by `exportVTableToCsv` yourself.

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
