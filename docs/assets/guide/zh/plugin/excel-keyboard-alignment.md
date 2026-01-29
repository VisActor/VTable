# 编辑单元格键盘行为对齐Excel插件使用说明

`ExcelEditCellKeyboardPlugin`是 VTable 的扩展组件，能够实现编辑单元格键盘行为对齐Excel的功能。

## 插件实现能力说明
VTable本身有比较多的键盘事件响应，可以参考[快捷键](../shortcut)章节。

这些配置项能满足大部分的编辑表格的键盘响应要求，但为了更好的对齐Excel的键盘行为，我们开发了`ExcelEditCellKeyboardPlugin`插件，能够实现编辑单元格键盘行为对齐Excel的功能。

## 插件基本使用方式

```ts
const excelEditCellKeyboardPlugin = new VTablePlugins.ExcelEditCellKeyboardPlugin();
```
其中`ExcelEditCellKeyboardPlugin`的构造函数可以传入一个配置项，配置项的类型为`IExcelEditCellKeyboardPluginOptions`，具体如下：

```ts
export type IExcelEditCellKeyboardPluginOptions = {
  id?: string;
  /** 该插件响应的键盘事件列表 */
  responseKeyboard?: ExcelEditCellKeyboardResponse[];
  /** 删除能力是否只应用到可编辑单元格 */
  deleteWorkOnEditableCell?: boolean;
  /** 删除范围时通过批量接口聚合成一次 change_cell_values 事件 */
  batchCallChangeCellValuesApi?: boolean;
};
```
`batchCallChangeCellValuesApi` 用于控制选中多个范围时的删除行为：开启后插件会通过 `changeCellValuesByRanges` 进行一次批量更新，从而让 `change_cell_values` 以一次聚合事件形式触发，而不是逐单元格触发。
其中`responseKeyboard`配置项用于配置该插件响应的键盘事件列表，值类型为`ExcelEditCellKeyboardResponse`，具体定义如下：
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

## 插件使用示例

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



欢迎大家贡献自己的力量，一起来写更多插件！一起建设VTable的生态！
