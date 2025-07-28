---
заголовок: Vтаблица usвозраст issue: How к manually control the Подсказка display</br>
key words: VisActor,Vграфик,Vтаблица,VStrory,VMind,VGrammar,VRender,Visualization,график,данные,таблица,Graph,Gis,LLM
---
## Question title

How к manually control the Подсказка display</br>


## Problem description

How к manually control the display content, display style, и display timing из Подсказкаs</br>


## Solution

Vтаблица provides a `showПодсказка `method для manually triggering Подсказка display</br>
```
showПодсказка: (col: число, row: число, ПодсказкаOptions?: ПодсказкаOptions) => voild</br>
```
*  Col & row: limit the cell позиция из Подсказка</br>
*  ПодсказкаOptions: Detailed configuration из Подсказка:</br>
```
тип ПодсказкаOptions = {
  /** Подсказка内容 */
  content: строка;
  /** Подсказка框的位置 优先级高于referencePosition */
  позиция?: { x: число; y: число };
  /** Подсказка框的参考位置 如果设置了position则该配置不生效 */
  referencePosition?: {
    /** 参考位置设置为一个矩形边界 设置placement来指定处于边界位置的方位*/
    rect: RectProps;
    /** 指定处于边界位置的方位  */
    placement?: Placement;
  };
  /** 需要自定义样式指定classимя dom的Подсказка生效 */
  classимя?: строка;
  /** 设置Подсказка的样式 */
  style?: {
    bgColor?: строка;
    fontSize?: число;
    fontFamily?: строка;
    цвет?: строка;
    заполнение?: число[];
    arrowMark?: логический;
  };
};</br>
```
## код пример

```
таблицаInstance.showПодсказка(col, row, {
content: 'пользовательский Подсказка',
    referencePosition: { rect, placement: Vтаблица.TYPES.Placement.право }, //TODO
    classимя: 'defineПодсказка',
    style: {
      bgColor: 'black',
      цвет: 'white',
      шрифт: 'normal bold normal 14px/1 STKaiti',
      arrowMark: true,
    },
});</br>
```
## Results показать

<img src='https://cdn.jsdelivr.net/gh/xuanhun/articles/visactor/img/EM1JbBKCtodYZcx5DK9cwHWEn9g.gif' alt='' ширина='765' высота='452'>

Complete пример: https://www.visactor.io/vтаблица/демонстрация/компонент/Подсказка</br>
## Related Documents

Related апи: https://www.visactor.io/vтаблица/апи/методы#showПодсказка</br>
github：https://github.com/VisActor/Vтаблица</br>



