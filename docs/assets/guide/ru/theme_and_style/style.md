# Style Style Introduction

The таблица style configuration provides flexibility и пользовательскийization, enabling users к design и beautify the таблица presentation according к the business данные тип из каждый column. If you need к consider the style от the таблица as a whole, Вы можете use it[тема](../../guide/тема_and_style/тема).

This document describes how к use style и headerStyle к configure таблица styles к help users better understand и use these возможности.

## A brief introduction

The style refinement configuration из cells в Vтаблица, including cell styles, header cell styles, etc. The configuration из styles is списокed as a group из separate configurations (if it is a transposed таблица, it is used к behave as a group из configuration styles).

## Header cell style configuration

Configure headerStyle в каждый item из columns. If it is в the сводный таблица, it corresponds к columns и rows. пример код:

     import * as vтаблица от '@visactor/vтаблица';

     const опция: vтаблица.списоктаблицаConstructorOptions = {
     columns: [
      {
        поле: 'id',
        заголовок: 'ID',
        headerStyle: {
          bgColor: 'red',
          автоWrapText: true,
          lineвысота: 20,
          lineClamp: 'авто',
          textBaseline: "верх",
          цвет:"yellow"
        },
      }
      ...
    ];

    const таблицаInstance = новый Vтаблица.списоктаблица(option);

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0b.png)

## Body cell style configuration

Configure style в каждый item из columns. If it is в the сводный таблица, it corresponds к columns и rows. пример код:

     import * as vтаблица от '@visactor/vтаблица';

     const опция: vтаблица.списоктаблицаConstructorOptions = {
     columns: [
      {
        поле: 'id',
        заголовок: 'ID',
        style: {
          bgColor: 'green',
          автоWrapText: true,
          lineвысота: 20,
          lineClamp: 'авто',
          textBaseline: "верх",
          цвет:"yellow"
        },
      }
      ...
    ];

    const таблицаInstance = новый Vтаблица.списоктаблица(option);

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d15626270908.png)

Style provides a series из cell configurations, briefly described below.

## Specific introduction

### Cell фон цвет

`bgColor`: Defines the фон цвет из the cell. Use строка или функция parameters к set the цвет.

### текст style

- `textAlign`: Defines the horizontal alignment из текст в cells
- `textBaseline`: Defines the vertical alignment из текст в cells
- `цвет`: Defines the текст цвет из the cell
- `fontSize`: define cell текст размер
- `fontFamily`: Defines the текст шрифт из the cell
- `fontWeight`: Defines the текст шрифт weight из the unit
- `fontVariant`: Defines the текст weight из the cell
- 'FontStyle: Defines the текст шрифт style из the cell

These settings make it easy к adjust the rendering из текст в cells.

### граница

Contains Следующий configuration items:

- `borderColor`Set the цвет из the граница для the cell
- `borderLineширина`: cell sets the ширина из the граница
- `borderLineDash`: Set the line dashed style из the граница для the cell

### Line высота, line feed settings

- `lineвысота`: set текст высота для cell content
- `textOverflow`: Sets the ellipsed form из the текст. This configuration has no effect if автоWrapText sets line wrapping

### Underscore, underline settings

- `underline`: set underscores для single cells
- `underlineDash`: Dashed style из underline.
- `underlineOffset`: The distance between underline и текст.
- `lineThrough`: underline cell текст

### Link текст цвет

`linkColor`: Set the текст цвет из the link тип.

### Mouse навести style

`cursor`: mouse навести к cell mouse style

### текст adsorption effect

`textStick`: Set whether the текст из the cell has an adsorption fruit \[Dynamically adjust the позиция из the cell content when scrolling].Can be set к true к включить, или set к 'horizontal' или 'vertical' к specify в which direction к snap only.
`textStickBaseOnAlign`: When the cell текст has an adsorption effect [the текст can dynamically adjust its позиция when scrolling], the basis для adsorption is the horizontal alignment из the cell. для пример, when `textStickBaseOnAlign` is `true` и `textAlign` is `'центр'`, the текст will be adsorbed к the horizontal центр из the cell; otherwise, it will be adsorbed к the лево или право edge из the cell (depending на the прокрутка позиция) )

### Cell Tag

`marked`: Set whether the cell has a record style

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/guide/cell-marked.jpeg)

### line wrapping

`автоWrapText`: Set cell wrapping

### Maximum число из rows setting

- `lineClamp`: Set the maximum число из rows из the unit, Вы можете set число или'авто ', set it к'авто', it will be автоmatically calculated

### Cell заполнение

- `заполнение`: defines the заполнение из the cell

The ширина и высота из a cell consists из two parts: заполнение и content.

Through the above introduction, you have mastered the use из style в Vтаблица, и then Вы можете create a таблица с a personalized style according к your needs.

## пользовательский style

If you need different styles для different cells, Вы можете use the style функция:

```
style: (args)=>{
  if(args.значение>10)
    возврат {цвет: 'red'};
  возврат {цвет: 'green'};
}

```

или set a style в style к a функция

```
style: {
  цвет(args){
    if(args.значение>10)
      возврат 'red';
    возврат 'green';
  }
}

```

или use style registration к change the style through интерфейс calls. для details, please refer к the tutorial: https://visactor.io/vтаблица/guide/пользовательский_define/пользовательский_style
