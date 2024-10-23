# radio单选框类型

单选框类型单元格适用于用户在表格中的多个项目中选中一个。单选框类型单元格在许多应用中被广泛使用，包括任务管理、数据筛选、权限设置等。

在表格中单选框单元格的优点如下：

1. 单选框类型单元格的使用非常直观和灵活。用户可以根据自己的需求在一列或一个单元格中选择一个选项，以进行特定操作或过滤数据。这种交互方式使得用户能够更加精细地控制其操作，提高了用户体验和效率。
2. 单选框类型单元格通常使用不同的图标或颜色来表示选中和未选中的状态，提供可视化的反馈。这样用户可以轻松地识别哪些选项已经被选择，哪些选项未被选择。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/radio.png)

## radio单选框的专属配置项介绍

radio 单选框类型在配置中的特有配置项如下：

1. `checked`：单元格是否处于选中状态，默认值为 false，支持配置函数，不同单元格配置不同。
2. `disable`：单元格单选框是否可禁用点击，默认值为 false，支持配置函数，不同单元格配置不同。
3. `radioCheckType`: 单选框唯一的范围，默认值为`column`：

   * `column`: 单选框在一列中唯一选中
   * `cell`: 单选框在一个单元格中唯一选中

4. `radioDirectionInCell`: 单选框类型单元格中有多个单选框时，单选框排布的方向，默认值为`vertical`：

   * `vertical`: 单选框垂直排布
   * `horizontal`: 单选框水平排布

示例：
```javascript
{
  headerType: 'radio', //指定表头单元格显示为单选框
  cellType: 'radio',//指定body单元格显示为单选框
  field: 'check',
  checked: (args) => { if (args.row === 3) return true },
  disbaled: false,
  radioCheckType: 'column',
  radioDirectionInCell: 'vertical',
}
```

## radio单选框的专属数据类型介绍

radio 对应的数据，支持 `boolean` `string` `Object`，或者`string` `Object`组成的数组，这种情况下单元格内会显示多个单选框；不设置值默认false。

1.  三种类型中设置 `boolean`类型较为常见。如check字段设置如下：
```
const columns=[
  {
    headerType: 'radio', //指定表头单元格显示为单选框
    cellType: 'radio',//指定body单元格显示为单选框
    field: 'check',
  }
]
const records = [
  { 
    product: 'a',
    check: true
  },
  { 
     product: 'b',
    check: false
  },
  { 
     product: 'c',
    check: false
  }
]
```

2.  如果设置为 `string`类型则会将文本显示在radio框的右侧，单选框默认为未选择状态。如product字段设置如下：
```
const columns=[
  {
    headerType: 'radio', //指定表头单元格显示为单选框
    cellType: 'radio',//指定body单元格显示为单选框
    field: 'product',
  }
]
const records = [
  { 
    product: 'a',
  },
  { 
     product: 'b',
  },
  { 
     product: 'c',
  }
]
```

3.  如果数据条目每个状态都不同，可以设置Object对象。

其中Object对象中支持配置以下属性：

* text: 该单元格单选框中显示的文字
* checked: 该单元格单选框是否被选中
* disable: 该单元格单选框是否被禁用

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

## 通过接口获取数据选中状态

获取某个字段下radio 全部数据的选中状态：

注意：顺序对应原始传入数据records 不是对应表格展示row的状态值
```
getRadioState(field?: string | number): number | Record<number, boolean | number>
```

获取某个单元格radio的状态：

注意：如果一个单元格中包含多个单选框，则返回值为number，指该单元格内选中radio的索引，否则返回值为boolean。
```
getCellRadioState(col: number, row: number): boolean | number
```


通过以上介绍，您已学会了如何在 VTable 表格中使用 radio 单选框类型进行数据展示，希望对您有所帮助。