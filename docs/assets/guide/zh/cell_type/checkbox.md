# checkbox复选框类型

复选框类型单元格适用于在表格中用于提供多选选项，并允许用户选择或取消选择一个或多个项目。复选框类型单元格在许多应用中被广泛使用，包括任务管理、数据筛选、权限设置等。

在表格中复选框单元格的优点如下：

1. 复选框类型单元格的使用非常直观和灵活。用户可以根据自己的需求选择一个或多个选项，以进行特定操作或过滤数据。这种交互方式使得用户能够更加精细地控制其操作，提高了用户体验和效率。
2. 复选框类型单元格通常使用不同的图标或颜色来表示选中和未选中的状态，提供可视化的反馈。这样用户可以轻松地识别哪些选项已经被选择，哪些选项未被选择。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/checkbox.png)

## checkbox复选框的专属配置项介绍

checkbox 复选框类型在配置中的特有配置项如下：

1. `checked`：单元格是否处于选中状态，默认值为 false，支持配置函数，不同单元格配置不同。
2. `disable`：单元格复选框是否可禁用点击，默认值为 false，支持配置函数，不同单元格配置不同。

示例：
```javascript
{
  cellType: 'checkbox',
  field: 'check',
  checked: true,
  disbaled: false
}
```

## checkbox复选框的专属数据类型介绍

checkbox 对应的数据，支持字符串或对象，其中对象中支持配置以下属性：

* text: 该单元格复选框中显示的文字
* checked: 该单元格复选框是否被选中
* disable: 该单元格复选框是否被禁用

示例：
```javasxript
const records = [
  { 
    percent: '100%',
    check: { 
      text: 'unchecked',
      checked: false,
      disable: false
    }
  },
  {
    percent: '80%',
    check: { 
      text: 'checked', 
      checked: true, 
      disable: false 
    }
  }
];
```

`checked`和`disable`同时支持在数据中和在`column`中配置，数据中配置的优先级高于`column`中的配置。

通过以上介绍，您已学会了如何在 VTable 表格中使用 checkbox 复选框类型进行数据展示，希望对您有所帮助。