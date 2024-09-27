---
title: 17. VTable表格组件中，progressbar进度条类型中min和max如何结合当前行的数据来计算展示呢</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件中，progressbar进度条类型中min和max如何结合当前行的数据项来动态设置呢</br>
## 问题描述

业务场景：比如我的表格有一列用了progressbar单元格类型，但我每一行的条形图的最大最小值都是不一样的，就是我得到的数据每一条的max值是不固定的，像这种情况我该如何实现该进度条最大最小值能动态设置呢？</br>
## 解决方案 

目前VTable的progressbar类型的专属配置项max和min支持函数式写法，这样就能根据函数参数获取到数据记录来得到需要结合的数据</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/MvPEbI4Mboim1AxffvOcHpWNn6g.gif' alt='' width='740' height='322'>



## 代码示例  

```
const records = [
  {
   "name":"鸽子",
   "introduction":"鸽子是一种常见的城市鸟类，具有灰色的羽毛和短而粗壮的喙",
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
## 结果展示 

相关Demo参考：https://visactor.io/vtable/demo/cell-type/progressbar</br>
直接将示例代码中代码粘贴到官网编辑器中即可呈现。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/SrBQbRfxSoYtaVxsxSKcg8VAnAf.gif' alt='' width='1265' height='605'>

## 相关文档

progressbar用法参考demo：https://visactor.io/vtable/demo/cell-type/progressbar</br>
progressbar用法教程：https://visactor.io/vtable/guide/cell_type/progressbar</br>
相关api：https://visactor.io/vtable/option/ListTable-columns-progressbar#min</br>
github：https://github.com/VisActor/VTable</br>

