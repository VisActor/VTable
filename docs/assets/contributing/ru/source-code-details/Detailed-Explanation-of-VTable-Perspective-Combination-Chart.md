---
заголовок: Detailed Explanation из Vтаблица Perspective Combination график    

key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
This article will interpret the source код из the Vтаблица perspective, helping developers better understand its internal implementation mechanism.

## Definition из Perspective Combination график


A сводныйграфик is an advanced таблица тип в Vтаблица that allows users к analyze и visualize данные в a multidimensional way. It arranges и combines the same тип из графикs according к certain rules к form a large график, с каждый small график presenting a portion из the данные. This тип из график is usually used к group large amounts из данные для better observation и comparison из relationships between different данные.    \r

### возможности


*  **Multidimensional Display**: The сводный combination график can simultaneously present multiple данные dimensions, allowing users к gain a more comprehensive understanding из the relationships between the данные.    

*  **Flexible макет**: Different dimensions can be placed в different positions к observe different данные results.    \r

*  **данные Grouping**: It is often used к group данные according к certain rules, с каждый subplot displaying the данные из a group, making it easier для users к understand и analyze.    



<div style="display: flex;"><div style="flex: 47; отступ:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/SDnZbUwpIo967sxRiRRcHGgenmc.gif' alt='' ширина='1000' высота='авто'>
</div><div style="flex: 52; отступ:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/IRayb0VSyoZrUixATv5chmNCnjb.gif' alt='' ширина='1000' высота='авто'>
</div></div>
### Application Scenarios


*  **Visualization из Big данные Sets**: сводный combination графикs can be used к visualize big данные sets по displaying grouped данные, helping users better understand the relationships between данные.    \r

*  **Visualization из Multidimensional данные**: It can be used к display multidimensional данные по grouping the данные according к different attributes и presenting it в the form из графикs, allowing users к observe multiple dimensions из данные simultaneously.    \r

*  **данные Comparison и Analysis**: сводный combination графикs can be used к compare и analyze данные. по displaying grouped данные, users can more easily compare differences и relationships between different данные.    \r

*  **данные Reporting и Presentation**: Using сводный combination графикs в данные reports can make the reports easier к understand и present.    



### Comparison сводный таблица


![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/YCKcwu5clhcH0gbaXz4cZxP6nfe.gif)

**Compared к сводный таблицаs, where каждый cell displays an aggregated значение из a certain metric under a dimension set group, сводный графикs present the original данные corresponding к this aggregated group в a separate график.**    \r



**Reuse сводный таблица Logic:**    

1. данные Organization: The main logic is consistent с сводныйтаблица, с additional logic для analysis axis range. File path: packвозрастs/vтаблица/src/данныеset/данныеset.ts;    \r

1. макет Logic: The dimension values из the таблица header are mapped к the cell logic, file path: packвозрастs/vтаблица/src/макет/сводный-header-макет.ts;    \r

These contents are specifically introduced в the source код interpretation document из the сводный таблица, и will не be repeated here.    

## Core Logic


### регистрация график module


1. первый, регистрация the график module through Vтаблица.регистрация.графикModule():    \r

```plaintext
Vтаблица.регистрация.графикModule('vграфик', Vграфик);    

```
1. The module will be stored в the графикTypePlugins объект during registration:

```Typescript
export функция **графикModule**(*имя*: строка, *графикModule*?: любой): любой {
  if (*графикModule* !== null && *графикModule* !== undefined) {
    возврат регистрация(графикTypePlugins, *имя*, *графикModule*);
  }
  возврат графикTypePlugins[*имя*];
}    

```
1. в the таблица configuration, reference the регистрацияed module through the графикModule attribute:    

```Typescript
{
  cellType: 'график',          // 指定单元格类型为график
  графикModule: 'vграфик',      // 使用注册的vграфик模块
  графикSpec: {                // график的具体配置
    тип: 'bar',             // 图表类型
    stack: true,             // 是否堆叠
    данные: {
      id: 'данные'
    },
    xполе: [...],           // x轴字段
    yполе: '...',          // y轴字段
    // 其他图表配置...
  }
}    

```
1. Vтаблица will use the corresponding график module к render the график according к the configuration    

This registration mechanism mainly has Следующий characteristics:    \r

* Support dynamic registration и retrieval из график module    

* Multiple different график modules can be регистрацияed (but currently there is no compatibility handling для other график libraries.)    

* Achieve график функциональность extensibility through modular design    

* Supports complex график configuration options    



### Declare Primitive Node график


график primitives inherit от Group, и are composite primitives mainly used для rendering графикs в таблица cells.    \r

```Typescript
export class график extends Group {
  тип: GraphicType = 'график' as любой;
  declare attribute: IграфикGraphicAttribute;
  графикInstance: любой;         // 主图表实例
  activeграфикInstance: любой;   // 激活状态的图表实例
  активный: логический;            // 是否处于激活状态
  cacheCanvas: HTMLCanvasElement | { x: число; y: число; ширина: число; высота: число; canvas: HTMLCanvasElement }[]; 
  isShareграфикSpec: логический;  // 是否共享图表配置
}    

```
Important Attributes:    

1. тип и attribute: Indicates the тип из element и element configuration, все elements have this attribute;    \r

1. графикInstance: The график объект instantiated using the регистрацияed график module vграфик;    \r

1. activeграфикInstance: If the cell is activated, an activeграфикInstance will be created на the график element к respond к the interactions из the график itself;    \r

1. cacheCanvas: Cache the rendered imвозраст из the график для use в the следующий render к improve rendering Производительность;    \r

### Create график process


<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/R7i4blZbuoztoPx1psHcuEi3nfe.gif' alt='' ширина='588' высота='авто'>



When creating a график element, the entry point is `createCell`, where it determines the тип из cell к be created. If it is a график тип, it further decides к use the график element и calls the функция `**createграфикCellGroup**`**.**    

**One параметр that needs special attention when calling this функция is** `***графикInstance***`, because the vтаблица uses a mechanism where the same график instance is shared для Производительность reasons. Therefore, Вы можете obtain the график instance already created на the metric объект based на the cell по calling the интерфейс ***`***getграфикInstance***`***.***

```Typescript
if (*тип* === 'график') {
    const графикInstance = *таблица*.internalProps.макетMap.getграфикInstance(*col*, *row*);
    const **createграфикCellGroup** = Factory.getFunction('createграфикCellGroup') as CreateграфикCellGroup;
    cellGroup = createграфикCellGroup(
      null,
      *columnGroup*,
      0,
      *y*,
      *col*,
      *row*,
      *cellширина*,
      *cellвысота*,
      *заполнение*,
      *значение*,
      (*define* as графикColumnDefine).графикModule,
      *таблица*.internalProps.макетMap.getграфикSpec(*col*, *row*),
      графикInstance,
      *таблица*.internalProps.макетMap.getграфикданныеId(*col*, *row*) ?? 'данные',
      *таблица*,
      *cellтема*,
      *таблица*.internalProps.макетMap.isShareграфикSpec(*col*, *row*),
      isAsync,
      *таблица*.internalProps.макетMap.isNoграфикданныеRenderNothing(*col*, *row*)
    );    

```
If an instance has не been created initially, create it в the график element и later store it в the indicator information through the setграфикInstance интерфейс.    

`*таблица*``.internalProps.макетMap.setграфикInstance(``*col*``, ``*row*``, графикGroup.графикInstance);`    

### Draw график


The process из creating a график mentioned above, when a новый график is created, Вы можете see that apart от configuring the spec, no данные is passed. данные is passed during the actual rendering. Specific file path: packвозрастs/vтаблица/src/scenegraph/graphic/contributions/график-render.ts    \r

```Typescript
функция drawShape(график, context, x, y) {
  // 获取图表基础属性
  const { активный, cacheCanvas, activeграфикInstance } = график;
  const { данныеId, данные, spec } = график.attribute;
  
  // 1. 非激活且有缓存时,直接绘制缓存
  if (!активный && cacheCanvas) {
    drawCacheCanvas(context, cacheCanvas, x, y);
    возврат;
  }
  
  // 2. 有激活实例时,更新并渲染激活态图表
  if (activeграфикInstance) {
    // 更新视口
    updateграфикViewBox(activeграфикInstance, график);
    
    // 更新变换矩阵
    updateграфикTransform(activeграфикInstance, график);
    
    // 更新数据
    if (typeof данныеId === 'строка') {
      activeграфикInstance.updateданныеSync(данныеId, данные);
    } else {
      updateSeriesданные(activeграфикInstance, данныеId, данные, spec);
    }
    возврат;
  }

  // 3. 无实例时,创建新图表
  if (таблица.internalProps.renderграфикAsync) {
    // 异步渲染队列
    addToRenderQueue(график);
    startRenderQueueIfNeeded(таблица);
  } else {
    // 同步渲染
    renderграфик(график);
  }
}    

```
#### Drawing Process


The core drawing logic is в renderграфик, the main logic из renderграфик:    \r

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/ISQ9b06dYoumW2xYmi6cWXKLnTd.gif' alt='' ширина='578' высота='авто'>

The cell график will cache the график imвозраст after the первый drawing для subsequent use.    

#### Asynchronous Rendering


в order к further improve the rendering Производительность из the первый screen, there is an asynchronous rendering configuration `renderграфикAsync`. If it is включен, the график drawing process из the cells к be rendered will be inserted into the rendering queue. This is particularly suiтаблица для situations where there are a large число из графикs displayed на the первый screen.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/S3eobYCiIoXWJhxRZQlcbVLln9b.gif' alt='' ширина='1000' высота='авто'>



### Primitive график Activation


As mentioned в the drawing process, the график drawn в the cell is a cached imвозраст, which loses the ability к interact с the график. к solve this problem, vтаблица uses the навести state к recreate the график из the hovered cell и give it interactive capabilities.

```Typescript
 this.activeграфикInstance = новый this.attribute.ClassType(
      this.attribute.spec,
      merge({}, this.attribute.таблицаграфикOption, {
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
        dpr: *таблица*.internalProps.pixelRatio,
        animation: false,
        interactive: true,
        автоFit: false, *//控制当容器变化大小时vграфик实例不应响应事件进行内部处理*
        **beforeRender**: (*графикStвозраст*: Stвозраст) => {
          const stвозраст = this.stвозраст;
          const ctx = *графикStвозраст*.window.getContext();
          const stвозрастMatrix = stвозраст.window.getViewBoxTransform();
          const viewBox = stвозраст.window.getViewBox();
          ctx.inuse = true;
          *// ctx.save();*
          *// console.log(ctx.getImвозрастданные(0, 0, 100, 100));*
          ctx.clearMatrix();
          ctx.setTransform(
            stвозрастMatrix.a,
            stвозрастMatrix.b,
            stвозрастMatrix.c,
            stвозрастMatrix.d,
            stвозрастMatrix.e,
            stвозрастMatrix.f,
            true
          );
          ctx.translate(viewBox.x1, viewBox.y1);
          ctx.setTransformForCurrent(true); *// 替代原有的график viewBox*
          ctx.beginPath();
          ctx.rect(clipBound.x1, clipBound.y1, clipBound.x2 - clipBound.x1, clipBound.y2 - clipBound.y1);
          ctx.clip();
          ctx.clearMatrix();

          if (*таблица*.options.canvas && !(*графикStвозраст* as любой).needRender) {
            *// 在使用viewbox局部渲染时，activate单独渲染график stвозраст，可能导致外部stвозраст场景层级错乱*
            *// 此时触发整个表格的重绘，外部stвозраст场景可以通过таблица的beforeRender配置触发更上一级的重绘*
            *графикStвозраст*.pauseRender();
            *таблица*.scenegraph.stвозраст.dirtyBounds.union(this.globalAABBBounds);
            *таблица*.scenegraph.updateNextFrame();
          }
        },
        **afterRender**(*stвозраст*: любой) {
          const ctx = *stвозраст*.window.getContext();
          ctx.inuse = false;

          *stвозраст*.needRender = false;
          графикStвозраст.resumeRender();
        }
      })
    );    

```
The configuration из `activeграфикInstance` does seem a bit more complex compared к the configuration из `графикInstance`. первый, interactive is set к true, и beforeRender и afterRender hoхорошо functions are added к control the specific rendering area на the canvas.

### Axis Creation


в a perspective view, besides the график part в the cell, another important компонент is the axis. Unlike the axis из a simple single график that belongs к one график, the axis в a perspective view is responsible для the axis range capability из the entire row или column из графикs.    \r

в the logic из creatCell, when there is a configuration related к the perspective график axis, the Axis компонент will be created и appended к the cellGroup.

```Typescript
    const axisConfig = *таблица*.internalProps.макетMap.getAxisConfigInсводныйграфик(*col*, *row*);
    if (axisConfig) {
      const CartesianAxis: ICartesianAxis = Factory.getкомпонент('axis');
      const axis = новый CartesianAxis(
        axisConfig,
        cellGroup.attribute.ширина,
        cellGroup.attribute.высота,
        axisConfig.__vтаблицаPadding ?? *заполнение*,
        *таблица*
      );
      cellGroup.clear();
      cellGroup.appendChild(axis.компонент);
      axis.overlap();
    }     

```
The specific axis logic is в the file packвозрастs/vтаблица/src/компонентs/axis/axis.ts    \r

The CartesianAxis class mainly includes:    

* Creation и initialization из the axis    

*  Scale calculation и макет    

* Axis scaling и positioning    

* Tag overlap handling    

```Typescript
class CartesianAxis {
  *// 属性*
  ширина: число;                 *// 轴宽度*
  высота: число;               *// 轴高度*
  orient: IOrientType;         *// 轴方向(лево/право/верх/низ)*
  тип: 'linear' | 'band' | 'point' | 'time' | 'log' | 'symlog'; *// 轴类型*
  scale: BandAxisScale | LinearAxisScale;  *// 比例尺*
  компонент: LineAxis;         *// 轴组件*
  
  *// 核心方法*
  initScale()                  *// 初始化比例尺*
  initданные()                   *// 初始化数据*
  computeданные()               *// 计算轴数据*
  createкомпонент()           *// 创建轴组件*
  изменение размера()                    *// 调整大小*
}    

```
Initialization process: This implementation provides full axis support для графикs в the таблица, which is an important foundational компонент для график rendering.    

<div style="display: flex;"><div style="flex: 32; отступ:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/VatNbnwyAoCuWxxQn8Pcvb1Snsf.gif' alt='' ширина='444' высота='авто'>
</div><div style="flex: 67; отступ:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/OEM6bg6B8oz6tSxPIpdcJ508n3g.gif' alt='' ширина='846' высота='авто'>
</div></div>


### легенда Interaction Linking


Vтаблица also provides a легенда компонент, which can be used к control the display данные из the график по manipulating the легенда:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/P8wcbL1KmowzFqxnMCIcCjMvngf.gif' alt='' ширина='1000' высота='авто'>

Here is a summary из the creation process. It is important к note that adding a легенда will occupy the позиция из the таблица, so it is necessary к reset the позиция из the таблицаGroup в the scene tree:

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourceкод/img/JxlabSk0eoRQ6ExCj7acUCAZnPe.gif' alt='' ширина='712' высота='авто'>



легенда Нажать к control the данные display logic из the график:    

This logic is не directly integrated into the Vтаблица код, и users need к call the relevant interfaces themselves, as follows:    \r

```Typescript
`  таблицаInstance.на(легенда_ITEM_Нажать, *args* => {
    console.log('легенда_ITEM_Нажать', *args*);
    таблицаInstance.updateFilterRules([
      {
        filterKey: '20001',
        filteredValues: *args*.значение
      }
    ]);
  });    

```
The logic из updateFilterRules is:    

```Typescript
  */** 更新数据过滤规则，适用场景：点击图例项后 更新过滤规则 来更新图表 */*
  **updateFilterRules**(*filterRules*: FilterRules) {
    this.internalProps.данныеConfig.filterRules = *filterRules*;
    this.данныеset.updateFilterRules(*filterRules*);
    clearграфикCacheImвозраст(this.scenegraph);
    updateграфикданные(this.scenegraph);
    this.render();
  }    

```
в addition к updating данные through the данныеset, все график caches were cleared и re-rendered.    \r

## **Conclusion:**

The Vтаблица сводный таблица implements rich данные analysis functions, providing users с powerful данные visualization tools through flexible configuration и efficient данные processing mechanisms. Its core lies в the закрыть integration из данные processing, макет system, и interactive functions, making complex данные analysis simple и intuitive.

# This document was revised и organized по Следующий personnel 
 [玄魂](https://github.com/xuanhun)