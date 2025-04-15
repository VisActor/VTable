# 行列新增插件

## 功能介绍

AddRowColumnPlugin 是为了扩展VTable支持动态新增行列而写的插件。

该插件监听了`vTable`实例的 `MOUSEENTER_CELL`, `MOUSELEAVE_CELL`, `MOUSELEAVE_TABLE`事件!

当鼠标hover到table的cell时，会显示添加行和列的dot和加号；当鼠标离开table的cell时，会隐藏添加行和列的dot和加号。

## 插件配置

添加行和列的插件的配置选项：

```ts
export interface AddRowColumnOptions {
  /**
   * 是否启用添加列
   */
  addColumnEnable?: boolean;
  /**
   * 是否启用添加行
   */
  addRowEnable?: boolean;
  /**
   * 添加列的回调函数
   */
  addColumnCallback?: (col: number) => void;
  /**
   * 添加行的回调函数
   */
  addRowCallback?: (row: number) => void;
}
```

## 插件示例
初始化插件对象，添加到vTable配置的plugins中。
```
const addRowColumn = new AddRowColumnPlugin();
const option = {
  records,
  columns,
  padding: 30,
  plugins: [addRowColumn]
};
```
为了能控制新增行数据的内容，以及控制新增列后数据的更新以及columns的信息，可以使用插件提供的配置项来优化使用，在初始化插件对象时提供新增行列的勾子函数，在函数中赋值新增的行数据或者列信息。
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

可运行示例：

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
