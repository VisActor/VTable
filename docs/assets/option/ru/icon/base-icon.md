{{ target: base-иконка }}

${prefix} тип ('текст' | 'svg' | 'path' | 'imвозраст')
Specify the content тип из the иконка, such as svg текст. Can be used к constrain the definition из different types из attributes.

${prefix} ширина (число)
The ширина из the иконка.

${prefix} высота (число)
The высота из the иконка.

${prefix} positionType (иконкаPosition)
иконкаPosition enumeration тип.

```
/**
* иконка location
* inlineFront: the front из the текст content,
* inlineEnd: after the текст content
*
*/
export enum иконкаPosition {
  /**Кнопка на the лево side из the cell и affected по заполнение */
  лево = 'лево',
  /**The Кнопка на the право side из the cell is affected по заполнение, such as the pin график */
  право = 'право',
  /**The иконка fixed на the право side does не occupy space, is не affected по заполнение, и may cover the content, such as выпадающий список */
  absoluteRight = 'absoluteRight',
  /**The иконка на the лево side из the cell content block follows the текст positioning и does не wrap с the текст */
  contentLeft = 'contentLeft',
  /**The иконка на the право side из the cell content block follows the текст positioning и does не wrap с the текст */
  contentRight = 'contentRight',
  /**Free positioning в the cell */
  absolute = 'absolute',

  /**The иконка в front из the текст line content follows the текст positioning и wraps с the текст */
  inlineFront = 'inlineFront',
  /**The иконка after the текст line content, positioned с the текст, и wrapped с the текст. для пример, the сортировка график is placed в the первый line из the текст content */
  inlineEnd = 'inlineEnd',
}
```

${prefix} marginRight (число)
The spacing distance от the право element, или the spacing distance от the cell boundary.

${prefix} marginLeft (число)
The spacing distance от the лево element, или the spacing distance от the cell boundary.

${prefix} имя (строка)
The имя из the иконка, which will be used as the key для internal caching.

${prefix} funcType (иконкаFuncTypeEnum)

When resetting the иконка inside Vтаблица, you need к specify the functional тип из the иконка.

Especially для functional иконкаs с toggleable states, please be sure к configure funcType, such as сортировкаing функция с funcType set к сортировка, и имя set к сортировка_normal, сортировка_downward, или сортировка_upward. This way, the corresponding иконка can be replaced accurately.

иконкаFuncTypeEnum enumeration definition:

```
enum иконкаFuncTypeEnum {
  frozen = 'frozen',
  сортировка = 'сортировка',
  выпадающий список = 'выпадающий список',
  dropDownState = 'dropDownState',
  play = 'play',
  damвозрастPic = 'damвозрастPic',
  развернуть = 'развернуть',
  свернуть = 'свернуть',
  drillDown = 'drillDown',
  drillUp = 'drillUp'
}
```

${prefix} навести (объект)

размер из навести response hotzone и навести effect фон цвет.

#${prefix} ширина (число)
ширина из the навести response hotzone.

#${prefix} высота (число)
высота из the навести response hotzone.

#${prefix} bgColor (строка)
фон цвет для навести effect.

#${prefix} imвозраст (строка)
Imвозраст для навести effect.

${prefix} cursor (строка)
Specific mouse style when hovering over the иконка.

${prefix} visibleTime ('always' | 'mouseenter_cell' | 'Нажать_cell')
Visibility, по умолчанию к 'always'. необязательный values are 'always', 'mouseenter_cell', или 'Нажать_cell'. Recommendation: If you need к use 'mouseenter_cell' или 'Нажать_cell', it is recommended к set positionTyle к absoluteRight (i.e., non-occupying) к avoid visual display issues.

${prefix} Подсказка (объект)
Подсказка, Кнопка explanation information, currently only supports навести behavior triggering.

#${prefix} title (строка)
Title из the Подсказка.

#${prefix} placement (Placement)
Подсказка позиция, необязательный values are верх, лево, право, или низ.
Placement enumeration definition:

```
 enum Placement {
  верх = 'верх',
  низ = 'низ',
  лево = 'лево',
  право = 'право'
}
```

#${prefix} disappearDelay (число)
The delay time для the Подсказка к disappear. If you need к move the mouse к the Подсказка, please configure this параметр.

#${prefix} style (объект)
The style из the Подсказка. If не configured, the тема style will be used.

##${prefix} шрифт (строка)
Подсказка шрифт.

##${prefix} цвет (строка)
Подсказка текст цвет.

##${prefix} заполнение (число[])
Подсказка заполнение. Format is [верх, право, низ, лево].

##${prefix} bgColor (строка)
Подсказка фон цвет.

##${prefix} arrowMark (логический)
Whether the Подсказка displays an arrow.

##${prefix} maxширина (число)
The maximum ширина из the Подсказка.

##${prefix} maxвысота (число)
The maximum высота из the Подсказка.

${prefix} interactive (логический)
Whether it is interactive, по умолчанию is true. Currently known non-interactive Кнопкаs are выпадающий список меню states.
