自定义编辑器

VTable-Sheet 支持通过VTable的方式传入单元格的编辑器，通过 `editor` 配置项来指定单元格的编辑器。但是需要注意，配置了编辑器的sheet表格或者表格列，将不能使用公式能力。

（原因是：配置的编辑器会覆盖内置的默认的公式编辑器，导致公式能力无法正常工作）

如果有其他自定义编辑的需求，请参考完整的教程文档：[编辑教程](../edit/edit_cell)。

# 示例
该示例中，我们实例化了一个编辑器： `dateEditor`，并在表格列中使用。

```javascript livedemo template=vtable
let ganttInstance;
// 引入VTableSheet
// import * as VTableSheet from '@visactor/vtable-sheet';
// 自定义编辑前 需要引入插件包@visactor/vtable-editors 请确保和vtable-sheet引用的版本一致
// import * as VTable_editors from '@visactor/vtable-editors';
// 正常使用方式 const input_editor = new VTable.editors.InputEditor();
// 官网编辑器中将 VTable.editors重命名成了VTable_editors
const date_input_editor = new VTable_editors.DateInputEditor();
VTableSheet.VTable.register.editor('dateEditor', date_input_editor);

// 容器
const container = document.getElementById(CONTAINER_ID);
// 创建表格实例
const sheetInstance = new VTableSheet.VTableSheet(container, {
  showFormulaBar: true,
  showSheetTab: true,
  sheets: [
    // 员工数据表格页
    {
      sheetKey: 'employees',
      sheetTitle: '员工数据',
      columns: [
        { title: '姓名', width: 100 },
        { title: '部门', width: 120 },
        { title: '职位', width: 120 },
        { title: '入职日期', width: 120, editor: 'dateEditor' },
        { title: '工资', width: 100 }
      ],
      data: [
        ['张三', '技术部', '工程师', '2022-01-15', 12000],
        ['李四', '市场部', '经理', '2020-06-20', 18000],
        ['王五', '技术部', '高级工程师', '2021-03-10', 15000],
        ['赵六', '人力资源', '专员', '2022-09-01', 9000]
      ]
    }
  ]
});
window['sheetInstance'] = sheetInstance;
```
