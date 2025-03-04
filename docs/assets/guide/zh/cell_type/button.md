# button 按钮类型

按钮类型单元格适用于在表格中用于提供按钮交互，并允许用户点击按钮进行特定操作。按钮类型单元格提供的交互能力在许多应用中被广泛使用。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/button.png)

## button 按钮的专属配置项介绍

button 按钮类型在配置中的特有配置项如下：

1. `disable`：单元格按钮是否可禁用点击，默认值为 false，支持配置函数，不同单元格配置不同。
2. `text`：按钮文字，支持配置函数，如果没有配置，按钮文字为`field`字段对应的值。

示例：

```javascript
{
  field: 'button',
  cellType: 'button',
  text: 'Select'
}
```

## button 按钮点击事件

button 按钮点击后，会触发`VTable.ListTable.EVENT_TYPE.BUTTON_CLICK`事件。

```javascript
instance.on(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e => {
  console.log(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e.col, e.row);
});
```

[点击查看完整示例](../../demo/cell-type/button)
通过以上介绍，您已学会了如何在 VTable 表格中使用 button 按钮类型进行数据展示，希望对您有所帮助。
