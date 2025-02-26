# 行高列宽

在数据分析领域，表格是一种常见的数据展示方式。正确设置表格的行高列宽对于提高数据可读性和美观性具有重要意义。本教程将围绕 VTable 中的表格行高列宽计算功能，带了解如何正确配置行高和列宽以满足实际需求。

# 列宽计算模式

在 VTable 中，表格列宽度的计算模式`widthMode`可以配置为 `standard`（标准模式）、`adaptive`（自适应容器宽度模式）或 `autoWidth`（自动列宽模式）。[demo 示例](https://visactor.io/vtable/demo/basic-functionality/width-mode-autoWidth)。（如果设置了`widthMode: 'autoWidth'`, 那么每一个单元格都会参与计算宽度，可想而知这个计算过程是需要耗费性能的。）

- 标准模式（standard）：表格使用`width` 属性指定的宽度作为列宽度，如未指定，则采用 `defaultColWidth`或`defaultHeaderColWidth ` 设定的默认列宽。
- 自适应容器宽度模式（adaptive）：在自适应容器宽度模式下表格使用容器的宽度分配列宽度(每列宽度的比例基于 standard 模式中的宽度值)。 如果不想表头参与计算可通过 `widthAdaptiveMode` 来改变。[demo 示例](https://visactor.io/vtable/demo/basic-functionality/width-mode-adaptive)
- 自动列宽模式（autoWidth）：在自动宽度模式下，根据列头和 body 单元格中的内容自动计算列宽度，忽略设置的 `width` 属性和 `defaultColWidth`。

# 行高计算模式

表格行高度的计算模式`heightMode`也可以配置为 `standard`（标准模式）、`adaptive`（自适应容器宽度模式）或 `autoHeight`（自动行高模式）。

- 标准模式（standard）：采用 `defaultRowHeight` 及 `defaultHeaderRowHeight` 作为行高。
- 自适应容器高度模式（adaptive）：使用容器的高度分配每行高度，默认逻辑是基于每行内容计算后的高度比例来分配。如果不想表头参与计算可通过 `heightAdaptiveMode` 来改变。如果只想通过默认高度来计算行高，则可以通过关闭配置 `autoHeightInAdaptiveMode` 来实现， 这样反而节省性能。
- 自动行高模式（autoHeight）：根据内容自动计算行高，计算依据 fontSize 和 lineHeight(文字行高)，以及 padding。相关搭配设置项`autoWrapText`自动换行，可以根据换行后的多行文本内容来计算行高。

# 行高相关配置

## 默认行高

在 VTable 中，您可以为整个表格设置一个统一的默认行高值。默认行高可以通过 `defaultRowHeight` 配置项进行设置。以下代码示例展示了如何设置默认行高为 50：

```javascript
const table = new VTable.ListTable({
  defaultRowHeight: 50
});
```

VTable 内部设置的默认行高为 40。

## 表头默认行高

除了默认行高的设置，VTable 还支持针对表头的行高进行设置。通过 `defaultHeaderRowHeight` 配置项进行设置，该配置项可以设定为一个数组，分别对应各级表头行的高度，或者一个数值统一设置表格各行高度。

定义如下，如果设置为 auto 可以根据表头单元格内容计算高度。

```javascript
  /**表头默认行高 可以按逐行设置 如果没有就取defaultRowHeight */
  defaultHeaderRowHeight: (number | 'auto') | (number | 'auto')[];
```

以下代码示例展示了如何设置一级表头行高为 30，二级表头行高为 'auto'：

```javascript
const table = new VTable.ListTable({
  defaultHeaderRowHeight: [30, 'auto']
});
```

## 行高撑满容器：autoFillHeight

配置项 autoFillHeight，用于控制是否自动撑满容器高度。区别于高度模式`heightMode`的`adaptive`的自适应容器的效果，autoFillHeight 控制的是只有当行数较少的时候，表格可以自动撑满容器高度，但是当行数超过容器的时候根据真实情况来定行高可出现滚动条。

```javascript
const table = new VTable.ListTable({
  autoFillHeight: true
});
```

## 自定义计算行高

如果需要自定义计算行高的逻辑，可以配置`customComputeRowHeight`函数来代理 VTable 内部计算行高的逻辑。

# 列宽相关配置

## 列宽 width

可以在列属性中配置具体的宽度值，或者百分比或者`auto`自动计算列宽。

```
width?: number | string;
```

基本表格配置列宽：

```javascript
const table = new VTable.ListTable({
  columns: [
    {
      // ...其他配置项
      width: 200
    }
  ]
});
```

透视表列宽配置：

1. 关联指标设置列宽

```javascript
const table = new VTable.PivotTable({
  indicators: [
    {
      // ...其他配置项
      width: 200
    }
  ],
  ...
});
```

2. 通过维度路径设置列宽

通过`columnWidthConfig`配置项进行设置，该配置项可以设定为一个数组，分别对应各级维度路径的列的宽度。

```javascript
const table = new VTable.PivotTable({
      columnWidthConfig: [
      {
        dimensions: [
          {
            dimensionKey: '地区',
            value: '东北'
          },
          {
            dimensionKey: '邮寄方式',
            value: '二级'
          },
          {
            indicatorKey: '2',
            value: '利润'
          }
        ],
        width: 130
      },
      {
        dimensions: [
          {
            dimensionKey: '地区',
            value: '东北22'
          },
          {
            indicatorKey: '1',
            value: '销售额'
          }
        ],
        width: 160
      }
    ],
  ...
});
```

效果如下：

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/columnWidthConfig.jpeg" />
  </div>

## 默认列宽

在 VTable 中，您可以设置一个统一的默认列宽值。默认列宽可以通过 `defaultColWidth` 配置项进行设置。以下代码示例展示了如何设置列宽为 100：

```javascript
const table = new VTable.ListTable({
  defaultColWidth: 100
});
```

## 行表头默认列宽

除了默认列宽的设置，VTable 还支持针对行表头的列宽进行设置。通过`defaultHeaderColWidth`配置项进行设置，该配置项可以设定为一个，分别对应各级`行表头`列的宽度。

```javascript
  /**表头默认列宽 可以按逐列设置 如果没有就取defaultColWidth */
  defaultHeaderColWidth: (number | 'auto') | (number | 'auto')[];
```

以下代码示例展示了如何设置一级行表头列宽为 50，二级行表头列宽为 60：

```javascript
const table = new VTable.ListTable({
  defaultHeaderColWidth: [50, 60]
});
```

需要注意的是：这个配置仅针对行表头起作用，如果是列表头的话是不考虑这个配置项的（会按 body 部分定义的宽度设置来执行逻辑）。

具体的如：

- 转置基本表格，如配置 defaultHeaderColWidth: [50, 'auto'], 表示转置表格的表头第一列宽度 50，第二列按单元格内容适应宽度
- 透视表，如配置 defaultHeaderColWidth: [50, 'auto'], 表示透视表的行表头第一列宽度 50（即第一级维度），第二列（第二级维度）按单元格内容适应宽度。

## 列宽限制配置：maxWidth+minWidth

在配置列宽的过程中，您可能遇到需要限制某一列最大或最小列宽的场景。VTable 提供了 `maxWidth` 和 `maxWidth` 配置项，用于限制每一列的最大和最小列宽。以下代码示例展示了如何设置某一列的最大列宽为 200，最小列宽为 50：

```javascript
const table = new VTable.ListTable({
  columns: [
    {
      // ...其他配置项
      maxWidth: 200,
      minWidth: 50
    }
  ]
});
```

## 列宽限制配置：limitMaxAutoWidth

当使用“自动宽度模式”时，可能需要限制计算出的最大列宽。通过 `limitMaxAutoWidth` 配置项进行设置，可以避免某一列宽度过大导致的显示异常。`limitMaxAutoWidth` 配置项支持设定一个具体的数值或布尔类型，如果设置为 true 或者没有设置该配置则使用 450 来限制最大列宽。例如设置限制最大列宽为 500：

```javascript
table = new VTable.ListTable({
  // ...其他配置项
  limitMaxAutoWidth: 500
});
```

## 列宽限制配置：limitMinWidth

在拖拽列宽时很容易将宽度拖拽为 0，这样可能造成再想将其拖拽回去有一定交互问题，或者功能限制不应该拖拽成隐藏列，这个时候可以通过配置`limitMinWidth`来限制最小列宽，如限制为最小可拖拽宽度为 20。

注意：如设置为 true 则拖拽改变列宽时限制列宽最小为 10px，设置为 false 则不进行限制。或者直接将其设置为某个数字值。默认为 10px。

```javascript
table = new VTable.ListTable({
  // ...其他配置项
  limitMinWidth: 20
});
```

## 列宽撑满容器：autoFillWidth

配置项 autoFillWidth，用于控制是否自动撑满容器宽度。区别于宽度模式`widthMode`的`adaptive`的自适应容器的效果，autoFillWidth 控制的是只有当列数较少的时候，表格可以自动撑满容器宽度，但是当列数超过容器的时候根据真实情况来定列宽可出现滚动条。

```javascript
const table = new VTable.ListTable({
  autoFillWidth: true
});
```

## 按内容计算列宽只计算表头或者 body 部分：columnWidthComputeMode

计算内容宽度时限定只计算表头内容，或者 body 单元格内容，或者全部都适应计算。

配置项定义：

```
  columnWidthComputeMode?: 'normal' | 'only-header' | 'only-body';
```

用法

```javascript
const table = new VTable.ListTable({
  columns: [
    {
      // ...其他配置项
      columnWidthComputeMode： 'only-header'
    },
  ],
});
```

也可以在全局配置该字段

```javascript
const table = new VTable.ListTable({
  // 计算列宽时值考虑body单元格内容
  columnWidthComputeMode： 'only-header',
  widthMode:'autoWidth'
});
```

# FAQ

## 特定列设置自适应内容来计算列宽

如果并不是想每一列都需要计算列宽，可以使用 columns 中的 width 来定义，而不用设置`widthMode: 'autoWidth'`。

## 列宽根据表头内容自适应

如果只需要计算表头内容宽度的话，可以用`columnWidthComputeMode: 'only-header'`来实现。不过需配合设置`widthMode:'autoWidth'`使用。

## 转置表格列宽配置问题

表头部分请使用 defaultHeaderColWidth 来指定每列宽度，body 部分请使用 defaultColWidth 来指定。

如果在 columns 中声明了 width，我们会遍历 columns 配置的 width 最大 number 值作为所有列的列宽。如果没有 number 值的 width 配置，但其中某列配置了 auto 则自动计算所有列宽。为了使配置更清晰合理，所以我们建议使用 defaultColWidth 来指定列宽。

## 表格宽高配置

一般需要通过指定容器宽高进而给定表格整体的宽高。如果不指定宽高，想让 VTable 根据内容自动撑开容器的话，可以设置 canvasWidth 为'auto', canvasHeight 为'auto'。 同时配合 maxCanvasWidth 与 maxCanvasHeight 来限制最大宽高。

至此，我们已经介绍了 VTable 中的表格行高列宽计算功能，包括行高、列宽配置，以及表格宽度模式。通过掌握这些功能，您可以更便捷地 VTable 中进行数据展示与分析，现各种实际需求。
