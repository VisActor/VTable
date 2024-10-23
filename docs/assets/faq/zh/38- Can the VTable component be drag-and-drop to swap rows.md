---
title: 16. VTable表格组件是否可以拖拽整行调换位置？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件是否可以拖拽整行调换位置？</br>
## 问题描述

VTable基本表格ListTable怎么能进行拖拽行换位呢</br>
## 解决方案 

VTable的行换位透视表是支持拖拽表头换位置的，基本表格需要结合序号配置来实现。其中有个`dragOrder`是表示否可拖拽顺序的配置项。配置了这个为true后会显示拖拽按钮图标，需要鼠标操作这个图标来拖拽换位。同时这个图标可以替换成你业务需要的图标样子。</br>
```
export interface IRowSeriesNumber {
  width?: number | 'auto';
  title?: string;
  format?: (col?: number, row?: number, table?: BaseTableAPI) => any;
  cellType?: 'text' | 'link' | 'image' | 'video' | 'checkbox';
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption);
  headerIcon?: string | ColumnIconOption | (string | ColumnIconOption)[];
  icon?:
    | string
    | ColumnIconOption
    | (string | ColumnIconOption)[]
    | ((args: CellInfo) => string | ColumnIconOption | (string | ColumnIconOption)[]);
  /** 是否可拖拽顺序 */
  dragOrder?: boolean;
}</br>
```


## 代码示例  

```
const option = {
      records: data,
      columns,
      widthMode: 'standard',
      rowSeriesNumber: {
        title: '序号',
        **dragOrder**: true,
        width: 'auto',
        headerStyle: {
          color: 'black',
          bgColor: 'pink'
        },
        style: {
          color: 'red'
        }
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);</br>
```
## 结果展示 

在线效果参考：https://visactor.io/vtable/demo/interaction/move-row-position</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ERzmbA0XLoHk9xxi733c8kpxnCb.gif' alt='' width='842' height='552'>

## 相关文档

拖拽移动行demo：https://visactor.io/vtable/demo/interaction/move-row-position</br>
拖拽移动行教程：https://visactor.io/vtable/guide/basic_function/row_series_number</br>
相关api：https://visactor.io/vtable/option/ListTable#rowSeriesNumber</br>
github：https://github.com/VisActor/VTable</br>

