# Row and Column Addition Plugin

## Introduction

AddRowColumnPlugin is a plugin designed to extend VTable with dynamic row and column addition capabilities.

This plugin monitors the `vTable` instance's `MOUSEENTER_CELL`, `MOUSELEAVE_CELL`, and `MOUSELEAVE_TABLE` events!

When the mouse hovers over a table cell, dots and plus signs for adding rows and columns will be displayed; when the mouse leaves the table cell, these indicators will be hidden.

## Plugin Configuration

Configuration options for the row and column addition plugin:

```ts
export interface AddRowColumnOptions {
  /**
   * Whether to enable column addition
   */
  addColumnEnable?: boolean;
  /**
   * Whether to enable row addition
   */
  addRowEnable?: boolean;
  /**
   * Callback function for adding a column
   */
  addColumnCallback?: (col: number) => void;
  /**
   * Callback function for adding a row
   */
  addRowCallback?: (row: number) => void;
}
```

## Plugin Example
Initialize the plugin object and add it to the vTable configuration's plugins.
```
const addRowColumn = new AddRowColumnPlugin();
const option = {
  records,
  columns,
  padding: 30,
  plugins: [addRowColumn]
};
```
To control the content of newly added row data and update data and column information after adding columns, you can use the configuration options provided by the plugin. When initializing the plugin object, provide hook functions for adding rows and columns, and set the values for new rows or column information in these functions.
```ts
 const addRowColumn = new AddRowColumnPlugin({
    addColumnCallback: col => {
      columns.splice(addColIndex, 0, {
          field: ``,
          title: `New Column ${col}`,
          width: 100
        });
      this.table.updateColumns(columns);
      const newRecords = tableInstance.records.map(record => {
        if (Array.isArray(record)) {
          record.splice(col - 1, 0, '');
        }
        return record;
      });
      tableInstance.setRecords(newRecords);
    },
    addRowCallback: row => {
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });
```

Runnable example:

```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins
  const addRowColumn = new VTablePlugins.AddRowColumnPlugin();
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

    plugins: [addRowColumn]
  };
  const tableInstance = new VTable.ListTable( document.getElementById(CONTAINER_ID),option);
  window.tableInstance = tableInstance;
```
