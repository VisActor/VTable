---
title: 17. How to dynamically set the min and max values of the progressBar type in the VTable component based on the data items of the current row?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

How to dynamically set the min and max values of the progressBar type in the VTable component based on the data items of the current row?</br>
## Question Description

Business Scenario: For example, I have a column in my table that uses the progressBar cell type, but the maximum and minimum values of the bar chart in each row are different. That is, the max value of each data I get is not fixed. How can I achieve that the maximum and minimum values of the progressBar can be dynamically set in this case?</br>
## Solution

Currently, the专属配置项 max and min of the progressBar type in VTable support functional writing, so that you can obtain the data records needed to be combined according to the function parameters.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ASikb8pQ2o60m7xSJP0c8HeZnEc.gif' alt='' width='949' height='316'>

## Code Example

```
const records = [
  {
   "name":"pigeon",
   "introduction":"The pigeon is a common urban bird with gray feathers and a short, thick beak."
   "image":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.jpeg",
   "video":"https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/pigeon.mp4",
   "YoY":60,
   "QoQ":10,
   "min":-20,
   "max":100
  }
];

const columns = [
  {
    field: 'YoY',
    title: 'count Year-over-Year',
    cellType: 'progressbar',
    width:200,
    barType:'negative',
    min(args){
      const rowRecord=args.table.getCellOriginRecord(args.col,args.row);
      return rowRecord.min;
    },
    max(args){
      const rowRecord=args.table.getCellOriginRecord(args.col,args.row);
      return rowRecord.max;
    }
  },
];
const option = {
  records,
  columns
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;</br>
```
## Result Display

Related Demo reference: [https://visactor.io/vtable/demo/cell-type/progressbar](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fcell-type%2Fprogressbar)</br>
Just paste the code in the example into the official editor to present.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/FbWlbtKTloxfUIxxPMkcmYsPn7g.gif' alt='' width='1265' height='605'>

## Relevant Documents

Progressbar usage reference demo: [https://visactor.io/vtable/demo/cell-type/progressbar](https%3A%2F%2Fvisactor.io%2Fvtable%2Fdemo%2Fcell-type%2Fprogressbar)</br>
Progressbar usage tutorial: [https://visactor.io/vtable/guide/cell_type/progressbar](https%3A%2F%2Fvisactor.io%2Fvtable%2Fguide%2Fcell_type%2Fprogressbar)</br>
Related API: [https://visactor.io/vtable/option/ListTable-columns-progressbar#min](https%3A%2F%2Fvisactor.io%2Fvtable%2Foption%2FListTable-columns-progressbar%23min)</br>
GitHub: [https://github.com/VisActor/VTable](https%3A%2F%2Fgithub.com%2FVisActor%2FVTable)</br>

