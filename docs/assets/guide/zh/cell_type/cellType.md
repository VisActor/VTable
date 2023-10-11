# 数据类型

在数据分析和可视化领域，VTable 的典型应用之一便是显示和呈现各种类型的数据，这里所谓的类型包括：文本、链接、图片、视频、进度条以及图表等。通过支持多种列类型，VTable 可以为用户现更丰富、更多样化的数据体验，便于用户从不同视角和维度来观察和理解数据。

接下来，本文将重点讨论各类列类型及其用法和特点，以帮助您深入了解使用 VTable 进行数据可视化的方法。

## 支持类型

VTable 所支持的数据类型共有 7 种，分别为：

1. text
2. link
3. image
4. video
5. progressbar
6. sparkline
7. chart

接下来，我们将逐一介绍每一种列类型的相关内容。

## text

列类型为 "text" 的列主要用于显示文本数据，是最为常见的表列类型。它具有较强的灵活性，因为可以通过设置不同的格式化函数和定制样式来对文本进行展示和处理。

首先，让我们看一个 `cellType: 'text'` 的例子：

```javascript
{
  cellType: 'text',
  field: 'name',
  title: '姓名',
}
```
在这个例子中：

- `cellType: 'text'` 表示当前列用于显示文本数据。
- `field: 'name'` 指定了当前表示姓名的数据字段。
- `title: '姓名'` 为表头设置名为“姓名”的列标题。

需要注意的是，如果当前列的 `cellType` 项缺省，默认为 'text' 类型。

接下来，我们通过设置格式化函数和定制样式来对文本进行处理：

```javascript
{
  cellType: 'text',
  field: 'name',
  title: '姓名',
  fieldFormat: (record) => record.name.toUpperCase(),
  style: {
    color: 'blue',
  },
}
```

在这个例子中：

- `fieldFormat: (record) => record.name.toUpperCase()` 表示将数据源中的姓名字段全都转换成大写字母显示。
- `style: { color 'blue' }` 表示将文本显示颜色设置为蓝色。

通过以上设置，我们能够对 "text" 类型的列进行一定程度的定制，以满足数据展示的需求。

## link

当列类型为 "link" 时，用于显示链接类型的数据。与 "text" 类型相似，"link" 类型也具有较高的灵活性，可以通过设置不同的格式化函数、样式以及点击时的跳转地址、是否检测链接的合法性等来对链接进行显示和处理。

以下展示一个 `cellType: 'link'` 的例子，并通过设置跳转地址和检测链接的合法性来对链接类型的数据进行处理：

```javascript
{
  cellType: 'link',
  field: 'homepage',
  title: '主页',
  linkJump: true,
  linkDetect: true,
}
```

在这个例子中：

- `linkJump: true` 表示链接可以点击跳转。
- `linkDetect: true` 表示要对链接进行正则检测，如果链接符合链接规则，才展示成为 link。
此外，超链接形式还可以支持模版链接，如设置templateLink：
```javascript
{
  templateLink:https://www.google.com.hk/search?q={name}', //name是数据源属性字段名。
}
```
通过以上设置，我们能够对 "link" 类型的列进行定制，以满足数据展示的需求。

## image

当列类型为 "image" 时，用于显示图片类型的数据。"image" 类型具有一定的灵活性，可以通过设置不同的图片展示方式和定制样式如保持横纵比、维持图片原尺寸等来对数据进行处理。

以下展示一个 `cellType: 'image'` 的例子，我们通过设置保持横纵比和图片自动撑开单元格尺寸的属性对图片类型的数据进行处理：

```javascript
{
  cellType: 'image',
  field: 'avatar',
  title: '头像',
  keepAspectRatio: true,
  imageAutoSizing: true,
}
```

在这个例子中：

- `keepAspectRatio: true` 表示要保持图片的横纵比显示。
- `imageAutoSizing: true` 表示要根据图片的尺寸自动撑开单元格的尺寸。

通过以上设置，我们能够对 "image" 类型的列进行定制，以满足数据展示的需求。

详细教程参考：https://visactor.io/vtable/guide/cell_type/image_video

## video

当列类型为 "video" 时，用于显示视频类型的数据。"video"所有配置项和image一样，可参考image类型配置项。


## progressbar

当列类型为 "progressbar" 时，用于显示进度条类型的数据。可以通过设置进度条的类型、进度条的数据范围等对进度条数据进行处理。

以下展示一个 `cellType: 'progressbar'` 的例子：

```javascript
{
  cellType: 'progressbar',
  field: 'progress',
  title: '进度',
  min: 0,
  max: 100,
  barType: 'default',
}
```

在这个例子中：

- `min: 0` 表示进度条展示范围的最小数据。
- `max: 100` 表示进度条展示范围的最大数据。
- `barType: 'default'` 表示**进度条类型**为 default 类型。

详细教程参考：https://visactor.io/vtable/guide/cell_type/progressbar

## sparkline

当列类型为 "sparkline" 时，用于显示迷你图类型的数据。"sparkline" 类型具有较高的灵活性，可以通过设置迷你图具体的 spec 配置项来对迷你图的数据进行处理。

以下展示一个 `cellType: 'sparkline'` 的例子：

```javascript
{
  cellType: 'sparkline',
  field: 'trend',
  title: '趋势',
  sparklineSpec: {
    type: 'line',
    xField: 'x',
    yField: 'y',
    line: {
      style: {
        stroke: '#2E62F1',
        strokeWidth: 2
      }
    },
    point: {
      hover: {
        stroke: 'blue',
        strokeWidth: 1,
        fill: 'red',
        shape: 'circle',
        size: 4
      }
    }
  }
}
```

在这个例子中：
- `sparklineSpec` 设置了迷你图的类型和具体的配置项。

详细教程参考：https://visactor.io/vtable/guide/cell_type/sparkline

## chart

当列类型为 "chart" 时，用于显示图表类型的数据。在使用该类型之前需要先通过VTable.chart.register注册一种图表类型，具体可以参考教程[vchart注册使用](../../guide/cell_type/chart)。注册之后的使用示例：

以下展示一个 `cellType: 'chart'` 的例子：

```javascript
{
  cellType: 'chart',
  field: 'chartData',
  title: '销售趋势',
  chartModule: 'vchart',
  chartSpec: {
    type: 'common',
    series: [
      {
        type: 'line',
        data: {
          id: 'data',
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'type',
      },
    ],
    axes: [
      { orient: 'left', range: { min: 0 } },
      { orient: 'bottom', label: { visible: true }, type: 'band' },
    ],
    legends: [
      {
        visible: true,
        orient: 'bottom',
      },
    ],
  },
}
```

在这个例子中：

- `chartModule: 'vchart'` 使用 VTable 内置的图表库组件，注册名称为vchart
- `chartSpec` 设置了图表类型和具体的配置项，具体配置项需要参考[VChart](https://visactor.io/vchart)。

详细教程参考：https://visactor.io/vtable/guide/cell_type/chart

## 类型混合使用

某些需求场景中可能期望在不同的数据情况下或者不同的行列中展示不同的数据类型，上述cellType的写法明确指定了一列必须是什么类型（转置表中指定一行必须是什么类型），我们支持了cellType函数自定义的方式，可以根据需求逻辑指定不同的类型：

以下展示一个 `cellType: ()=>{}` 的例子：(可参考[示例](https://visactor.io/vtable/demo/cell-type/composite-cellType))
 
```javascript
{
    field: 'image',
    title: 'bird image',
    cellType(args){
      if(args.row%3===1)
        return 'image';
      else if(args.row%3===2)
        return 'link';
      return 'text'
    },
    fieldFormat(record){
      debugger
      if(record.name==='Magpie')
        return 'Magpie 的访问地址：'+record.image;
      return record.image;
    },
    width:'auto',
    keepAspectRatio:true,
  }
```