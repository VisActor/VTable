# 粘贴插入插件

VTable 提供从Excel文件中复制内容后粘贴插入的插件，当要插入的数据大于剩余行数，则新增行。

## 使用示例：

```javascript livedemo template=vtable
//  import * as VTable from '@visactor/vtable';
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';
// 正常使用方式 const columnSeries = new VTable.plugins.ColumnSeriesPlugin({});
// 官网编辑器中将 VTable.plugins重命名成了VTablePlugins
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
    city: 'beijing',
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
