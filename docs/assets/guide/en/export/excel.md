# Excel export

The `@visactor/vtable-export` package is a tool packaged for VTable table export. It supports export in both CSV and Excel formats.

## Usage
First, you need to install the `@visactor/vtable` and `@visactor/vtable-export` packages in your application, then introduce them in your code to generate a table instance and export it:

```js
import * as VTable from '@visactor/vtable';
import { downloadExcel, exportVTableToExcel } from '@visactor/vtable-export';

//config option
//......
const tableInstance = new VTable.ListTable(option);

// donload csv file
downloadExcel(exportVTableToExcel(tableInstance), 'export-csv');
```

* `exportVTableToExcel`: Table output tool, outputs table instances as an ArrayBuffer in Excel format
* `downloadExcel`: Download tool to download the ArrayBuffer in Excel format as a file in the browser environment
* If it is a server environment, you can process the Excel format ArrayBuffer converted by `exportVTableToExcel` yourself.
* The excel export function is currently being improved. Currently, it only supports the export of text-type cells, and will support more types such as sparkline in the future.

Reference[demo](https://codesandbox.io/p/sandbox/react-vtable-wjrvpq)