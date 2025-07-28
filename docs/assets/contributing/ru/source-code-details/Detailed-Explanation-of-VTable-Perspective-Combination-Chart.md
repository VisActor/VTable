---
title: Detailed Explanation of VTable Perspective Combination Chart    

key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
This article will interpret the source code of the VTable perspective, helping developers better understand its internal implementation mechanism.

## Definition of Perspective Combination Chart


A PivotChart is an advanced table type in VTable that allows users to analyze and visualize data in a multidimensional way. It arranges and combines the same type of charts according to certain rules to form a large chart, with each small chart presenting a portion of the data. This type of chart is usually used to group large amounts of data for better observation and comparison of relationships between different data.    \r

### Features


*  **Multidimensional Display**: The pivot combination chart can simultaneously present multiple data dimensions, allowing users to gain a more comprehensive understanding of the relationships between the data.    

*  **Flexible Layout**: Different dimensions can be placed in different positions to observe different data results.    \r

*  **Data Grouping**: It is often used to group data according to certain rules, with each subplot displaying the data of a group, making it easier for users to understand and analyze.    



<div style="display: flex;"><div style="flex: 47; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/SDnZbUwpIo967sxRiRRcHGgenmc.gif' alt='' width='1000' height='auto'>
</div><div style="flex: 52; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/IRayb0VSyoZrUixATv5chmNCnjb.gif' alt='' width='1000' height='auto'>
</div></div>
### Application Scenarios


*  **Visualization of Big Data Sets**: Pivot combination charts can be used to visualize big data sets by displaying grouped data, helping users better understand the relationships between data.    \r

*  **Visualization of Multidimensional Data**: It can be used to display multidimensional data by grouping the data according to different attributes and presenting it in the form of charts, allowing users to observe multiple dimensions of data simultaneously.    \r

*  **Data Comparison and Analysis**: Pivot combination charts can be used to compare and analyze data. By displaying grouped data, users can more easily compare differences and relationships between different data.    \r

*  **Data Reporting and Presentation**: Using pivot combination charts in data reports can make the reports easier to understand and present.    



### Comparison Pivot Table


![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/YCKcwu5clhcH0gbaXz4cZxP6nfe.gif)

**Compared to pivot tables, where each cell displays an aggregated value of a certain metric under a dimension set group, pivot charts present the original data corresponding to this aggregated group in a separate chart.**    \r



**Reuse Pivot Table Logic:**    

1. Data Organization: The main logic is consistent with PivotTable, with additional logic for analysis axis range. File path: packages/vtable/src/dataset/dataset.ts;    \r

1. Layout Logic: The dimension values of the table header are mapped to the cell logic, file path: packages/vtable/src/layout/pivot-header-layout.ts;    \r

These contents are specifically introduced in the source code interpretation document of the pivot table, and will not be repeated here.    

## Core Logic


### Register chart module


1. First, register the chart module through VTable.register.chartModule():    \r

```plaintext
VTable.register.chartModule('vchart', VChart);    

```
1. The module will be stored in the chartTypePlugins object during registration:

```Typescript
export function **chartModule**(*name*: string, *chartModule*?: any): any {
  if (*chartModule* !== null && *chartModule* !== undefined) {
    return register(chartTypePlugins, *name*, *chartModule*);
  }
  return chartTypePlugins[*name*];
}    

```
1. In the table configuration, reference the registered module through the chartModule attribute:    

```Typescript
{
  cellType: 'chart',          // 指定单元格类型为chart
  chartModule: 'vchart',      // 使用注册的vchart模块
  chartSpec: {                // chart的具体配置
    type: 'bar',             // 图表类型
    stack: true,             // 是否堆叠
    data: {
      id: 'data'
    },
    xField: [...],           // x轴字段
    yField: '...',          // y轴字段
    // 其他图表配置...
  }
}    

```
1. VTable will use the corresponding chart module to render the chart according to the configuration    

This registration mechanism mainly has the following characteristics:    \r

* Support dynamic registration and retrieval of chart module    

* Multiple different chart modules can be registered (but currently there is no compatibility handling for other chart libraries.)    

* Achieve chart functionality extensibility through modular design    

* Supports complex chart configuration options    



### Declare Primitive Node Chart


Chart primitives inherit from Group, and are composite primitives mainly used for rendering charts in table cells.    \r

```Typescript
export class Chart extends Group {
  type: GraphicType = 'chart' as any;
  declare attribute: IChartGraphicAttribute;
  chartInstance: any;         // 主图表实例
  activeChartInstance: any;   // 激活状态的图表实例
  active: boolean;            // 是否处于激活状态
  cacheCanvas: HTMLCanvasElement | { x: number; y: number; width: number; height: number; canvas: HTMLCanvasElement }[]; 
  isShareChartSpec: boolean;  // 是否共享图表配置
}    

```
Important Attributes:    

1. type and attribute: Indicates the type of element and element configuration, all elements have this attribute;    \r

1. chartInstance: The chart object instantiated using the registered chart module vchart;    \r

1. activeChartInstance: If the cell is activated, an activeChartInstance will be created on the chart element to respond to the interactions of the chart itself;    \r

1. cacheCanvas: Cache the rendered image of the chart for use in the next render to improve rendering performance;    \r

### Create chart process


<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/R7i4blZbuoztoPx1psHcuEi3nfe.gif' alt='' width='588' height='auto'>



When creating a chart element, the entry point is `createCell`, where it determines the type of cell to be created. If it is a chart type, it further decides to use the chart element and calls the function `**createChartCellGroup**`**.**    

**One parameter that needs special attention when calling this function is** `***chartInstance***`, because the vtable uses a mechanism where the same chart instance is shared for performance reasons. Therefore, you can obtain the chart instance already created on the metric object based on the cell by calling the interface ***`***getChartInstance***`***.***

```Typescript
if (*type* === 'chart') {
    const chartInstance = *table*.internalProps.layoutMap.getChartInstance(*col*, *row*);
    const **createChartCellGroup** = Factory.getFunction('createChartCellGroup') as CreateChartCellGroup;
    cellGroup = createChartCellGroup(
      null,
      *columnGroup*,
      0,
      *y*,
      *col*,
      *row*,
      *cellWidth*,
      *cellHeight*,
      *padding*,
      *value*,
      (*define* as ChartColumnDefine).chartModule,
      *table*.internalProps.layoutMap.getChartSpec(*col*, *row*),
      chartInstance,
      *table*.internalProps.layoutMap.getChartDataId(*col*, *row*) ?? 'data',
      *table*,
      *cellTheme*,
      *table*.internalProps.layoutMap.isShareChartSpec(*col*, *row*),
      isAsync,
      *table*.internalProps.layoutMap.isNoChartDataRenderNothing(*col*, *row*)
    );    

```
If an instance has not been created initially, create it in the chart element and later store it in the indicator information through the setChartInstance interface.    

`*table*``.internalProps.layoutMap.setChartInstance(``*col*``, ``*row*``, chartGroup.chartInstance);`    

### Draw chart


The process of creating a chart mentioned above, when a new chart is created, you can see that apart from configuring the spec, no data is passed. Data is passed during the actual rendering. Specific file path: packages/vtable/src/scenegraph/graphic/contributions/chart-render.ts    \r

```Typescript
function drawShape(chart, context, x, y) {
  // 获取图表基础属性
  const { active, cacheCanvas, activeChartInstance } = chart;
  const { dataId, data, spec } = chart.attribute;
  
  // 1. 非激活且有缓存时,直接绘制缓存
  if (!active && cacheCanvas) {
    drawCacheCanvas(context, cacheCanvas, x, y);
    return;
  }
  
  // 2. 有激活实例时,更新并渲染激活态图表
  if (activeChartInstance) {
    // 更新视口
    updateChartViewBox(activeChartInstance, chart);
    
    // 更新变换矩阵
    updateChartTransform(activeChartInstance, chart);
    
    // 更新数据
    if (typeof dataId === 'string') {
      activeChartInstance.updateDataSync(dataId, data);
    } else {
      updateSeriesData(activeChartInstance, dataId, data, spec);
    }
    return;
  }

  // 3. 无实例时,创建新图表
  if (table.internalProps.renderChartAsync) {
    // 异步渲染队列
    addToRenderQueue(chart);
    startRenderQueueIfNeeded(table);
  } else {
    // 同步渲染
    renderChart(chart);
  }
}    

```
#### Drawing Process


The core drawing logic is in renderChart, the main logic of renderChart:    \r

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/ISQ9b06dYoumW2xYmi6cWXKLnTd.gif' alt='' width='578' height='auto'>

The cell chart will cache the chart image after the first drawing for subsequent use.    

#### Asynchronous Rendering


In order to further improve the rendering performance of the first screen, there is an asynchronous rendering configuration `renderChartAsync`. If it is enabled, the chart drawing process of the cells to be rendered will be inserted into the rendering queue. This is particularly suitable for situations where there are a large number of charts displayed on the first screen.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/S3eobYCiIoXWJhxRZQlcbVLln9b.gif' alt='' width='1000' height='auto'>



### Primitive Chart Activation


As mentioned in the drawing process, the chart drawn in the cell is a cached image, which loses the ability to interact with the chart. To solve this problem, vtable uses the hover state to recreate the chart of the hovered cell and give it interactive capabilities.

```Typescript
 this.activeChartInstance = new this.attribute.ClassType(
      this.attribute.spec,
      merge({}, this.attribute.tableChartOption, {
        *// disableDirtyBounds: true,*
        renderCanvas: this.attribute.canvas,
        mode: 'desktop-browser',
        canvasControled: false,
        viewBox: {
          x1: 0,
          x2: x2 - x1,
          y1: 0,
          y2: y2 - y1
        },
        dpr: *table*.internalProps.pixelRatio,
        animation: false,
        interactive: true,
        autoFit: false, *//控制当容器变化大小时vchart实例不应响应事件进行内部处理*
        **beforeRender**: (*chartStage*: Stage) => {
          const stage = this.stage;
          const ctx = *chartStage*.window.getContext();
          const stageMatrix = stage.window.getViewBoxTransform();
          const viewBox = stage.window.getViewBox();
          ctx.inuse = true;
          *// ctx.save();*
          *// console.log(ctx.getImageData(0, 0, 100, 100));*
          ctx.clearMatrix();
          ctx.setTransform(
            stageMatrix.a,
            stageMatrix.b,
            stageMatrix.c,
            stageMatrix.d,
            stageMatrix.e,
            stageMatrix.f,
            true
          );
          ctx.translate(viewBox.x1, viewBox.y1);
          ctx.setTransformForCurrent(true); *// 替代原有的chart viewBox*
          ctx.beginPath();
          ctx.rect(clipBound.x1, clipBound.y1, clipBound.x2 - clipBound.x1, clipBound.y2 - clipBound.y1);
          ctx.clip();
          ctx.clearMatrix();

          if (*table*.options.canvas && !(*chartStage* as any).needRender) {
            *// 在使用viewbox局部渲染时，activate单独渲染chart stage，可能导致外部stage场景层级错乱*
            *// 此时触发整个表格的重绘，外部stage场景可以通过table的beforeRender配置触发更上一级的重绘*
            *chartStage*.pauseRender();
            *table*.scenegraph.stage.dirtyBounds.union(this.globalAABBBounds);
            *table*.scenegraph.updateNextFrame();
          }
        },
        **afterRender**(*stage*: any) {
          const ctx = *stage*.window.getContext();
          ctx.inuse = false;

          *stage*.needRender = false;
          chartStage.resumeRender();
        }
      })
    );    

```
The configuration of `activeChartInstance` does seem a bit more complex compared to the configuration of `chartInstance`. First, interactive is set to true, and beforeRender and afterRender hook functions are added to control the specific rendering area on the canvas.

### Axis Creation


In a perspective view, besides the chart part in the cell, another important component is the axis. Unlike the axis of a simple single chart that belongs to one chart, the axis in a perspective view is responsible for the axis range capability of the entire row or column of charts.    \r

In the logic of creatCell, when there is a configuration related to the perspective chart axis, the Axis component will be created and appended to the cellGroup.

```Typescript
    const axisConfig = *table*.internalProps.layoutMap.getAxisConfigInPivotChart(*col*, *row*);
    if (axisConfig) {
      const CartesianAxis: ICartesianAxis = Factory.getComponent('axis');
      const axis = new CartesianAxis(
        axisConfig,
        cellGroup.attribute.width,
        cellGroup.attribute.height,
        axisConfig.__vtablePadding ?? *padding*,
        *table*
      );
      cellGroup.clear();
      cellGroup.appendChild(axis.component);
      axis.overlap();
    }     

```
The specific axis logic is in the file packages/vtable/src/components/axis/axis.ts    \r

The CartesianAxis class mainly includes:    

* Creation and initialization of the axis    

*  Scale calculation and layout    

* Axis scaling and positioning    

* Tag overlap handling    

```Typescript
class CartesianAxis {
  *// 属性*
  width: number;                 *// 轴宽度*
  height: number;               *// 轴高度*
  orient: IOrientType;         *// 轴方向(left/right/top/bottom)*
  type: 'linear' | 'band' | 'point' | 'time' | 'log' | 'symlog'; *// 轴类型*
  scale: BandAxisScale | LinearAxisScale;  *// 比例尺*
  component: LineAxis;         *// 轴组件*
  
  *// 核心方法*
  initScale()                  *// 初始化比例尺*
  initData()                   *// 初始化数据*
  computeData()               *// 计算轴数据*
  createComponent()           *// 创建轴组件*
  resize()                    *// 调整大小*
}    

```
Initialization process: This implementation provides full axis support for charts in the table, which is an important foundational component for chart rendering.    

<div style="display: flex;"><div style="flex: 32; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/VatNbnwyAoCuWxxQn8Pcvb1Snsf.gif' alt='' width='444' height='auto'>
</div><div style="flex: 67; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/OEM6bg6B8oz6tSxPIpdcJ508n3g.gif' alt='' width='846' height='auto'>
</div></div>


### Legend Interaction Linking


VTable also provides a legend component, which can be used to control the display data of the chart by manipulating the legend:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/P8wcbL1KmowzFqxnMCIcCjMvngf.gif' alt='' width='1000' height='auto'>

Here is a summary of the creation process. It is important to note that adding a legend will occupy the position of the table, so it is necessary to reset the position of the tableGroup in the scene tree:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/JxlabSk0eoRQ6ExCj7acUCAZnPe.gif' alt='' width='712' height='auto'>



Legend click to control the data display logic of the chart:    

This logic is not directly integrated into the Vtable code, and users need to call the relevant interfaces themselves, as follows:    \r

```Typescript
`  tableInstance.on(LEGEND_ITEM_CLICK, *args* => {
    console.log('LEGEND_ITEM_CLICK', *args*);
    tableInstance.updateFilterRules([
      {
        filterKey: '20001',
        filteredValues: *args*.value
      }
    ]);
  });    

```
The logic of updateFilterRules is:    

```Typescript
  */** 更新数据过滤规则，适用场景：点击图例项后 更新过滤规则 来更新图表 */*
  **updateFilterRules**(*filterRules*: FilterRules) {
    this.internalProps.dataConfig.filterRules = *filterRules*;
    this.dataset.updateFilterRules(*filterRules*);
    clearChartCacheImage(this.scenegraph);
    updateChartData(this.scenegraph);
    this.render();
  }    

```
In addition to updating data through the dataset, all chart caches were cleared and re-rendered.    \r

## **Conclusion:**

The VTable pivot table implements rich data analysis functions, providing users with powerful data visualization tools through flexible configuration and efficient data processing mechanisms. Its core lies in the close integration of data processing, layout system, and interactive functions, making complex data analysis simple and intuitive.

# This document was revised and organized by the following personnel 
 [玄魂](https://github.com/xuanhun)