# Icon use

In VTable, we can use the custom icon function to improve the readability and visual effect of the table. This tutorial will mainly introduce how to use the icon, how to register it, and how to reset the function icon.

## Define icon

We can configure the cell icons displayed in the header and body through icon and headerIcon respectively:

- `headerIcon` Header cell icon configuration, which can help us set the icon style of the header. Configuration items are based on `ColumnIconOption` The type is defined, and you can refer to the given configuration for details.

- `icon` The icon used to configure the body cell.

The specific configuration content is an object of type `ColumnIconOption`. You can also pass a custom function to dynamically set the icon style of the cell. For the specific definition of ColumnIconOption, please refer to: https://visactor.io/vtable/option/ListTable-columns-text#icon

### Header icon configuration example

First, let's look at a use `headerIcon` Simple example of.

```javascript
const tableInstance = new VTable.ListTable({
  columns: [
    {
      field: 'orderID',
      title: '订单编号',
      headerIcon: {
        type: 'svg', //指定svg格式图标，其他还支持path，image
        svg: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1.29609 1C0.745635 1 0.444871 1.64195 0.797169 2.06491L4.64953 6.68988V9.81861C4.64953 9.89573 4.69727 9.9648 4.76942 9.99205L7.11236 10.877C7.27164 10.9372 7.4419 10.8195 7.4419 10.6492V6.68988L11.2239 2.06012C11.5703 1.63606 11.2685 1 10.721 1H1.29609Z" stroke="#141414" stroke-opacity="0.65" stroke-width="1.18463" stroke-linejoin="round"/>
        </svg>`,
        width: 20,
        height: 20,
        name: 'filter', //定义图标的名称，在内部会作为缓存的key值
        positionType: VTable.TYPES.IconPosition.absoluteRight, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
        visibleTime: 'mouseenter_cell', // 显示时机， 'always' | 'mouseenter_cell' | 'click_cell'
        hover: {
          // 热区大小
          width: 26,
          height: 26,
          bgColor: 'rgba(22,44,66,0.5)'
        },
        tooltip: {
          style: { arrowMark: false },
          // 气泡框，按钮的的解释信息
          title: '过滤',
          placement: VTable.TYPES.Placement.right
        }
      }
    }
  ]
});
```

In this example, we create a field called "Order Number" for the list header and configure it with a field called `filter` Icon.

The same configuration method can be used to use icons in the row and column headers of pivot tables.

### Cell icon configuration example

Next, let's look at a use `icon` Simple example of.

```javascript
const tableInstance = new VTable.ListTable({
  columns: [
    {
      field: 'orderID',
      title: '订单编号',
      icon: {
        type: 'image',
        src: 'avatar', // src从records中field位avator的字段中取值
        name: 'Avatar',
        shape: 'circle',
        //定义文本内容行内图标，第一个字符展示
        width: 30, // Optional
        height: 30,
        positionType: VTable.TYPES.IconPosition.contentLeft,
        marginRight: 20,
        marginLeft: 0,
        cursor: 'pointer'
      }
    }
  ]
});
```

In this example, we configure a cell named `Avatar` Icon. The role of this icon is to display the avatar picture, and the value of the picture src is obtained from the field of the avator of records.

[online demo](../../demo/custom-render/custom-icon)

## How to register the icon and use it after registration

In VTable, through `register.icon` Method, we can register custom icons and use them in the table. If you want to replace the built-in function icons, you can also do so by registering.

[Registration Interface Method Usage Introduction](../../api/register#icon)

### Example: Register an icon named order

Suppose we need to register a `order` Icon, the code is as follows:

```javascript
VTable.register.icon('order', {
  type: 'svg',
  svg: 'http://' + window.location.host + '/mock-data/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
```

### How to use it after registration

After registration is complete, we can, in the column definition of the table, pass `headerIcon` and `icon` Property references this icon.

```javascript
const tableInstance = new VTable.PivotTable({
  columns: [
    {
      field: 'orderID',
      title: '订单编号',
      headerIcon: 'order',
      icon: 'order'
    }
  ]
});
```

In addition, the registered icon can also be found in `customLayout` Used in.

## Reset function icon

For built-in functional icons, such as pin, sort, etc., we can replace them by re-registering the icon of the same name. It should be noted that when re-registering the icon, be sure to configure `funcType` Properties to ensure that icons can be replaced correctly.

### Example: Replacing the frozen freeze icon

Suppose we need to replace the relevant icon of the built-in frozen function, the code is as follows:

```javascript
VTable.register.icon('freeze', {
  type: 'svg',
  svg: 'http://' + window.location.host + '/mock-data/freeze.svg',
  width: 22,
  height: 22,
  name: 'freeze',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

VTable.register.icon('frozen', {
  type: 'svg',
  svg: 'http://' + window.location.host + '/mock-data/frozen.svg',
  width: 22,
  height: 22,
  name: 'frozen',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});

VTable.register.icon('frozenCurrent', {
  type: 'svg',
  svg: 'http://' + window.location.host + '/mock-data/frozenCurrent.svg',
  width: 22,
  height: 22,
  name: 'frozenCurrent',
  positionType: VTable.TYPES.IconPosition.left,
  marginRight: 0,
  funcType: VTable.TYPES.IconFuncTypeEnum.frozen,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)'
  },
  cursor: 'pointer'
});
```

The effect after replacement is as follows: https://visactor.io/vtable/demo/custom-render/custom-icon

In the same way, we can replace other functional icons. Several icons related to internal functions are built into VTable, such as sorting, fixed columns, drop-down menu icons, Expand folding icons, etc.

The list of resettable internal icons is as follows:

| Functions                      | Configure funcType                        | Configure name   | Icon description                                                    |
| :----------------------------- | :---------------------------------------- | :--------------- | :------------------------------------------------------------------ |
| Sort                           | VTable. TYPES. IconFuncTypeEnum.sort      | "sort_normal"    | Sort function icon, normal unsorted status                          |
| Sort                           | VTable. TYPES. IconFuncTypeEnum.sort      | "sort_upward"    | Sort function icons, ascending status                               |
| Sort                           | VTable. TYPES. IconFuncTypeEnum.sort      | "sort_downward"  | Sort function icons, descending status                              |
| Fixed Column                   | VTable. TYPES. IconFuncTypeEnum.frozen    | "freeze"         | Fixed Column Function Icon, Fixed State                             |
| Fixed Columns                  | VTable. TYPES. IconFuncTypeEnum.frozen    | "frozen"         | Fixed Columns Function Icon, Fixed Status                           |
| Fixed Columns                  | VTable. TYPES. IconFuncTypeEnum.frozen    | "frozenCurrent"  | Fixed Columns Function Icon, Frozen When Columns                    |
| Image or video address invalid | VTable. TYPES. IconFuncTypeEnum.damagePic | "damage_pic"     | Multimedia resource parsing failed                                  |
| Tree Structure Folding         | VTable. TYPES. IconFuncTypeEnum.collapse  | "collapse"       | Tree Structure Folded State                                         |
| Tree Structure Expand          | VTable. TYPES. IconFuncTypeEnum.expand    | "expand"         | Tree Structure Expand State                                         |
| Tree Structure Folding         | VTable. TYPES. IconFuncTypeEnum.collapse  | "collapse"       | Tree Structure Folded State                                         |
| Drop-down menu                 | VTable. TYPES. IconFuncTypeEnum.dropDown  | "downward"       | Drop-down icon normal status                                        |
| dropdown menu                  | VTable. TYPES. IconFuncTypeEnum.dropDown  | "downward_hover" | dropdown icon hover status                                          |
| Row drag and drop              | VTable.TYPES.IconFuncTypeEnum.dragReorder | "dragReorder"    | Drag and drop row order, visible when rowSeriesNumber is configured |

**It should be noted**: The built-in charts in the list have their own special functions and can be reset, but they cannot be configured in the definition of headerIcon or icon! The following incorrect usage:

```
  columns: [
    {
      field: 'Sales',
      title: 'Sales',
      width: 'auto',
      sort: true,
      headerIcon: 'expand' // expand is an internal keyword. If you need to use it, please register other names to replace headerIcon.
    },
  ]
```

**At the same time, the icons registered in your own business do not need to configure `funcType`.**

At this point, the tutorial on how to use icons in VTable, register and replace function icons is all introduced. I hope this tutorial can help you better understand and use VTable, and create a more beautiful and practical data lake visualization table
