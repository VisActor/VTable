---
title: 15. VTable有滚动情况下底部和右侧边框不显示怎么办？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable有滚动情况下底部和右侧边框不显示怎么办？</br>
## 问题描述

如截图效果，VTable中表格内容显示不完整（有滚动条的情况下），如何能让表格中的右侧边框和底部边框都显示？</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/OGSEb9vzjoHOR7xz3crcz6Hanbc.gif' alt='' width='432' height='628'>

## 解决方案 

可通过在theme主题中的**frameStyle**添加**borderLineWidth**和**borderColor**配置**，不过添加上述配置后，表格顶部和左侧的边框和单元格的边框会有两层边框 效果也不好。**</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/EFnGbl6sWoClKfx403uctm2Gnub.gif' alt='' width='437' height='131'>

进一步研究配置，发现了**cellInnerBorder**配置项，专门为了处理这种情况的配置，将其设置为false，则边缘的单元格的边框线将不再绘制。</br>
用到的配置项定义如下：</br>
```
/** frameStyle 是配置表格整体的样式 */
frameStyle ?:FrameStyle;
/** 单元格是否绘制内边框,如果为true，边界单元格靠近边界的边框会被隐藏 */
cellInnerBoder?:boolean;  // true | false</br>
```


## 代码示例  

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
## 结果展示 

在线效果参考：https://codesandbox.io/p/sandbox/vtable-frame-border-demo-forked-zn4n9j</br>
<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/XiCbbqs3QoCgbOx1PblcjgTjnRf.gif' alt='' width='421' height='615'>

## 相关文档

设置表格边框demo：https://codesandbox.io/p/sandbox/vtable-frame-border-demo-forked-zn4n9j</br>
相关api：https://www.visactor.io/vtable/option/ListTable#theme.cellInnerBorder </br>
https://www.visactor.io/vtable/option/ListTable#theme.frameStyle.borderLineWidth</br>
https://www.visactor.io/vtable/option/ListTable#theme.frameStyle.borderColor</br>
github：https://github.com/VisActor/VTable</br>

