# Excel Keyboard Interaction Alignment Plugin Usage Description

`ExcelEditCellKeyboardPlugin` is an extension component of VTable, which can achieve the function of aligning the keyboard behavior of editing cells with Excel.

## Plugin Implementation Ability Description
VTable has a lot of keyboard event responses, which can be referred to in the [Shortcut](../shortcut) chapter.

These configuration items can meet the requirements of most editing table keyboard responses, but to better align with the keyboard behavior of Excel, we have developed the `ExcelEditCellKeyboardPlugin` plugin, which can achieve the function of aligning the keyboard behavior of editing cells with Excel.

## Basic Usage of Plugin

```ts
const excelEditCellKeyboardPlugin = new VTablePlugins.ExcelEditCellKeyboardPlugin();
```
The constructor of `ExcelEditCellKeyboardPlugin` can accept a configuration item, the type of which is `IExcelEditCellKeyboardPluginOptions`, as follows:

```ts
export type IExcelEditCellKeyboardPluginOptions = {
  id?: string;
  /** The list of keyboard events that the plugin responds to */
  responseKeyboard?: ExcelEditCellKeyboardResponse[];
  /** Whether the delete ability only applies to editable cells */
  deleteWorkOnEditableCell?: boolean;
  /** When deleting a range, call the batch API to aggregate into one change_cell_values event */
  batchCallChangeCellValuesApi?: boolean;
};
```
The `batchCallChangeCellValuesApi` option is used to control the deletion behavior for multiple selected ranges. When enabled, the plugin will call `changeCellValuesByRanges` once to update the selected ranges, so that `change_cell_values` is fired as a single aggregated event instead of being triggered per-cell.
  The `responseKeyboard` configuration item is used to configure the list of keyboard events that the plugin responds to, the value type of which is `ExcelEditCellKeyboardResponse`, as follows:
```ts
export enum ExcelEditCellKeyboardResponse {
  ENTER = 'enter',
  TAB = 'tab',
  ARROW_LEFT = 'arrowLeft',
  ARROW_RIGHT = 'arrowRight',
  ARROW_DOWN = 'arrowDown',
  ARROW_UP = 'arrowUp',
  DELETE = 'delete',
  BACKSPACE = 'backspace'
}
```

## Plugin Usage Example

```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
//  When using, you need to import the plugin package @visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
//  Normal usage const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
//  In the official editor, VTable.plugins is renamed to VTablePlugins

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};
  const excelEditCellKeyboardPlugin = new VTablePlugins.ExcelEditCellKeyboardPlugin();

  const option = {
    records: generatePersons(20),
    columns:[
    {
      field: 'id',
      title: 'ID',
      width: 'auto',
      minWidth: 50,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true,
      style: {
        underline: true,
        underlineDash: [2, 0],
        underlineOffset: 3
      }
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    }
  ],
    editor: new VTable_editors.InputEditor(),
    editCellTrigger: ['keydown'],
    plugins: [excelEditCellKeyboardPlugin]
  };
  const tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;


```


Welcome to contribute your strength, write more plugins together, and build the ecosystem of VTable together!
