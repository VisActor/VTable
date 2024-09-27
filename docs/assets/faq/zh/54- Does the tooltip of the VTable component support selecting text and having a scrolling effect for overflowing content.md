---
title: 32.VTable表格组件的溢出文字弹框tooltip是否支持选中文本及内容超长滚动效果？</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

VTable表格组件的溢出文字弹框tooltip是否支持选中文本及内容超长滚动效果？</br>
## 问题描述

利用了vtable表格组件的tooltip能力，也就是在单元格内容超长时，鼠标hover到该单元格即可显示出内容弹窗。</br>
但是，我发现这个弹框的内容无法被选中，因为鼠标离开单元格想要移动到tooltip上时，tooltip里面就消失了，根本没有办法移动上去。且当内容长度超长时，弹框会被撑得特别特别大，导致效果很丑，期望内容很长时可以让我滚动查看内容。VTable是否有能力可以实现我需要的效果？</br>
## 解决方案 

VTable提供了解决该问题的配置解法，第一个问题，正常情况下鼠标只要离开溢出文本的那个单元格，`tooltip`就会立马消失，所以导致的没有办法移动到tooltip上去，所以tooltip的相关配置中增加了`overflowTextTooltipDisappearDelay`来延缓tootip消失的时间。当配置了这个之后，鼠标就有时间去移动到tooltip上啦！这样也就解决了选中复制文本的需求。（i**con的tooltip的用法也是类似的哦！**）</br>
```
  /** tooltip相关配置 */
  tooltip?: {
    /** html目前实现较完整 先默认html渲染方式 */
    renderMode?: 'html'; // 目前暂不支持canvas方案
    /** 是否显示缩略文字提示框。 代替原来hover:isShowTooltip配置 暂时需要将renderMode配置为html才能显示，canvas的还未开发*/
    isShowOverflowTextTooltip?: boolean;
**    /** 缩略文字提示框 延迟消失时间 */**
**    overflowTextTooltipDisappearDelay?: number;**
    /** 是否将 tooltip 框限制在画布区域内，默认开启。针对renderMode:"html"有效 */
    confine?: boolean;
  };</br>
```
限制tooltip弹出框的尺寸，可以配置在tooltip的样式中，具体样式定义：</br>
```
/**
 * 气泡框，按钮的的解释信息
 */
export type TooltipStyle = {
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  padding?: number[];
  bgColor?: string;
**  maxWidth?: number;**
**  maxHeight?: number;**
};</br>
```
配置时放到theme中来指定：</br>
```
const option={
   tooltip: {
      renderMode: 'html',
      isShowOverflowTextTooltip: true,
      overflowTextTooltipDisappearDelay: 1000
    },
    theme:{
        tooltipStyle:{
            **maxWidth：200，**
            **maxHeight：100**
        }
    }
}</br>
```


## 代码示例  

可以粘贴到官网编辑器上进行测试：https://visactor.io/vtable/demo/component/tooltip</br>
```
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: '200'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      tooltip: {
        renderMode: 'html',
        isShowOverflowTextTooltip: true,
        overflowTextTooltipDisappearDelay: 1000
      },
      theme:{
          tooltipStyle:{
              maxWidth:200,
              maxHeight:60
          }
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;

  });</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/SJwXbCPGWoYbDAxgGmTc3zaEnug.gif' alt='' width='1512' height='1092'>

完整示例：https://www.visactor.io/vtable/demo/component/tooltip</br>
## 相关文档

相关api：https://www.visactor.io/vtable/api/Methods#showTooltip</br>
教程：https://www.visactor.io/vtable/guide/components/tooltip</br>
github：https://github.com/VisActor/VTable</br>



