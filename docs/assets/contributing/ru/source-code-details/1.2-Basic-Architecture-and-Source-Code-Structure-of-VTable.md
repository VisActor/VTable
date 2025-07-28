---
title: 1.2 Basic Architecture and Source Code Structure of VTable\r

key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
### VTable Core Architecture


#### Structural Analysis


VTable can be roughly divided into several modules: data processing layer, layout module, rendering module, event module, interaction module, state management, component communication.

* The data processing layer is responsible for managing the raw data, handling operations such as row-column transposition and built-in sorting, and then handing the processed data back to the table rendering;\r

* The layout module is mainly responsible for the basic header layout, pivot table header layout, cell layout, and the calculation algorithm for row and column heights, and then hands over the calculated layout to the rendering layer for rendering.\r

* The rendering module mainly calls `vrender` for rendering charts and various graphic elements and relies on the layout module.\r

*  The interaction module handles various user click operations, such as clicking the header to sort, editing cells, etc.;

*  The event module handles internal custom events, including lifecycle events, column width and row height adjustments, table scrolling, etc.;

* The status module handles the storage of states such as hover, select, menu, sort, etc.;

Different modules implement publish-subscribe through `EventTarget`.

#### Data Processing Layer


This layer mainly receives incoming data and stores it, while performing basic transformations on the data, including aggregation and sorting operations.

During the initialization of `ListTable`, some basic operations are performed on the incoming data. First, `options.records` or `options.dataSource` is passed to `CachedDataSource` for instantiation, and then the instance is placed in `table.internalProps.dataSource` for internal use by the component, such as when performing layout calculations for the table.

Initialization of the data layer:

* First step: When initializing ListTable, handle dataSource or records

* Step two: Use different judgments to put dataSource or records into internalProps, so that subsequent data changes can directly operate on the dataSource object\r

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/AO2NwkOfkhJR3IbEIUmcoEvYnjg.gif' alt='' width='820' height='auto'>

*  VTable\packages\vtable\src\ListTable.ts

```xml
constructor(container?: HTMLElement | ListTableConstructorOptions, options?: ListTableConstructorOptions) {
    //...
    if (options.dataSource) {
      _setDataSource(this, options.dataSource);
    } else if (options.records) {
      this.setRecords(options.records as any, { sortState: internalProps.sortState });
    } else {
      this.setRecords([]);
    }
    //...
}

```
* `setDataSource` and `setRecords` methods: VTable\packages\vtable\src\core\tableHelper.ts

```xml
// addReleaseObj 方法可以粗略概括为调用回调函数去更新组件内部的数据
export function _setDataSource(table: BaseTableAPI, dataSource: DataSource): void {
  _dealWithUpdateDataSource(table, () => {
    if (dataSource) {
      if (dataSource instanceof DataSource) {
        table.internalProps.dataSource = dataSource;
      } else {
        // 如果是初次调用该方法，会将 dataSource 初始化为 CachedDataSource 的实例，后续如果更新就不会重复 new
        const newDataSource = (table.internalProps.dataSource = new CachedDataSource(dataSource));
        table.addReleaseObj(newDataSource);
      }
    } else {
      table.internalProps.dataSource = DataSource.EMPTY;
    }
    table.internalProps.records = null;
  });
}

export function _setRecords(table: ListTableAPI, records: any[] = []): void {
  _dealWithUpdateDataSource(table, () => {
    table.internalProps.records = records;
    // 这里通过调用 CachedDataSource.ofArray 方法将records转换为实例所需的dataSource结构
    const newDataSource = (table.internalProps.dataSource = CachedDataSource.ofArray(
      records,
      table.internalProps.dataConfig,
      table.pagination,
      table.internalProps.columns,
      table.internalProps.layoutMap.rowHierarchyType,
      getHierarchyExpandLevel(table)
    ));
    // 可以看到这里调用 addReleaseObj 方法将 CachedDataSource 处理过的records 存放进 table.internalProps.dataSource 中
    table.addReleaseObj(newDataSource);
  });
}

```
<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">  The CachedDataSource.ofArray method internally also uses new CachedDataSource to adapt the records.
</div>
*  VTable/packages/src/data/CachedDataSource.ts

In this class, caching operations are implemented for the DataSource. It also inherits from `DataSource`.

```javascript
export class CachedDataSource extends DataSource {
  // ...
  static ofArray(
    array: any[],
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columns?: ColumnsDefine,
    rowHierarchyType?: 'grid' | 'tree',
    hierarchyExpandLevel?: number
  ): CachedDataSource {
    return new CachedDataSource(
      {
        get: (index: number): any => {
          return array[index];
        },
        length: array.length,
        records: array
      },
      dataConfig,
      pagination,
      columns,
      rowHierarchyType,
      hierarchyExpandLevel
    );
  }
  //...
}

```
*   VTable/src/data/DataSource.ts

In the `DataSource` class, you can see that the management operations for `records` are implemented in DataSource, and the processing of raw data is abstracted into this module.

```javascript
 export interface DataSourceParam {
  get?: (index: number) => any; // 这里是对数据的代理
  length?: number;
  */** 需要异步加载的情况 请不要设置records 请提供get接口 */*
  records?: any;
  // records 的增删操作
  added?: (index: number, count: number) => any;
  deleted?: (index: number[]) => any;
  canChangeOrder?: (sourceIndex: number, targetIndex: number) => boolean;
  changeOrder?: (sourceIndex: number, targetIndex: number) => void;
}

export class DataSource extends EventTarget implements DataSourceAPI {
 constructor(
    dataSourceObj?: DataSourceParam,
    dataConfig?: IListTableDataConfig,
    pagination?: IPagination,
    columns?: ColumnsDefine,
    rowHierarchyType?: 'grid' | 'tree',
    hierarchyExpandLevel?: number
  ) {
    super();
    // ...
    this.dataSourceObj = dataSourceObj;
    this.dataConfig = dataConfig;
    this._get = dataSourceObj?.get;
    this.columns = columns;
    this._source = dataSourceObj?.records ? this.processRecords(dataSourceObj?.records) : dataSourceObj;
    }
}

```
The logic layer mainly involves various types of logic processing, such as chart transposition, data sorting, filtering logic, and aggregation. The main data processing logic is stored in these files, including APIs exposed for external calls. The data initialization mentioned earlier is done by calling the methods in these files:

<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">VTable\packages\vtable\src\data\CachedDataSource.ts
VTable\packages\vtable\src\data\DataSource.ts
VTable\packages\vtable\src\dataset\dataset.ts
VTable\packages\vtable\src\dataset\dataset-pivot-table.ts
</div>
For example, the core logic of the following two APIs:

<div style="display: flex;"><div style="flex: 47; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/DOdsb0Qw3oGSpzxETiNcspR2n5f.gif' alt='' width='500' height='auto'>

</div><div style="flex: 52; margin:5px;"><img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/OgycbIbePoB6DnxGstzcliagnic.gif' alt='' width='503' height='auto'>

</div></div>
*  VTable\packages\vtable\src\data\DataSource.ts

```javascript
// 树形结构的展开和收起
toggleHierarchyState(index: number, bodyStartIndex: number, bodyEndIndex: number) {
    //... 
 }
 
*/***
** 修改多条数据recordIndexs*
**/*
updateRecords(records: any[], recordIndexs: (number | number[])[]) {
  //...
}
//...

```
#### Layout Module

<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">The core files of the layout module are located in VTable\packages\vtable\src\layout
</div>
The Layout module is the core module of the VTable component, including the header of the basic table, the header of the pivot table, the layout of chart cells, the logic of tree headers and tree cells. After adjustments are completed through the layout module, it is then handed over to the rendering layer for rendering. In addition, this file also contains a lot of auxiliary logic for layout adjustments.

#### Rendering Module


VTable 的核心渲染能力是通过 [VRender](https://github.com/VisActor/VRender) 实现的，其内部借用了 `VRender`的能力去实现表格的初始化渲染、数据更新与删除后的重新渲染、用户拖拽后的重新渲染等等。

Inside the VTable, a scenegraph is maintained, which defines the core rendering logic within the VTable.

The initialization of the scene tree and the definition of the `render` method are located in `BaseTable`:

*  VTable/packages/vtable/src/core/BaseTable.ts

```javascript
export abstract class BaseTable extends EventTarget implements BaseTableAPI {
  //....
  constructor(container: HTMLElement, options: BaseTableConstructorOptions = {}) {
  //...
      this.scenegraph = new Scenegraph(this);
   //...
  }
  
  */***
*   * 重绘表格(同步绘制)*
*   */*
  render(): void {
    this.scenegraph.renderSceneGraph();
  }
 }

```
*  VTable/packages/vtable/src/scenegrpah/scenegrapg.ts

```javascript
*/***
* * @description: 表格场景树，存储和管理表格全部的场景图元*
* * @return {*}*
* */*
export class Scenegraph {
  //...
  stage: IStage;
  //...
   
  */***
*   * @description: 绘制场景树*
*   * @param {any} element*
*   * @param {CellRange} visibleCoord*
*   * @return {*}*
*   */*
  renderSceneGraph() {
    this.stage.render();
  }

```
The entry point for the initial rendering is the BaseTable.render method, which internally calls renderSceneGraph in the scenegraph. It then uses the render method on the Stage created by createStage in VRender to draw the table to the specified DOM node. At this point, the first step of rendering is complete, and the subsequent rendering layer logic is invoked through the scenegraph.

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/ATKxwhs4khU0WobZpwxcDh7pnmc.gif' alt='' width='1000' height='auto'>

#### Interaction Module


The interaction module mainly handles two tasks:

*  Listen to table custom events

* Change table-related status, re-render the table

The interaction module mainly consists of the event module and state management, completing operations such as hover highlighting, select highlighting, and table scrolling.

#### Event Module


*  VTable\packages\vtable\src\event\event.ts

event.ts exposes `EventManager`, `EventManager` is used to manage various events of the table, including mouse events (such as click, double-click to auto-adjust column width, mouse movement, etc.) and keyboard events (such as mouse scroll, enter key to submit edited content, etc.).

VTable internally listens to most custom events within the table, including wheel and click events, through `Stage.addEventListener` provided by VRender. For example, the wheel event is used to implement table scrolling; click is used to change the selectState and simultaneously trigger the externally passed click_cell callback.

#### State Management


**Global State Management**: The state here exists independently of the table, and when the state changes, it will redraw the table. `StateManager` mainly includes the following parts:

* hoverState table hover configuration and the currently hovered cell

*  selectState table currently selected cell

* frozen rows or columns

*  scroll The current table's horizontal and vertical scroll position

* Highlight state of sparkLine mini chart

* Custom sorting within sort


These data are defined in `StateManager` and generated during table initialization. By updating the State, the table can be redrawn. The core file of `StateManager` is defined in: `VTable\packages\vtable\src\state\state.ts`

#### Component Communication


The component communication part of VTable relies on the `EventTarget` class. By observing the source code structure, it can be found that most modules inherit from `EventTarget` and implement event communication through `EventTarget`.

*   vtable/src/data/Datasource.ts

```javascript
export class DataSource extends EventTarget implements DataSourceAPI { //...

```
*   vtable/src/core/BaseTable.ts

```javascript
export abstract class BaseTable extends EventTarget implements BaseTableAPI { //...

```
*   vtable/src/header-helper/style/Style.ts

```javascript
export class Style extends EventTarget implements ColumnStyle {

```
`EventTarget` internal structure:

*  vtable/src/event/EventTarget.ts

```javascript
import type {
  TableEventListener,
  EventListenerId,
  TableEventHandlersEventArgumentMap,
  TableEventHandlersReturnMap
} from '../ts-types';
import { isValid } from '@visactor/vutils';

let idCount = 1;

export class EventTarget {
  private listenersData: {
    listeners: { [TYPE in keyof TableEventHandlersEventArgumentMap]?: TableEventListener<TYPE>[] };
    listenerData: {
      [id: number]: {
        type: string;
        listener: TableEventListener<keyof TableEventHandlersEventArgumentMap>;
        remove: () => void;
      };
    };
  } = {
    listeners: {},
    listenerData: {}
  };

  */***
*   * 监听事件*
*   * @param type 事件类型*
*   * @param listener 事件监听器*
*   * @returns 事件监听器id*
*   */*
  on<TYPE extends keyof TableEventHandlersEventArgumentMap>(                        
    type: TYPE,
    listener: TableEventListener<TYPE>
  ): EventListenerId {
    ...
  }

  off(type: string, listener: TableEventListener<keyof TableEventHandlersEventArgumentMap>): void;
  off(id: EventListenerId): void;
  off(
    idOrType: EventListenerId | string,
    listener?: TableEventListener<keyof TableEventHandlersEventArgumentMap>
  ): void {
     // ...
  }
    
   // 添加事件监听
  addEventListener<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    listener: TableEventListener<TYPE>,
    option?: any
  ): void {
    this.on(type, listener);
  }
    
  // 移除事件监听
  removeEventListener(type: string, listener: TableEventListener<keyof TableEventHandlersEventArgumentMap>): void {
      // ...
  }

  hasListeners(type: string): boolean {
      // ...
  }
  
  // 触发事件
  fireListeners<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    event: TableEventHandlersEventArgumentMap[TYPE]
  ): TableEventHandlersReturnMap[TYPE][] {
      // ...
  }
  
  // 释放事件监听
  release(): void {
    delete this.listenersData;
  }
}


```
* Internal component communication:

* Communication between different layers is carried out through events, function calls, or data sharing. For example, when the interaction module receives a user's sorting operation request, it will call the sorting function of the logic processing layer and pass the sorting result to the rendering layer for re-rendering.

* The rendering layer may update based on the data from the data layer, triggering certain operations in the interaction module, such as updating the display of the selected state, etc.

* External callback:

* External incoming event subscriptions are called back through `fireListeners`, for example, different lifecycle events will be promptly called back to the user through `fireListeners`.

#### Overall Module Design


<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/EvQ6bQHFhoosf0x7SkBc8PDbnwd.gif' alt='' width='1000' height='auto'>



### VTable Source Code Structure


#### VTable Module Overview


* Data Processing Layer

`Options` The table configuration passed in by the user, used to describe the structure, content, and style of the table.

`DataSource` is responsible for managing data, defining methods for reading and manipulating data;

`Dataset` Pivot table data parsing module;

* Layout Module

`Layout` is responsible for the layout calculation of basic tables and pivot table headers, as well as the calculation of cell row and column heights, etc.;

*  Rendering Module

`Scenegraph` module is responsible for the creation and updating of table scene nodes;

`SceneProxy` is a submodule of Scenegraph, responsible for calculating the maximum number of display rows and columns, initializing the scene tree logic, and the logic for progressive table rendering.

`Theme` manages the global styles of the module table, providing styles for the cells; 

* State Management

`StateManager` is responsible for managing the current state of the table, including frozen, selected, hover, scroll, and other table states.

*  Event Module

`EventManager` is responsible for managing the definition and listening of custom events.

* Component Communication

`EventTarget` provides a publish-subscribe pattern, responsible for event communication between different modules;

#### Vtable Directory Structure


By observing the directory under the `src` folder, you can see the general project structure, which is strictly divided according to modules. Basically, each file exports a Class, and by constructing instances at different times and places, the initialization of the VTable is completed.

The diagram below roughly shows the code structure of VTable and the functions of each file.

![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/VFfewdljLhX2CabukvQc9aRonGg.gif)

#### Path Analysis


Starting from `src/index.ts`, you can see that VTable exposes the two most commonly used components, ListTable and PivotTable, from here. This is where different components of VTable converge.

*  vtable/packages/vtable/src/index.ts

```javascript
import { graphicUtil, registerForVrender } from '@src/vrender';
registerForVrender();
// ...
import { ListTableAll as ListTable } from './ListTable-all';
import { PivotTableAll as PivotTable } from './PivotTable-all';
//...
export {
  //...,
  ListTable,
  //...
  PivotTable,
  PivotChart,
};
//...

```
Enter `ListTable-all`, you can see that the necessary components are registered during the initialization of `ListTable` so that the chart instance can be called in different places.

*  VTable\packages\vtable\src\ListTable-all.ts

```javascript
import { ListTable } from './ListTable';
// ...

registerAxis(); // 注册坐标轴
registerEmptyTip(); // 注册 EmptyTip 组件
// ...
registerVideoCell();
export class ListTableAll extends ListTable {}

```
*  VTable/packages/vtable/src/ListTable.ts

```javascript
export class ListTable extends BaseTable implements ListTableAPI {

```
In BaseTable, the most core modules are defined.

<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">Scenegraph  Scene Tree
StateManager  State Management
EventManager Interaction Event Management
</div>
*  VTable/packages/vtable/src/core/BaseTable.ts

```javascript
export abstract class BaseTable extends EventTarget implements BaseTableAPI {
  constructor {
      ...
      this.scenegraph = new Scenegraph(this);
      this.stateManager = new StateManager(this);
      this.eventManager = new EventManager(this);   
      this.animationManager = new TableAnimationManager(this);
      ...
  }     
}

```
BaseTable inherits from the EventTarget class to implement publish-subscribe operations.

* After performing path analysis on VTable, we can draw a rough reference diagram of the ListTable modules:

![](https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/sourcecode/img/XLzHwVyQMhwn0ybjI9DcFIZRn4e.gif)

<div style="padding:5px;background-color: rgb(255, 245, 235);border-color: rgb(255, 245, 235);">PivotTable also adopts a similar architecture, inheriting from BaseTable just like `ListTable`.</div>
</div>
### Conclusion


VTable, through reasonable modular management of various functions, can maximize development efficiency and reduce the learning curve.

This article divides the structure of VTable into layers, categorizing it into data layer, logic layer, rendering layer, and interaction module. By analyzing different layers, it introduces the basic architecture of VTable.

Then, starting from the directory, it introduces the source code structure of VTable, the division of various modules, and the functions responsible for different modules. After analyzing from two perspectives, one can have a certain understanding of the overall architecture of VTable. \r

# This document is provided by the following personnel


taiiiyang( https://github.com/taiiiyang) 


