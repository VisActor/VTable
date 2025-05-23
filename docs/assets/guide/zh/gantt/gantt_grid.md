# 甘特图网格

网格线主要指甘特图左侧信息表格的网格线，以及右侧甘特图日期表头和任务条的网格线。以及整体外边框线。

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-structure.png)




## 任务信息表网格线

甘特图中，左侧信息表格的网格线是VTable组件所渲染和组织的，可以通过`taskListTable`配置项来控制网格线的显示。

左侧信息表格的具体配置可以参考VTable的配置项，请参考教程[theme](https://www.visactor.com/vtable/guide/theme_and_style/theme)或者[style](https://www.visactor.com/vtable/guide/theme_and_style/style)。

如想要去掉表格的纵向分割线，可以配置`theme`:
```
{
  "taskListTable": {
    "theme": {
      "bodyStyle": {
        "borderLineWidth":[1,0]
      }
    }
  }
}

```
## 日期表格网格线

日期表格的相关配置都在timelineHeader中，其中`verticalLine`配置项可以控制日期表格的纵向分割线，`horizontalLine`配置项可以控制日期表格的水平分割线。

```
{
  "timelineHeader": {
    "verticalLine": {
      "lineColor": "red",
      "lineWidth": 1
    },
    "horizontalLine": {
      "lineColor": "red",
      "lineWidth": 1
    }
  }
}
```

## 任务条网格线

甘特图任务条的网格线，可以通过`grid`配置项来控制任务条的网格线。具体配置：
```
export interface IGrid {
  backgroundColor?: string;
  /** 需要按数据行设置不同背景色 */
  horizontalBackgroundColor?: string[] | ((args: GridHorizontalLineStyleArgumentType) => string);
  /** 需要按日期列设置不同背景色 */
  verticalBackgroundColor?: string[] | ((args: GridVerticalLineStyleArgumentType) => string);
  /** 周末背景色 */
  weekendBackgroundColor?: string;
  /** 垂直间隔线样式 */
  verticalLine?: ILineStyle | ((args: GridVerticalLineStyleArgumentType) => ILineStyle);
  /** 水平间隔线样式 */
  horizontalLine?: ILineStyle | ((args: GridHorizontalLineStyleArgumentType) => ILineStyle);
  /** 竖线依赖的日期刻度。默认为timelineHeader中scales中的最小时间粒度 */
  verticalLineDependenceOnTimeScale?: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second';
}
```

可以看出，`grid`配置项可以控制任务条的网格线，包括背景色、水平分割线、垂直分割线、周末背景色、竖线依赖的具体日期刻度scale。

其中背景色和分割线都可以配置为数组，来按行或者按列设置不同的背景色。也可以配置为函数，来根据具体的数据行或者日期列来设置不同的背景色。

如：
```
{
  "grid": {
    "verticalBackgroundColor": ["#f00", "#0f0"],
    "horizontalBackgroundColor": ["#00f", "#0f0"],
    "verticalBackgroundColor": (args) => {
      return args.columnIndex % 2 === 0 ? "#f00" : "#0f0";
    }
  }
}
```



## 甘特图外边框线

甘特图外边框线，可以通过`frame.outerFrameStyle`配置项来控制甘特图的外边框线。具体配置：
```
{
  "frame": {
    "outerFrameStyle": {
      "lineColor": "red",
      "lineWidth": 1
    }
  }
}
```

## 甘特图整体分割线
左侧信息表格和右侧任务条的分割线，可以通过`frame.verticalSplitLine`配置项来控制。

表头和列表body部分的分割线，可以通过`frame.horizontalSplitLine`配置项来控制。

如：
```
{
  "frame": {
    "verticalSplitLine": {
      "lineColor": "red",
      "lineWidth": 1
    },
    "horizontalSplitLine": {
      "lineColor": "red",
      "lineWidth": 1
    }
  }
}
```
