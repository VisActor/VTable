# Plugin Usage

Get the plugin package

```bash
npm install @visactor/vtable-plugins
```
Import plugins

```ts
import { TableCarouselAnimationPlugin } from '@visactor/vtable-plugins';
```

Use the plugin  

```ts
const tableCarouselAnimationPlugin = new TableCarouselAnimationPlugin({
  ...
});
```

Add the plugin to the plugin list

```ts
const option: VTable.ListTableConstructorOptions = {
  ...
  plugins: [tableCarouselAnimationPlugin]
};
```

Combining multiple plugins

```ts
const option: VTable.ListTableConstructorOptions = {
  ...
  plugins: [tableCarouselAnimationPlugin, ...]
};
```

The order of plugin usage generally has no special requirements. Please carefully read the documentation for each plugin to understand its execution timing, and if necessary, refer to the plugin's source code.

If you encounter issues with plugin usage, please provide feedback promptly.

## Plugin List
| Plugin Name | Plugin Description | Applicable Object |
| --- | --- | --- |
| `AddRowColumnPlugin` | Add rows and columns | `ListTable` |
| `ColumnSeriesPlugin` | Column series plugin, can specify the number of columns in the table and define the function to generate the column serial number | `ListTable` |
| `RowSeriesPlugin` | Row series plugin, can specify the number of rows in the table and define the function to generate the data corresponding to the empty number | `ListTable` |
| `HighlightHeaderWhenSelectCellPlugin` | Highlight the selected cell | `ListTable`,`PivotTable` |
| `ExcelEditCellKeyboardPlugin` | Excel edit cell keyboard plugin | `ListTable`,`PivotTable` |
| `TableCarouselAnimationPlugin` | Table carousel animation plugin | `ListTable`,`PivotTable` |
| `RotateTablePlugin` | Table rotation plugin | `ListTable`,`PivotTable` |

<br>

Gantt chart VTable-Gantt component currently supports the following plugins:
| Plugin Name | Plugin Description | Applicable Object |
| --- | --- | --- |
| `ExportGanttPlugin` | Realize the full export of Gantt charts and be able to adapt to the size of the Gantt chart | `Gantt` |