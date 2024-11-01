---
title: 23. VTable使用问题：如何手动控制tooltip展示</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## 问题标题

如何手动控制tooltip展示</br>


## 问题描述

如何手动控制tooltip的展示内容，展示样式和展示时机</br>


## 解决方案 

VTable提供了`showTooltip`方法，用于手动触发tooltip展示</br>
```
showTooltip: (col: number, row: number, tooltipOptions?: TooltipOptions) => voild</br>
```
*  col&row: 限制tooltip的单元格位置</br>
*  tooltipOptions: tooltip的详细配置：</br>
```
type TooltipOptions = {
  /** tooltip内容 */
  content: string;
  /** tooltip框的位置 优先级高于referencePosition */
  position?: { x: number; y: number };
  /** tooltip框的参考位置 如果设置了position则该配置不生效 */
  referencePosition?: {
    /** 参考位置设置为一个矩形边界 设置placement来指定处于边界位置的方位*/
    rect: RectProps;
    /** 指定处于边界位置的方位  */
    placement?: Placement;
  };
  /** 需要自定义样式指定className dom的tooltip生效 */
  className?: string;
  /** 设置tooltip的样式 */
  style?: {
    bgColor?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    padding?: number[];
    arrowMark?: boolean;
  };
};</br>
```
## 代码示例  

```
tableInstance.showTooltip(col, row, {
content: 'custom tooltip',
    referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
    className: 'defineTooltip',
    style: {
      bgColor: 'black',
      color: 'white',
      font: 'normal bold normal 14px/1 STKaiti',
      arrowMark: true,
    },
});</br>
```
## 结果展示 

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/ZjhpbGG8joc3vnxc6uDcGOFcnZd.gif' alt='' width='765' height='452'>

完整示例：https://www.visactor.io/vtable/demo/component/tooltip</br>
## 相关文档

相关api：https://www.visactor.io/vtable/api/Methods#showTooltip</br>
github：https://github.com/VisActor/VTable</br>



