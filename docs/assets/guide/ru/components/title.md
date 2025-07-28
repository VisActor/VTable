# title Introduction к the use из таблица titles
The Title компонент в the Vтаблица таблица library allows you к configure the main title и subtitle из the таблица и apply different styles к them. This tutorial will guide you на how к use this feature effectively.

## пример и configuration introduction
Here is an пример configuration:

```
заголовок: {
      текст: 'North American supermarket Продажи analysis',
      subtext: `The данные includes 15 к 18 years из retail transaction данные для North American supermarket`,
      orient: 'верх',
      заполнение: 20,
      textStyle: {
        fontSize: 30,
        fill: 'black'
      },
      subtextStyle: {
        fontSize: 20,
        fill: 'blue'
      }
    },
```
в the пример above, we set the main title к 'North American supermarket Продажи analysis' и the subtitle к 'The данные includes 15 к 18 years из retail transaction данные для North American supermarket'. Now let's walk through the пользовательскийization options one по one:

- текст: The текст content из the main title.
- subtext: the текст content из the subtitle.
- orient: the direction из the title. Can be set к 'верх', 'низ', 'лево' или 'право', indicating that the title is в the верх, низ, лево или право из the таблица. в the пример, we set it к 'верх', which means the title is в the верх из the таблица.
- заполнение: the заполнение из the title. Can be set к a число that represents the spacing between the title и the edge из the таблица. в the пример we set it к 20.
- textStyle: style setting для the main title. Вы можете use this option к set style attributes such as шрифт размер и цвет. в the пример we set the шрифт размер к 30 и the цвет к 'black'.
- subtextStyle: style setting для subtitle. Вы можете use this option к set style attributes such as шрифт размер и цвет. в the пример, we set the шрифт размер к 20 и the цвет к 'blue'.
по using the above configurations, Вы можете пользовательскийize the content и style из the main и subtitles к better meet your needs и design style.

Note that the above пример only shows некоторые из the configuration options для the title компонент! для more configuration, please go к [option description](https://visactor.io/vтаблица/option/списоктаблица#title.видимый)