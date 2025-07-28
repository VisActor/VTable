{{ target: base-icon }}

${prefix} type ('text' | 'svg' | 'path' | 'image')
Тип содержимого иконки, такой как svg-текст. Может использоваться для ограничения определений различных типов свойств.

${prefix} width (number)
Ширина иконки.

${prefix} height (number)
Высота иконки.

${prefix} positionType (IconPosition)
Тип перечисления IconPosition.

```
/**
* Расположение иконки
* inlineFront: перед текстовым содержимым,
* inlineEnd: после текстового содержимого
*
*/
export enum IconPosition {
  /**Кнопка слева от ячейки, на которую влияет отступ */
  left = 'left',
  /**Кнопка справа от ячейки, на которую влияет отступ, например график закрепления */
  right = 'right',
  /**Иконка зафиксирована справа, не занимает место, не зависит от отступа и может покрывать содержимое, например dropDown */
  absoluteRight = 'absoluteRight',
  /**Иконка слева от блока содержимого ячейки следует позиционированию текста и не переносится с текстом */
  contentLeft = 'contentLeft',
  /**Иконка справа от блока содержимого ячейки следует позиционированию текста и не переносится с текстом */
  contentRight = 'contentRight',
  /**Свободное позиционирование в ячейке */
  absolute = 'absolute',

  /**Иконка перед содержимым строки текста следует позиционированию текста и переносится с текстом */
  inlineFront = 'inlineFront',
  /**Иконка после содержимого строки текста, позиционируется с текстом и переносится с текстом. Например, график сортировки размещается в первой строке текстового содержимого */
  inlineEnd = 'inlineEnd',
}
```

${prefix} marginRight (number)
Расстояние между иконкой и элементом справа, или расстояние между иконкой и границей ячейки.

${prefix} marginLeft (number)
Расстояние между иконкой и элементом слева, или расстояние между иконкой и границей ячейки.

${prefix} name (string)
Имя иконки, которое будет использоваться в качестве ключа для внутреннего кэша.

${prefix} funcType (IconFuncTypeEnum)

При сбросе иконки внутри VTable необходимо указать функциональный тип иконки.

Особенно для функциональных иконок с переключаемыми состояниями обязательно настройте funcType, например для функции сортировки с funcType, настроенным как sort, и name, настроенным как sort_normal, sort_downward или sort_upward. Таким образом, соответствующая иконка внутри может быть точно заменена.

Определение типа перечисления IconFuncTypeEnum:

```
enum IconFuncTypeEnum {
  pin = 'pin',
  sort = 'sort',
  dropDown = 'dropDown',
  dropDownState = 'dropDownState',
  play = 'play',
  damagePic = 'damagePic',
  expand = 'expand',
  collapse = 'collapse',
  drillDown = 'drillDown',
  drillUp = 'drillUp'
}
```

${prefix} hover (Object)

Отвечает за размер горячей зоны наведения и цвет фона эффекта наведения.

#${prefix} width (number)
Ширина горячей зоны наведения.

#${prefix} height (number)
Высота горячей зоны наведения.

#${prefix} bgColor (string)
Цвет фона для эффекта наведения.

#${prefix} image (string)
Изображение для эффекта наведения.

${prefix} cursor (string)
Конкретный стиль курсора, который появляется при наведении мыши на иконку.

${prefix} visibleTime ('always' | 'mouseenter_cell' | 'click_cell')
Видимость, по умолчанию 'always'. Дополнительные значения - 'always', 'mouseenter_cell' или 'click_cell' и т.д. Предложение: Если вам нужно использовать 'mouseenter_cell' или 'click_cell', рекомендуется установить positionTyle в absoluteRight (т.е. не занимать место), иначе занимаемый тип повлияет на визуальное отображение.

${prefix} tooltip (Object)
Всплывающая подсказка, описание кнопки. В настоящее время поддерживается только поведение наведения.

#${prefix} title (string)
Заголовок всплывающей подсказки.

#${prefix} placement (Placement)
Положение всплывающей подсказки, дополнительные значения: top, left, right или bottom.
Определение типа перечисления Placement:

```
 enum Placement {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right'
}
```

#${prefix} style (Object)
Стиль всплывающей подсказки. Если не настроен, будет использоваться стиль темы.

##${prefix} font (string)
Шрифт всплывающей подсказки.

##${prefix} color (string)
Цвет текста всплывающей подсказки.

##${prefix} padding (number[])
Отступ всплывающей подсказки. Формат: [top, right, bottom, left].

##${prefix} bgColor (string)
Цвет фона всплывающей подсказки.

##${prefix} arrowMark (boolean)
Показывать ли стрелку в всплывающей подсказке.

${prefix} interactive (boolean)
Интерактивна ли, по умолчанию true. В настоящее время известные неинтерактивные кнопки - это меню состоянияий dropdown.
