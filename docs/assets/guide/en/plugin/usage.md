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
| `TableExportPlugin` | Table export plugin | `ListTable`,`PivotTable` |
| `ExcelImportPlugin` | Import excel, csv, json, and html files into the table | `ListTable` |
| `ContextMenuPlugin` | Right-click menu plugin | `ListTable` |
| `TableSeriesNumberPlugin` | Table series number plugin | `ListTable` |

<br>

Gantt chart VTable-Gantt component currently supports the following plugins:
| Plugin Name | Plugin Description | Applicable Object |
| --- | --- | --- |
| `ExportGanttPlugin` | Realize the full export of Gantt charts and be able to adapt to the size of the Gantt chart | `Gantt` |
| `ExcelImportPlugin` | Imports excel, csv, json, and html files into the table | `ListTable` |

## Plugin Event

Plugins can trigger events to the table, and other plugins can listen to this type of event.

If a plugin needs to trigger a right-click event to the table, other plugins can listen to this type of event.

```ts
const tableInstance =new ListTable(options);

const {
    PLUGIN_EVENT
} = VTable.ListTable.EVENT_TYPE;

tableInstance.fireListeners(VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT, {
  plugin: this,
  event: nativeEvent,
  pluginEventInfo: {
    eventType: 'rightclick',
    colIndex: colIndex,
    ...
  }
});
```