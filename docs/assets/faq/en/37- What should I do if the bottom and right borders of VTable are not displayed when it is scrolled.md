---
title: 15. What should I do if the bottom and right borders of VTable are not displayed when it is scrolled?</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

What should I do if the bottom and right borders of VTable are not displayed when it is scrolled?</br>
## Problem description

As shown in the screenshot, the table contents in VTable are not fully displayed (when there is a scroll bar). How can I display the right and bottom borders of the table?</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/WqiUbPv03owU2Px1UVNciy8Anif.gif' alt='' width='432' height='628'>

## Solution

You can add borderLineWidth and borderColor configurations in the frameStyle in the theme. However, after adding the above configurations, the borders on the top and left sides of the table and the borders of the cells will have two layers of borders, and the effect is not good.</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/B9OwbT4N3oX3ZExrtcQcccOwndc.gif' alt='' width='437' height='131'>

After further research on the configuration, I found the cellInnerBorder configuration item, which is specifically designed to handle this situation. If you set it to false, the border lines of the cells on the edge will no longer be drawn.</br>
The configuration items used are defined as follows:</br>
```
/** frameStyle 是配置表格整体的样式 */
frameStyle ?:FrameStyle;
/** 单元格是否绘制内边框,如果为true，边界单元格靠近边界的边框会被隐藏 */
cellInnerBoder?:boolean;  // true | false</br>
```


## Code example

```
  const option = {
    records,
    columns,
    autoWrapText: true,
    limitMaxAutoWidth: 600,
    heightMode: 'autoHeight',
    theme:{
      frameStyle:{ // 配置的表格整体的边框
         borderLineWidth: 1, //  设置边框宽度
         borderColor: "#CBCBCB" //  设置边框颜色
      },
      cellInnerBorder:true  // 单元格是否绘制内边框，可结合情况设置true或false
    }
  };
  const tableInstance = new VTable.ListTable(container, option);</br>
```
## Results show

Complete example：https://codesandbox.io/p/sandbox/vtable-frame-border-demo-forked-zn4n9j</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/LYrkbUrwFoyKLrxJy5AcJnRHnge.gif' alt='' width='421' height='615'>

## Related Documents

Set table frame demo：https://codesandbox.io/p/sandbox/vtable-frame-border-demo-forked-zn4n9j</br>
Related api：https://www.visactor.io/vtable/option/ListTable#theme.cellInnerBorder </br>
https://www.visactor.io/vtable/option/ListTable#theme.frameStyle.borderLineWidth</br>
https://www.visactor.io/vtable/option/ListTable#theme.frameStyle.borderColor</br>
github：https://github.com/VisActor/VTable</br>