# data type

In the field of data analytics and visualization, one of the typical applications of VTable is to display and present various types of data. The so-called types here include: text, links, pictures, videos, progress bars, and charts. By supporting multiple column types, VTable can provide users with a richer and more diverse data experience, allowing users to observe and understand data from different perspectives and Dimensions.

Next, this article will focus on the various column types and their usage and characteristics to help you gain insight into data lake visualization using VTable.

## Support type

There are 7 data types supported by VTable, namely:

1.  Text
2.  Link
3.  Image
4.  Video
5.  progressbar
6.  Sparkline
7.  Chart

Next, we'll cover each column type one by one.

## Text

Columns with column type "text" are mainly used to display text data and are the most common type of table column. It is flexible because text can be displayed and processed by setting different formatting functions and custom styles.

First, let's look at a `cellType: 'text'` Example of:

```javascript
{
  cellType: 'text',
  field: 'name',
  title: '姓名',
}
```

In this example:

*   `cellType: 'text'` Represents the current column used to display text data.
*   `field: 'name'` Specifies the data field that currently represents the name.
*   `title: '姓名'` Set a column header named "Name" for the header.

It should be noted that if the current `cellType` Item defaults, defaults to type'text '.

Next, we process the text by setting formatting functions and custom styles:

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

In this example:

*   `fieldFormat: (record) => record.name.toUpperCase()` Indicates that all name fields in the data source are displayed in uppercase letters.
*   `style: { color 'blue' }` Indicates that the text display color is set to blue.

With the above settings, we can customize the columns of type "text" to a certain extent to meet the needs of data presentation.

## Link

When the column type is "link", it is used to display the data of the link type. Similar to the "text" type, the "link" type also has high flexibility. The link can be displayed and processed by setting different formatting functions, styles, and the jump address when clicking, whether to detect the legitimacy of the link, etc.

Show one below `cellType: 'link'` Example, and process the link type data by setting the jump address and detecting the legitimacy of the link:

```javascript
{
  cellType: 'link',
  field: 'homepage',
  title: '主页',
  linkJump: true,
  linkDetect: true,
}
```

In this example:

*   `linkJump: true` Indicates that the link can be clicked to jump.
*   `linkDetect: true` Indicates that the link is to be regularized, and if the link conforms to the link rules, it will be displayed as a link.
    In addition, the hyperlinke form can also support template links, such as setting templateLink:

```javascript
{
  templateLink:https://www.google.com.hk/search?q={name}', //name是数据源属性字段名。
}
```

Through the above settings, we can customize the column of type "link" to meet the needs of data display.

## Image

When the column type is "image", it is used to display the data of the picture type. The "image" type has certain flexibility, and the data can be processed by setting different image display methods and customizing styles such as maintaining the aspect ratio, maintaining the original size of the picture, etc.

Show one below `cellType: 'image'` For example, we process the data of the picture type by setting the properties of maintaining the aspect ratio and the picture automatically stretching the cell size:

```javascript
{
  cellType: 'image',
  field: 'avatar',
  title: '头像',
  keepAspectRatio: true,
  imageAutoSizing: true,
}
```

In this example:

*   `keepAspectRatio: true` Indicates that you want to keep the aspect ratio of the picture displayed.
*   `imageAutoSizing: true` Indicates that you want to automatically expand the size of the cell according to the size of the picture.

Through the above settings, we can customize the columns of the "image" type to meet the needs of data display.


## Video

When the column type is "video", it is used to display the data of the video type. All configuration items of "video" are the same as image, you can refer to the image type configuration item.

## progressbar

When the column type is "progressbar", it is used to display the data of the progress bar type. The progress bar data can be processed by setting the type of the progress bar, the data range of the progress bar, etc.

Show one below `cellType: 'progressbar'` Example of:

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

In this example:

*   `min: 0` Represents the minimum data for the progress bar display range.
*   `max: 100` Represents the maximum data for the scope of the progress bar display.
*   `barType: 'default'` represent**Progress Bar Type**Is the default type.


## Sparkline

When the column type is "sparkline", it is used to display the data of the miniature type. The "sparkline" type has high flexibility, and the data of the miniature can be processed by setting the specific spec configuration item of the miniature.

Show one below `cellType: 'sparkline'` Example of:

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

In this example:

*   `sparklineSpec` The type of miniature and specific configuration items are set.


## Chart

When the column type is "chart", it is used to display the data of the chart type. Before using this type, you need to register a chart type through VTable.chart.register. For details, please refer to the tutorial.[Vchart registration](../../guide/cell_type/chart)Example of use after registration:

Show one below `cellType: 'chart'` Example of:

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

In this example:

*   `chartModule: 'vchart'` Use the chart library component built into VTable, registered under the name vchart
*   `chartSpec` The chart type and specific configuration items are set, and the specific configuration items need to be referred to.[VChart](https://visactor.io/vchart).

## Composite cellType

In some demand scenarios, it may be expected to display different data types in different data situations or in different rows and columns. The above cellType writing method clearly specifies what type a column must be (the transposed table specifies what type a row must be). We Supports cellType function customization, and can specify different types according to demand logic:

The following shows an example of `cellType: ()=>{}`: (Please refer to [Example](https://visactor.io/vtable/demo/cell-type/composite-cellType))
 
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
      if(record.name===='Magpie')
        return 'Magpie's access address:'+record.image;
      return record.image;
    },
    width:'auto',
    keepAspectRatio:true,
  }
```
