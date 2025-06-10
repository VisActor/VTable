# Paste Add Row Plugin

## Introduction

PasteAddRowColumnPlugin is a plugin written to extend the function of adding rows and columns when the data to be pasted is greater than the number of remaining rows and columns in a table.

This plugin listens to the `PASTED_dATA` event of the `vTable` instance!

## Plugin Configuration

Configuration options for the row and column addition plugin:

```ts
export interface AddRowColumnOptions {
  /**
   * Callback function for adding a column
   */
  addColumnCallback?: (col: number, vTable: VTable.ListTable) => void;
  /**
   * Callback function for adding a row
   */
  addRowCallback?: (row: number, vTable: VTable.ListTable) => void;
}
```

## Plugin Example

Initialize the plugin object and add it to the plugins of the vTable configuration.

```
const pasteAddRowColumnPlugin = new PasteAddRowColumnPlugin();
const option = {
  records,
  columns,
  padding: 30,
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true
  },
  plugins: [pasteAddRowColumnPlugin]
};
```

In order to ensure that the plugin works properly, you need to configure `keyboardOptions` when vTable is initialized, and set `copySelected` and `pasteValueToCell` to `true`.

```javascript livedemo template=vtable
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input-editor', input_editor);
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `Derrick${i + 1}`,
    lastName: 'Rose',
    date1: '1988-10-04',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'Chigago'
  }));
};
const pasteAddRowColumnPlugin = new VTablePlugins.PasteAddRowColumnPlugin();
const option = {
  records: generatePersons(20),
  rowSeriesNumber: {},
  columns: [
    {
      field: 'email1',
      title: 'email',
      width: 200
    },
    {
      field: 'name',
      title: 'First Name',
      width: 200
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
  editor: 'input-editor',
  editCellTrigger: 'doubleclick', // 编辑单元格触发方式
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true
  },
  plugins: [pasteAddRowColumnPlugin]
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;
```
