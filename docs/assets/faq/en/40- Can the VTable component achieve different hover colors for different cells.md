---
title: 18. Can the VTable component achieve different hover colors for different cells?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question Title

Can the VTable component achieve different hover colors for different cells?</br>
## Question Description

Can different cells have different hover colors?</br>
Use case: By default, the hover color is set to blue. Under certain conditions, some cells are highlighted in purple. However, the requirement is that when hovering over the highlighted cells, they should not change to the hover blue color.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/Cv2GbY7Ihoxmnax0PnWcTJ29n2f.gif' alt='' width='626' height='526'>

## Solution

It can be solved by the background color function. Set `bgColor` as a function to set the highlight background color for special values. Set the background color through `theme.bodyStyle.hover.cellBgColor`, which also needs to be set as a function to return different background colors. If some cells do not want a background color, an empty string can be returned.</br>


## Code Example

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
## Result Display

Just paste the code in the example directly into the official editor to display it.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/X5whb5D2gontykxAt4DchKtUnnf.gif' alt='' width='824' height='524'>

## Relevant Documents

Theme Usage Reference Demo:https://visactor.io/vtable/demo/theme/extend</br>
Theme Usage Tutorial：https://visactor.io/vtable/guide/theme_and_style/theme</br>
Related api：https://visactor.io/vtable/option/ListTable#theme</br>
github：https://github.com/VisActor/VTable</br>

