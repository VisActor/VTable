# icon 使用

在 VTable 中，我们可以使用自定义图标功能来提高表格的可读性和视觉效果。本教程将主要介绍 icon 的使用方式、注册方法以及如何重置功能图标。

## 定义 icon

我们可以通过 icon 和 headerIcon 来分别分别配置表头及 body 显示的单元格图标：

- `headerIcon` 表头单元格图标配置，它可以帮助我们设置表头的图标样式。配置项根据 `ColumnIconOption` 的类型进行定义，具体可以参考给定的配置。

- `icon` 则用于配置 body 单元格的图标。

配置具体内容为`ColumnIconOption`类型的对象，也可以通过传递一个自定义函数，动态设置单元格的图标样式。ColumnIconOption 具体定义可以参考：https://visactor.io/vtable/option/ListTable-columns-text#icon

### 表头图标配置示例

首先，我们来看一个使用 `headerIcon` 的简单示例。

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

这个示例中，我们为列表头创建了一个名为 "订单编号" 的字段，并为其配置了一个名为 `filter` 的图标。

如需在透视表的行列表头中使用图标，可采用同样的配置方法。

### 单元格图标配置示例

接下来，我们来看一个使用 `icon` 的简单示例。

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

这个示例中，我们为单元格配置了一个名为 `Avatar` 的图标。该图标的作用是用来显示头像图片，图片 src 的值是从 records 的 avator 的字段中获取到的。

在线 [demo](../../demo/custom-render/custom-icon)

## 如何注册 icon 及注册后的使用

在 VTable 中，通过 `register.icon` 方法，我们可以注册自定义图标，并在表格中使用。如果想替换内置的功能图标，也可以通过注册来实现。

[注册接口方法使用介绍](../../api/register#icon)

### 示例：注册一个名为 order 的图标

假设我们需要注册一个名为 `order` 的图标，代码如下：

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

### 注册后的使用方法

注册完成后，我们可以在表格的列定义中，通过 `headerIcon` 和 `icon` 属性引用这个图标。

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

另外，注册后的图标还可以在 `customLayout` 中使用。

## 重置功能图标

对于内置的功能性图标，如 pin、sort 等，我们可以通过重新注册同名图标的方式来替换它们。需要注意的是，在重新注册图标时，务必配置 `funcType` 属性，以确保图标能够正确替换。

### 示例：替换 frozen 冻结图标

假设我们需要替换内置的 frozen 冻结功能的相关图标，代码如下：

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

替换后的效果在 demo 中查看：https://visactor.io/vtable/demo/custom-render/custom-icon

同样的方法，我们可以替换其他功能性图标。在 VTable 中内置了几种关联内部功能的图标，如排序，固定列，下拉菜单图标，展开折叠图标等。

可重置内部图标列表如下：

| 功能                 | 配置 funcType                             | 配置 name        | 图标描述                                  |
| :------------------- | :---------------------------------------- | :--------------- | :---------------------------------------- |
| 排序                 | VTable.TYPES.IconFuncTypeEnum.sort        | "sort_normal"    | 排序功能图标 正常未排序状态               |
| 排序                 | VTable.TYPES.IconFuncTypeEnum.sort        | "sort_upward"    | 排序功能图标 升序状态                     |
| 排序                 | VTable.TYPES.IconFuncTypeEnum.sort        | "sort_downward"  | 排序功能图标 降序状态                     |
| 固定列               | VTable.TYPES.IconFuncTypeEnum.frozen      | "freeze"         | 固定列功能图标 可固定状态                 |
| 固定列               | VTable.TYPES.IconFuncTypeEnum.frozen      | "frozen"         | 固定列功能图标 已固定状态                 |
| 固定列               | VTable.TYPES.IconFuncTypeEnum.frozen      | "frozenCurrent"  | 固定列功能图标 被冻结当列                 |
| 图片 or 视频地址失效 | VTable.TYPES.IconFuncTypeEnum.damagePic   | "damage_pic"     | 多媒体资源解析失败                        |
| 树形结构折叠         | VTable.TYPES.IconFuncTypeEnum.collapse    | "collapse"       | 树形结构折叠状态                          |
| 树形结构展开         | VTable.TYPES.IconFuncTypeEnum.expand      | "expand"         | 树形结构展开状态                          |
| 树形结构折叠         | VTable.TYPES.IconFuncTypeEnum.collapse    | "collapse"       | 树形结构折叠状态                          |
| 下拉菜单             | VTable.TYPES.IconFuncTypeEnum.dropDown    | "downward"       | 下拉图标正常状态                          |
| 下拉菜单             | VTable.TYPES.IconFuncTypeEnum.dropDown    | "downward_hover" | 下拉图标 hover 状态                       |
| 行拖拽               | VTable.TYPES.IconFuncTypeEnum.dragReorder | "dragReorder"    | 拖拽行顺序，配置了 rowSeriesNumber 时可见 |

**需要注意的是**：列表中的内置图表都有其特殊的功能，可以重置，但不能自行配置在 headerIcon 或者 icon 的定义中！如下错误用法：

```
  columns: [
    {
      field: '销售额',
      title: '销售额',
      width: 'auto',
      sort: true,
      headerIcon: 'expand' // expand 为内部关键字。如需使用请自行注册其他名称来替换到headerIcon
    },
  ]
```

**注意：同时自己业务中注册的图标，不需要配置`funcType`。**

至此，关于 VTable 中 icon 的使用方法、注册和替换功能图标的教程就全部介绍完毕。希望本教程能帮助您更好地理解和使用 VTable，打造出更加优美、实用的数据可视化表格
