---
title: 16. Can the VTable component be drag-and-drop to swap rows</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

Can the VTable component be drag-and-drop to swap rows?</br>
## Question Description

How can the VTable basic table ListTable perform drag-and-drop row swapping?</br>
## Solution

The VTable pivot table supports drag-and-drop header row swapping, while the basic table requires the configuration of serial numbers to achieve this. There is a configuration item called `dragOrder` that indicates whether the drag-and-drop order is enabled. After configuring this to true, a drag-and-drop button icon will be displayed, which requires mouse operation to perform drag-and-drop swapping. At the same time, this icon can be replaced with the icon required by your business.</br>
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
/** Whether it can be rearranged by drag and drop */
  dragOrder?: boolean;
}</br>
```


## Code Examples

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
## Results Show

Online effect reference: [https://visactor.io/vtable/demo/interaction/move-row-position](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Finteraction%2Fmove-row-position)</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/PyqpbOX0modx4txoZKCcE3SFnne.gif' alt='' width='842' height='552'>

## Related documents

Demo of drag-and-drop row movement: [https://visactor.io/vtable/demo/interaction/move-row-position](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Finteraction%2Fmove-row-position)</br>
Tutorial on drag-and-drop row movement: [https://visactor.io/vtable/guide/basic_function/row_series_number](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fbasic_function%2Frow_series_number)</br>
API: [https://visactor.io/vtable/option/ListTable#rowSeriesNumber](https%3A%2F%2Fvisactor.io%2Fvtable%2Foption%2FListTable%23rowSeriesNumber)</br>
GitHub: [https://github.com/VisActor/VTable](https%3A%2F%2Fgithub.com%2FVisActor%2FVTable)</br>

