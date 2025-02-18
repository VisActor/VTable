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
