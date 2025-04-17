# Excel Edit Cell Keyboard Behavior Alignment Plugin

`ExcelEditCellKeyboardPlugin` is a VTable extension component that aligns keyboard behavior in cell editing with Excel functionality.

## Plugin Capabilities
Regarding keyboard response settings, VTable has the following two configuration entry points:

| keyboard   | Response                                                                                                                                                                                                                                                  |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enter      | If in edit state, confirms editing completion;<br> If keyboardOptions.moveFocusCellOnEnter is true, pressing enter switches the selected cell to the cell below.<br> If keyboardOptions.editCellOnEnter is true, pressing enter will enter edit mode when a cell is selected. |
| tab        | Requires keyboardOptions.moveFocusCellOnTab to be enabled.<br> Pressing tab switches the selected cell, if currently editing a cell, the next cell will also be in edit mode. |
| left       | Direction key, switches the selected cell.<br> If keyboardOptions.moveEditCellOnArrowKeys is enabled, you can also switch the editing cell in edit mode |
| right      | Same as above |
| top        | Same as above |
| bottom     | Same as above |
| ctrl+c     | The keybinding is not exact, this copy matches the browser's shortcut.<br> Copies selected cell content, requires keyboardOptions.copySelected to be enabled |
| ctrl+v     | The keybinding is not exact, paste shortcut matches the browser's shortcut.<br> Pastes content to cells, requires keyboardOptions.pasteValueToCell to be enabled, paste only works on cells configured with editor |
| ctrl+a     | Select all, requires keyboardOptions.selectAllOnCtrlA to be enabled |
| shift      | Hold shift and left mouse button to select cells in a continuous area |
| ctrl       | Hold ctrl and left mouse button to select multiple areas |
| any key    | Can listen to tableInstance.on('keydown',(args)=>{ }) |

These settings can satisfy most editing table keyboard response requirements, but compared to Excel, VTable's keyboard behavior still has some differences, such as:

- In VTable, when editing a cell, pressing arrow keys doesn't switch to the next cell, but moves the cursor within the editing cell.
- In VTable, when editing a cell, pressing enter doesn't confirm editing completion, but switches to the next cell.
- In VTable, when editing a cell, pressing tab doesn't switch to the next cell, but moves the cursor within the editing cell.
- In VTable, when editing a cell, pressing shift and left mouse button doesn't select cells in a continuous area.
- In VTable, when editing a cell, holding ctrl and left mouse button doesn't select multiple areas.


Combined with VTable's existing capabilities that partially meet the requirements, we developed the `ExcelEditCellKeyboardPlugin` plugin to align cell editing keyboard behavior with Excel functionality.

## Plugin Usage Example

```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins

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

## Future Plugin Improvements

Other keyboard behaviors that differ from Excel, such as:

- Support for configuration option to respond to the delete key
- Support for configuration option to respond to ctrl+c and ctrl+v
- Support for configuration option to respond to shift and left mouse button
- Support for configuration option to respond to ctrl and left mouse button

Whether each response behavior needs to be explicitly configured by users, such as providing configuration options:
```ts
const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin({
    enableDeleteKey: false
});
const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin(excelEditCellKeyboardPlugin);

```

We welcome your contributions to write more plugins! Let's build the VTable ecosystem together!