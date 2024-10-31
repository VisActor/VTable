---
title: VTable usage problem: How to display table row numbers</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
# Question title

How to display the serial number of each row in a table.</br>


# Problem Description

Through configuration, add a column before the first column of the table to display the row number of each row.</br>


# Solution 

`rowSeriesNumber` can be configured in the `option` of table initialization. This configuration item is defined as follows:</br>
```
interface IRowSeriesNumber {
  width?: number | 'auto'; // width of the line number column
  title?: string; // Row serial number title, empty by default
  format?: (col?: number, row?: number, table?: BaseTableAPI) => any; // Row serial number formatting function, empty by default. Through this configuration, you can convert numerical type serial numbers into custom serial numbers, such as using a, b, c...
  cellType?: 'text' | 'link' | 'image' | 'video' | 'checkbox';  // Row serial number cell type, default is text
  style?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // Body cell style, please refer to:[style](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Foption%2FListTable-columns-text%23style.bgColor)
  headerStyle?: ITextStyleOption | ((styleArg: StylePropertyFunctionArg) => ITextStyleOption); // Header cell style, please refer to:[headerStyle](https%3A%2F%2Fwww.visactor.io%2Fvtable%2Foption%2FPivotTable-columns-text%23headerStyle.bgColor)
  dragOrder?: boolean; // Whether the row serial number sequence can be dragged. The default is false. If set to true, the icon at the dragging position will be displayed, and you can drag and drop on the icon to change its position. If you need to replace the icon, you can configure it yourself. Please refer to the tutorial: https://visactor.io/vtable/guide/custom_define/custom_icon for the chapter on resetting function icons.
}</br>
```


## code example

```
const option = {
  records: data,
  columns,
  widthMode: 'standard',
  rowSeriesNumber: {
    title: '序号',
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
const tableInstance = new VTable.ListTable(container, option);</br>
```
## Results display 

Online effect reference: https://www.visactor.io/vtable/demo/basic-functionality/row-series-number</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/CYGRblW5toHUdNx1m3jcWEYnnVe.gif' alt='' width='709' height='403'>



## Related documents

Line number demo: https://www.visactor.io/vtable/demo/basic-functionality/row-series-number</br>
Related API: https://www.visactor.io/vtable/option/ListTable#rowSeriesNumber</br>
github: https://github.com/VisActor/VTable</br>



