---
title: VTable 透视组合图详解    

key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
本文将对 VTable 透视图的源码进行解读，帮助开发者更好地理解其内部实现机制。    

##  透视组合图概念定义

透视图（PivotChart）是 VTable 中的一种高级表格类型，它允许用户以多维度的方式分析和可视化数据。它将相同类型的图表按照一定的规则进行排列组合，形成一个大的图表，每个小图表呈现一部分数据。这种图表通常用于将大量数据分组展示，以便更好地观察和比较不同数据之间的关系。    

### 特点

*  **多维度展示**：透视组合图可以同时呈现多个数据维度，使得用户可以更全面地了解数据之间的关系。    

*  **灵活布局**：可以将不同维度放到不同位置，观察不一样的数据结果。    

*  **数据分组**：它常用于将数据按照一定的规则进行分组，每个子图表展示一个分组的数据，从而便于用户理解和分析。    



<div style="display: flex;"><div style="flex: 47; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/SDnZbUwpIo967sxRiRRcHGgenmc.gif' alt='' width='1000' height='auto'>
</div><div style="flex: 52; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/IRayb0VSyoZrUixATv5chmNCnjb.gif' alt='' width='1000' height='auto'>
</div></div>
### 应用场景

*  **大数据集合的可视化**：透视组合图可以用来可视化大数据集合，通过将数据分组展示，帮助用户更好地理解数据之间的关系。    

*  **多维数据的可视化**：它可以用来展示多维数据，通过将数据按照不同属性分组，并以图表形式呈现，用户可以同时观察多个维度的数据。    

*  **数据比较和分析**：透视组合图可以用来比较和分析数据，通过分组展示，用户可以更方便地比较不同数据之间的差异和关系。    

*  **数据报告和展示**：在数据报告中使用透视组合图，可以使报告更加易于理解和呈现。    



### 对比透视表

![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/YCKcwu5clhcH0gbaXz4cZxP6nfe.gif)

**相比于透视表而言，透视表每个单元格展示的是一个维度集分组下某个指标的聚合值，而透视图则把这个聚合组所对应的原始数据用一个单独的图表展示出来。**    



**复用透视表逻辑：**    

1. 数据组织：主要逻辑都是和透视表PivotTable一致，有附加分析轴范围的逻辑，文件路径：packages/vtable/src/dataset/dataset.ts；    

1. 布局逻辑：表头的维度值映射到单元格逻辑，文件路径：packages/vtable/src/layout/pivot-header-layout.ts；    

这些内容在透视表的源码解读文档中都有具体介绍，这里不再赘述。    

## 核心逻辑

### 注册chart模块

1. 首先通过VTable.register.chartModule()注册图表模块：    

```plaintext
VTable.register.chartModule('vchart', VChart);    

```
1. 注册时会将模块存储在chartTypePlugins对象中：    

```Typescript
export function **chartModule**(*name*: string, *chartModule*?: any): any {
  if (*chartModule* !== null && *chartModule* !== undefined) {
    return register(chartTypePlugins, *name*, *chartModule*);
  }
  return chartTypePlugins[*name*];
}    

```
1. 在表格配置中通过chartModule属性引用已注册的模块：    

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
1. VTable会根据配置使用对应的chart module来渲染图表    

这种注册机制主要有以下特点：    

*  支持动态注册和获取chart module    

*  可以注册多个不同的图表模块（但是目前没有做其他图表库的兼容处理。）    

*  通过模块化设计实现图表功能的可扩展性    

*  支持复杂的图表配置选项    



### 声明图元节点chart

Chart图元继承自Group,是一个复合图元,主要用于在表格单元格中渲染图表。    

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
重要属性：    

1. type和attribute：标注是哪种图元类型和图元配置，所有图元都有该属性；    

1. chartInstance：使用注册的图表模块vchart实例化后的图表对象；    

1. activeChartInstance：如果单元格被激活，那么会在chart图元上创建activeChartInstance，来响应图表chart本身的交互响应；    

1. cacheCanvas：缓存chart渲染后的图片，供下次render来使用以提高渲染性能；    

### 创建chart流程

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/R7i4blZbuoztoPx1psHcuEi3nfe.gif' alt='' width='588' height='auto'>



创建chart图元时，入口是`createCell`，其中会判断需要创建的单元格类型，如果是chart类型进而确定使用chart图元，进入调用函数`**createChartCellGroup**`**。**    

**调用这个函数的参数需要特别注意的一个是**`***chartInstance***`***，因为vtable为了性能的考虑是同一个指标公用chart实例的机制，所以可以根据单元格来获取到指标对象上已创建的chart实例，调用接口***`***getChartInstance***`***。***    

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
如果一开始没有创建过实例，在chart图元中进行创建，并在后面通过接口setChartInstance来存储到指标indicator信息中。    

`*table*``.internalProps.layoutMap.setChartInstance(``*col*``, ``*row*``, chartGroup.chartInstance);`    

### 绘制chart

上面提到创建chart的流程，当new出来一个chart的时候，可以看到除了配置了spec并没有传递数据，传递数据是具体绘制的时候，具体文件路径：packages/vtable/src/scenegraph/graphic/contributions/chart-render.ts    

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
#### 绘制流程

核心绘制逻辑在renderChart中，renderChart的主要逻辑：    

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/ISQ9b06dYoumW2xYmi6cWXKLnTd.gif' alt='' width='578' height='auto'>

单元格图表绘制完第一次会缓存图表的图片，供后续绘制使用。    

#### 异步渲染

为了进一步提高首屏的渲染性能，还有个异步渲染的配置`renderChartAsync`，如果将其打开会将要渲染的单元格chart绘制过程插入到渲染队列中，这个特别适用于首屏展示的图表数量较多的情况。    

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/S3eobYCiIoXWJhxRZQlcbVLln9b.gif' alt='' width='1000' height='auto'>



### 图元chart激活

绘制流程中提到，绘制到单元格中的图表是一张缓存的图片，这样就失去了在图表上交互的能力，为了解决这个问题，vtable利用hover状态，将hover单元格的图表重新创建并赋予交互能力；    

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
这个`activeChartInstance`的配置相比`chartInstance`的配置，看起来确实有些复杂，首先设置了interactive为true，同时增加了beforeRender和afterRender的勾子函数，来控制在canvas上的具体渲染区域。    

### 坐标轴创建

透视图中除了单元格中的图表部分，还有个重要的组件就是坐标轴，不同于简单单个图表的坐标轴归属于一个图表，透视图中的坐标轴负责整行或者整列的图表的轴范围能力。    

在creatCell的逻辑中，判断有透视图表坐标轴相关配置时，会创建Axis组件，并将其append到cellGroup中    

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
具体的坐标轴逻辑在文件packages/vtable/src/components/axis/axis.ts    

CartesianAxis类中主要包含：    

*  坐标轴的创建和初始化    

*  刻度计算和布局    

*  坐标轴缩放和定位    

*  标签重叠处理    

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
初始化流程：这个实现为表格中的图表提供了完整的坐标轴支持，是图表渲染的重要基础组件。    

<div style="display: flex;"><div style="flex: 32; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/VatNbnwyAoCuWxxQn8Pcvb1Snsf.gif' alt='' width='444' height='auto'>
</div><div style="flex: 67; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/OEM6bg6B8oz6tSxPIpdcJ508n3g.gif' alt='' width='846' height='auto'>
</div></div>


### 图例交互联动

VTable同时也提供了图例组件，可以通过操作图例来控制图表的展示数据：    

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/P8wcbL1KmowzFqxnMCIcCjMvngf.gif' alt='' width='1000' height='auto'>

这里梳理下创建的流程，需要注意的是legend的添加会占用表格的位置，所以需要重新设置表格场景树tableGroup的位置：    

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/JxlabSk0eoRQ6ExCj7acUCAZnPe.gif' alt='' width='712' height='auto'>



图例点击来控制图表展示数据逻辑：    

这个逻辑并没有直接融合在Vtable代码中，需要用户自行调用相关的接口，使用如下：    

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
updateFilterRules的逻辑为：    

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
重点除了通过dataset更新数据外，还清理了所有的图表缓存，并重新进行渲染。    

## **结语：**

VTable 的透视表实现了丰富的数据分析功能，通过灵活的配置和高效的数据处理机制，为用户提供了强大的数据可视化工具。其核心在于数据处理、布局系统和交互功能的紧密结合，使得复杂的数据分析变得简单直观。    

 # 本文档由以下人员修正整理 
 [玄魂](https://github.com/xuanhun)