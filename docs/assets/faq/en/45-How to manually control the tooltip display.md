---
title: VTable usage issue: How to manually control the tooltip display</br>
key words: VisActor,VChart,VTable,VStrory,VMind,VGrammar,VRender,Visualization,Chart,Data,Table,Graph,Gis,LLM
---
## Question title

How to manually control the tooltip display</br>


## Problem description

How to manually control the display content, display style, and display timing of tooltips</br>


## Solution

VTable provides a `showTooltip `method for manually triggering tooltip display</br>
```
showTooltip: (col: number, row: number, tooltipOptions?: TooltipOptions) => voild</br>
```
*  Col & row: limit the cell position of tooltip</br>
*  tooltipOptions: Detailed configuration of tooltip:</br>
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
## Code example

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
## Results show

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/EM1JbBKCtodYZcx5DK9cwHWEn9g.gif' alt='' width='765' height='452'>

Complete example: https://www.visactor.io/vtable/demo/component/tooltip</br>
## Related Documents

Related api: https://www.visactor.io/vtable/api/Methods#showTooltip</br>
github：https://github.com/VisActor/VTable</br>



