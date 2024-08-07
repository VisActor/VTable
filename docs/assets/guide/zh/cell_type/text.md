# 表格展示文本类型（Text）介绍

在表格应用中，文本类型的数据是最常见且基础的数据展示形式，从简单的表格内容到复杂的样式调整，都要围绕文本数据展示来进行。而作为数据分析的基础展示形式，良好的文本类型设置可以为用户提供更好的阅读体验。本教程将详细介绍文本类型在 VTable 中的应用方法及其相关配置项。

在 VTable 中，您可以根据实际需求进行自定义字段、样式，从而实现灵活多样的文本类型展示效果。

## 样式配置介绍

VTable 支持为文本类型数据设置多样化的样式，以下为文本类型的 style 配置项：

- `textAlign`：定义文本在单元格内的水平对齐方式，可以设置为`left`、`center`、`right`。
- `textBaseline`：定义文本在单元格内的垂直对齐方式，可以设置为`top`、`middle`、`bottom`。
- `textOverflow`：设置文本的省略形式，可配置为：`'clip' | 'ellipsis' | string`，分别代表截断文字、用`...`代表省略文字、用其他字符串代替省略文字。如果 `autoWrapText` 设置了自动换行，则该配置无效。
- `color`：定义文本的颜色。
- `fontSize`：定义文本的大小。
- `fontFamily`：定义文本的字体。
- `fontWeight`：定义文本的字体粗细。
- `fontVariant`：定义文本的字体粗细。
- `fontStyle`：定义文本的字体样式。
- `textOverflow`：设置文本的省略形式，需要注意的是：如果 autoWrapText 设置了自动换行，该配置无效。
- `lineHeight`：为单元格文本内容设置文字行高。
- `underline`：为单元格文本内容设置下划线。
- `underlineDash`：下划线的虚线样式。
- `underlineOffset`：下划线与文字的间隔距离。
- `lineThrough`：为单元格文本内容设置中划线。
- `textStick`：设置单元格的文本是否带有吸附效果【当滚动时文本可动态调整位置】，可以设置为 true 开启， 或者设置 'horizontal' 或 'vertical' 指定仅在哪个方向吸附。
- `textStickBaseOnAlign`：当单元格的文本有吸附效果【当滚动时文本可动态调整位置】时，吸附的基准是单元格的水平对齐方式。例如当`textStickBaseOnAlign`为`true`时，`textAlign`为`'center'`时，文本会吸附在单元格的水平中心位置；否则就会吸附在单元格左边缘或右边缘（依据滚动位置决定）
- `autoWrapText`：设置单元格是否自动换行。
- `lineClamp`：设置单元格的最大行数, 可设置 number 或者'auto',如果设置为'auto', 则会自动计算

注：以上这些样式在超链接数据格式内容同样适用。

## 示例：

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto',
        style: {
          textAlign: 'left',
          textBaseline: 'middle',
          textOverflow: 'ellipsis',
          color: '#F66',
          fontSize: 14,
          fontFamily: 'Arial',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          fontStyle: 'italic'
        }
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      theme: VTable.themes.DEFAULT
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```

结合以上示例，您可以根据实际需求配置文本类型在 VTable 中的展示效果。通过合理调整文本的样式及相关配置项，可以为用户提供清晰易懂的表格展示效果。
