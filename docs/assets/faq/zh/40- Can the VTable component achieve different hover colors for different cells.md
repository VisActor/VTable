---
title: 18. VTable表格组件是否可以实现不同单元格hover颜色不一样？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件是否可以实现不同单元格hover颜色不一样？</br>
## 问题描述

请问，可以实现不同单元格hover颜色不一样么？</br>
使用场景：默认情况下，设置hover颜色为蓝色，根据不同条件，高亮了一部分单元格为紫色，但需求不希望hover到高亮单元格时也变成了hove蓝r色。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ZU9Ob7mjwoChtJx0WzEcAsstnfe.gif' alt='' width='626' height='526'>

## 解决方案 

可通过背景色函数来解决，`bgColor`配置为函数形式来设置特殊值的高亮背景颜色。通过`theme.bodyStyle.hover.cellBgColor`来设置背景色，同样这里也需要设置成函数，返回不同的背景色，如果有些单元格不想要背景色的话可以放回空字符串。</br>


## 代码示例  

```
let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
    .then((res) => res.json())
    .then((data) => {

const columns =[
    {
        "field": "Profit",
        "title": "Profit",
        "width": "auto",
        style:{
            bgColor(args){
                if(args.value>200){
                    return 'rgba(153,0,255,0.2)'
                }
                // 以下代码参考DEFAULT主题配置实现 https://github.com/VisActor/VTable/blob/develop/packages/vtable/src/themes/DEFAULT.ts
                const { col,row, table } = args;
                const {row:index} = table.getBodyIndexByTableIndex(col,row);
                if (!(index & 1)) {
                    return '#FAF9FB';
                }
                return '#FDFDFD';
            }
        }
    },
    {
        "field": "Order ID",
        "title": "Order ID",
        "width": "auto"
    },
    {
        "field": "Customer ID",
        "title": "Customer ID",
        "width": "auto"
    },
    {
        "field": "Product Name",
        "title": "Product Name",
        "width": "auto"
    }
];

const option = {
  records:data,
  columns,
  widthMode:'standard',
  hover:{
    highlightMode:'cell'
  },
  theme:VTable.themes.DEFAULT.extends({
    bodyStyle:{
      hover:{
        cellBgColor(args){
          if(args.value>200){
              return ''
          }
          return '#CCE0FF';
        }
      }
    }
  })
};
tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
})</br>
```
## 结果展示 

直接将示例代码中代码粘贴到官网编辑器中即可呈现。</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/HYU8bfXN4oCzq9xf9BTcBLSrnAe.gif' alt='' width='824' height='524'>

## 相关文档

主题用法参考demo：https://visactor.io/vtable/demo/theme/extend</br>
主题用法教程：https://visactor.io/vtable/guide/theme_and_style/theme</br>
相关api：https://visactor.io/vtable/option/ListTable#theme</br>
github：https://github.com/VisActor/VTable</br>

