# 粘贴插入插件

## 功能介绍

PasteAddRowColumnPlugin 是为了扩展当在表格中进行粘贴时，当要粘贴插入的数据大于剩余行数和列数时，则新增行和列而写的插件。

该插件监听了`vTable`实例的`PASTED_DATA`事件!

## 插件配置

添加行和列的插件的配置选项：

```ts
export interface AddRowColumnOptions {
  /**
   * 添加列的回调函数
   */
  addColumnCallback?: (col: number, vTable: VTable.ListTable) => void;
  /**
   * 添加行的回调函数
   */
  addRowCallback?: (row: number, vTable: VTable.ListTable) => void;
}
```

## 插件示例

初始化插件对象，添加到 vTable 配置的 plugins 中。
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

为了能保证插件能正常工作，需要在 vTable 初始化时配置`keyboardOptions`，并设置`copySelected`和`pasteValueToCell`为`true`。

```javascript livedemo template=vtable
const input_editor = new VTable_editors.InputEditor();
VTable.register.editor('input-editor', input_editor);
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
    city: 'beijing'
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

