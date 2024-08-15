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
downloadExcel(exportVTableToExcel(tableInstance), 'export-csv');
```

* `exportVTableToExcel`：表格输出工具，将表格实例输出为一个Excel格式的ArrayBuffer
* `downloadExcel`：下载工具，在浏览器环境中将Excel格式的ArrayBuffer下载为文件
* 如果是服务端环境，可以自行处理`exportVTableToExcel`转换出的Excel格式的ArrayBuffer
* 目前excel导出功能正在完善中，目前只支持文字类型的单元格导出，后续会支持迷你图等更多类型。

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