# switch 开关类型

开关类型单元格适用于在表格中用于提供开关状态，并允许用户选择或取消选择一个或多个项目。开关类型单元格提供的交互能力在许多应用中被广泛使用。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/switch.png)

## switch 开关的专属配置项介绍

switch 开关类型在配置中的特有配置项如下：

1. `checked`：单元格是否处于选中状态，默认值为 false，支持配置函数，不同单元格配置不同。
2. `disable`：单元格开关是否可禁用点击，默认值为 false，支持配置函数，不同单元格配置不同。
3. `checkedText`：指定选中状态的文字，支持配置函数。
4. `uncheckedText`：指定未选中状态的文字，支持配置函数。

示例：

```javascript
{
  field: 'switch', // 指定单元格的field
  cellType: 'switch', // 指定单元格显示为开关类型
  checked: true,
  disable: false,
  checkedText: 'on', // 指定选中状态的文字，支持配置函数
  uncheckedText: 'off', // 指定未选中状态的文字，支持配置函数
  style: {
    // 指定文字的样式
    color: '#FFF',
    // ......
    // 指定开关的样式
    switchStyle: {
      boxWidth: 40, // 指定开关的宽度
      boxHeight: 20, // 指定开关的高度
      // ......
    }
  }
}
```

## switch 开关的专属数据类型介绍

switch 开关类型对应的数据，支持 `boolean`或 `Object`，或者不设置值默认 false。

1. 三种类型中设置 `boolean`类型较为常见。如 switch 字段设置如下：

```javascript
const columns = [
  // ......
  {
    field: 'switch',
    cellType: 'switch'
  }
];
const records = [
  { name: 'a', switch: true },
  { name: 'b', switch: false }
];
```

2. 设置 `Object`类型，支持配置 `checked`和 `disable`，如 switch 字段设置如下：

```javascript
const columns = [
  // ......
  {
    field: 'switch',
    cellType: 'switch'
  }
];
const records = [
  { name: 'a', switch: { checked: true, disable: false } },
  { name: 'b', switch: { checked: false, disable: true } }
];
```

- checked: 该单元格复选框是否被选中
- disable: 该单元格复选框是否被禁用

`checked`和`disable`同时支持在数据中和在`column`中配置，数据中配置的优先级高于`column`中的配置。

## switch 开关状态更新事件

switch 开关状态更新后，会触发`VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE`事件。

```javascript
instance.on(VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE, e => {
  console.log(VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE, e.col, e.row, e.checked);
});
```

## 通过接口获取数据选中状态

1. 获取某个字段下开关 全部数据的选中状态 。

注意：顺序对应原始传入数据 records 不是对应表格展示 row 的状态值

```
getSwitchState(field?: string | number): Array
```

2. 获取某个单元格开关的选中状态。

```
getCellSwitchState(col: number, row: number): boolean
```

## 通过接口设置数据选中状态

设置某个单元格开关的选中状态。

```
setCellSwitchState(col: number, row: number, checked: boolean)
```

[点击查看完整示例](../../demo/cell-type/switch)
通过以上介绍，您已学会了如何在 VTable 表格中使用 switch 开关类型进行数据展示，希望对您有所帮助。
