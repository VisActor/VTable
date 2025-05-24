# Paste Add Row Plugin 

## Introduction

PasteAddRowPlugin is a plugin written to extend the function of adding new rows when the data to be pasted is greater than the number of remaining rows in a table.

This plugin listens to the `COPY_DATA` event of the `vTable` instance!

## Plugin Example
Initialize the plugin object and add it to the plugins of the vTable configuration.
```
const pasteAddRowPlugin = new PasteAddRowPlugin();
const option = {
  records,
  columns,
  padding: 30,
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true
  },
  plugins: [pasteAddRowPlugin]
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
    city: 'Chigago',
  }));
};
  const pasteAddRowPlugin = new VTablePlugins.PasteAddRowPlugin();
  const option = {
    records: generatePersons(20),
    rowSeriesNumber: {},
    columns:[
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
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
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
  editCellTrigger: 'doubleclick',// 编辑单元格触发方式
  keyboardOptions: {
    copySelected: true,
    pasteValueToCell: true
  },
  plugins: [pasteAddRowPlugin]
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;
```