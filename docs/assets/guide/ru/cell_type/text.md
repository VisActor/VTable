# таблица Display текст тип (текст) Introduction

в таблица applications, текст-тип данные is the most common и базовый form из данные display. от simple таблица content к complex style adjustments, it все revolves around текст данные display. As the базовый display form из данные analytics, a good текст тип setting can provide users с a better reading experience. This tutorial will introduce the application из текст types в Vтаблица и its related configuration items в detail.

в Vтаблица, Вы можете пользовательскийize полеs и styles according к actual needs, so as к achieve flexible и diverse текст тип display effects.

## Introduction к style configuration

Vтаблица supports setting various styles для текст тип данные. Следующий are the style configuration items для текст тип:

- `textAlign`: Defines the horizontal alignment из текст within cells, which can be set к`лево`,`центр`,`право`.
- `textBaseline`: Defines the vertical alignment из текст within cells, which can be set к`верх`,`середина`,`низ`.
- `textOverflow`: Set the omitted form из the текст, which can be configured as:`'clip' | 'ellipsis' | строка`, representing truncated текст, using`...`Represents omitted текст, other strings instead из omitted текст. If `автоWrapText` Line wrapping is set, the configuration has no effect.
- `цвет`: Defines the цвет из the текст.
- `fontSize`: Defines the размер из the текст.
- `fontFamily`: Defines the шрифт из the текст.
- `fontWeight`: Defines the шрифт weight из the текст.
- `fontVariant`: Defines the шрифт weight из the текст.
- `fontStyle`: Defines the шрифт style из the текст.
- `textOverflow`: Set the omitted form из the текст, it should be noted that if автоWrapText is set с line wrapping, the configuration is invalid.
- `lineвысота`: Set the текст шрифт высота для the cell текст content.
- `underline`: Set the underscore для the текст content из the cell.
- `underlineDash`: Dashed style из underline.
- `underlineOffset`: The distance between underline и текст.
- `lineThrough`: Set the dash для the cell текст content.
- `textStick`: Set whether the текст из the cell has an adsorption effect \[The текст can dynamically adjust the позиция when scrolling].Can be set к true к включить, или set к 'horizontal' или 'vertical' к specify в which direction к snap only.
- `textStickBaseOnAlign`: When the cell текст has an adsorption effect [the текст can dynamically adjust its позиция when scrolling], the basis для adsorption is the horizontal alignment из the cell. для пример, when `textStickBaseOnAlign` is `true` и `textAlign` is `'центр'`, the текст will be adsorbed к the horizontal центр из the cell; otherwise, it will be adsorbed к the лево или право edge из the cell (depending на the прокрутка позиция)
- `автоWrapText`: Sets whether cells wrap themselves.
- `lineClamp`: Set the maximum число из rows в a cell, Вы можете set число или'авто ', if set к'авто', it will be автоmatically calculated

Note: The above styles also apply к the hyperlinke данные format content.

## пример:

```javascript liveдемонстрация
{
  cellType: 'текст',
  поле: 'productимя',
  заголовок: '商品名称',
  style: {
    textAlign: 'лево',
    textBaseline: 'середина',
    textOverflow: 'ellipsis',
    цвет: '#333',
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fontVariant: 'small-caps',
    fontStyle: 'italic'
  }
}
```

Combined с the above примеры, Вы можете configure the display effect из текст types в Vтаблица according к actual needs. по reasonably adjusting the style из the текст и related configuration items, it can provide users с a clear и easy-к-understand таблица display effect.
