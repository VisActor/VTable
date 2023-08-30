{{ target: common-layout-item }}

<!-- ILayoutItemSpec -->

#${prefix} layoutType(string) = ${defaultLayoutType}

当前模块的布局类型，配置为 `absolute` 的话，当前元素会以图表左上角为原点进行绝对布局。

目前支持的布局类型如下：

- `'region'`: 图表的绘图区域，一般只有 region 模块为这个类型
- `'region-relative'`: 与 region 位置相关的模块，比如轴，datazoom 等
- `'normal'`: 普通占位元素，比如图例，标题等
- `'absolute'`: 绝对布局元素，比如 tooltip，markline 等

#${prefix} layoutLevel(number) = ${defaultLayoutLevel}

布局顺序等级，等级越大的，越优先布局，比如顶部同时有标题和图例的场景，期望标题先放在顶部，然后放置图例。

{{ if: !${noOrient} }}
#${prefix} orient(string)

模块布局位置。可选位置：

- 'left'
- 'top'
- 'right'
- 'bottom'

{{ /if }}

#${prefix} padding(ILayoutNumber|Array|Object) = 0

模块的布局间距配置（上下左右四个方向），支持非对象配置、数组配置与对象配置。

非对象配置时，配置值会同时应用到上下左右四个方向，属性如下:

{{ use: common-layout-number }}

数组配置时，数组每一项都支持 ILayoutNumber ，使用示例:

```ts
padding: [5]; // 上右下左内边距均为 5px
padding: ['10%']; // 上下内边距为相对 图表视图区域 高的 10%，左右内边距为相对 图表视图区域 宽的 10%
padding: [5, 10]; // 上下内边距为 5px，左右内边距为 10px
padding: [
  5, // 上内边距为 5px
  '10%', // 左右内边距为相对 图表视图区域 宽的 10%
  10 // 下内边距为 10px
];
padding: [
  5, // 上内边距为 5px，
  '10%', // 右内边距为相对 图表视图区域 宽的 10%，
  '5%', // 下内边距为相对 图表视图区域 高的 5%
  (rect: ILayoutRect) => rect.height * 0.1 + 10 // 左内边距为图表视图区域 高的 0.1 + 10
];
```

对象配置的属性如下：

{{ use: common-layout-padding(
  prefix = '#' + ${prefix}
) }}

使用示例:

```ts
padding: 10,   // 上右下左内边距均为 10px
padding: '10%' // 上右下左内边距均为相对 **图表视图区域** 宽高的 10%
padding: {
  top: 10, // 上方内边距 10px
  left: ({ width }) => width * 0.1, // 左方内边距为布局宽度的 0.1
  right: '10%' // 右方内边距为布局宽度的 0.1
}
```

#${prefix} width(ILayoutNumber)

模块的布局宽度配置。

{{ use: common-layout-number }}

#${prefix} minWidth(ILayoutNumber)

模块的最小布局宽度配置。当配置了 width 时，此配置无效。

{{ use: common-layout-number }}

#${prefix} maxWidth(ILayoutNumber)

模块的最大布局宽度配置。当配置了 width 时，此配置无效。

{{ use: common-layout-number }}

#${prefix} height(ILayoutNumber)

模块的布局高度配置。

{{ use: common-layout-number }}

#${prefix} minHeight(ILayoutNumber)

模块的最小布局宽度配置。当配置了 height 时，此配置无效。

{{ use: common-layout-number }}

#${prefix} maxHeight(ILayoutNumber)

模块的最大布局宽度配置。当配置了 height 时，此配置无效。

{{ use: common-layout-number }}

#${prefix} offsetX(ILayoutNumber)

模块的布局位置在 X 方向的偏移。

{{ use: common-layout-number }}

#${prefix} offsetY(ILayoutNumber)

模块的布局位置在 Y 方向的偏移。

{{ use: common-layout-number }}

#${prefix} zIndex(number) = ${defaultLayoutZIndex}

模块的展示层级，当 2 个模块重叠时，层级较大的展示在上方。

#${prefix} clip(boolean)

模块是否裁剪超出布局区域外的绘图内容 。

#${prefix} left(ILayoutNumber)

模块绝对布局下，与图表左侧的距离。注意**仅在 layoutType === 'absolute' 时生效**。

{{ use: common-layout-number }}

#${prefix} right(ILayoutNumber)

模块绝对布局下，与图表右侧的距离。注意**仅在 layoutType === 'absolute' 时生效**。

{{ use: common-layout-number }}

#${prefix} top(ILayoutNumber)

模块绝对布局下，与图表顶部的距离。注意**仅在 layoutType === 'absolute' 时生效**。

{{ use: common-layout-number }}

#${prefix} bottom(ILayoutNumber)

模块绝对布局下，与图表底部的距离。注意**仅在 layoutType === 'absolute' 时生效**。

{{ use: common-layout-number }}

#${prefix} center(boolean)

模块绝对布局下，元素将放置在图表的正中间。注意**仅在 layoutType === 'absolute' 时生效，同时将忽略 padding 属性**。
