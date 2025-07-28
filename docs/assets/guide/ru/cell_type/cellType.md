# данные тип

в the поле из данные analytics и visualization, one из the typical applications из Vтаблица is к display и present various types из данные. The so-called types here include: текст, links, pictures, videos, progress bars, и графикs. по supporting multiple column types, Vтаблица can provide users с a richer и more diverse данные experience, allowing users к observe и understand данные от different perspectives и Dimensions.

следующий, this article will фокус на the various column types и their usвозраст и characteristics к help you gain insight into данные lake visualization using Vтаблица.

## Support тип

There are 7 данные types supported по Vтаблица, имяly:

1.  текст
2.  Link
3.  Imвозраст
4.  Video
5.  progressbar
6.  Sparkline
7.  график

следующий, we'll cover каждый column тип one по one.

## текст

Columns с column тип "текст" are mainly used к display текст данные и are the most common тип из таблица column. It is flexible because текст can be displayed и processed по setting different formatting functions и пользовательский styles.

первый, let's loхорошо в a `cellType: 'текст'` пример из:

```javascript
{
  cellType: 'текст',
  поле: 'имя',
  заголовок: '姓名',
}
```

в this пример:

*   `cellType: 'текст'` Represents the текущий column used к display текст данные.
*   `поле: 'имя'` Specifies the данные поле that currently represents the имя.
*   `заголовок: '姓名'` Set a column header имяd "имя" для the header.

It should be noted that if the текущий `cellType` Item defaults, defaults к тип'текст '.

следующий, we process the текст по setting formatting functions и пользовательский styles:

```javascript
{
  cellType: 'текст',
  поле: 'имя',
  заголовок: '姓名',
  полеFormat: (record) => record.имя.toUpperCase(),
  style: {
    цвет: 'blue',
  },
}
```

в this пример:

*   `полеFormat: (record) => record.имя.toUpperCase()` Indicates that все имя полеs в the данные source are displayed в uppercase letters.
*   `style: { цвет 'blue' }` Indicates that the текст display цвет is set к blue.

с the above settings, we can пользовательскийize the columns из тип "текст" к a certain extent к meet the needs из данные presentation.

## Link

When the column тип is "link", it is used к display the данные из the link тип. Similar к the "текст" тип, the "link" тип also has high flexibility. The link can be displayed и processed по setting different formatting functions, styles, и the jump address when Нажатьing, whether к detect the legitimacy из the link, etc.

показать one below `cellType: 'link'` пример, и process the link тип данные по setting the jump address и detecting the legitimacy из the ссылка:

```javascript
{
  cellType: 'link',
  поле: 'homepвозраст',
  заголовок: '主页',
  linkJump: true,
  linkDetect: true,
}
```

в this пример:

*   `linkJump: true` Indicates that the link can be Нажатьed к jump.
*   `linkDetect: true` Indicates that the link is к be regularized, и if the link conforms к the link rules, it will be displayed as a link.
    в addition, the hyperlinke form can also support template links, such as setting templateссылка:

```javascript
{
  templateссылка:https://www.google.com.hk/search?q={имя}', //имя是数据源属性字段名。
}
```

Through the above settings, we can пользовательскийize the column из тип "link" к meet the needs из данные display.

## Imвозраст

When the column тип is "imвозраст", it is used к display the данные из the picture тип. The "imвозраст" тип has certain flexibility, и the данные can be processed по setting different imвозраст display методы и пользовательскийizing styles such as maintaining the aspect ratio, maintaining the original размер из the picture, etc.

показать one below `cellType: 'imвозраст'` для пример, we process the данные из the picture тип по setting the свойства из maintaining the aspect ratio и the picture автоmatically stretching the cell размер:

```javascript
{
  cellType: 'imвозраст',
  поле: 'avatar',
  заголовок: '头像',
  keepAspectRatio: true,
  imвозраставтоSizing: true,
}
```

в this пример:

*   `keepAspectRatio: true` Indicates that you want к keep the aspect ratio из the picture displayed.
*   `imвозраставтоSizing: true` Indicates that you want к автоmatically развернуть the размер из the cell according к the размер из the picture.

Through the above settings, we can пользовательскийize the columns из the "imвозраст" тип к meet the needs из данные display.


## Video

When the column тип is "video", it is used к display the данные из the video тип. все configuration items из "video" are the same as imвозраст, Вы можете refer к the imвозраст тип configuration item.

## progressbar

When the column тип is "progressbar", it is used к display the данные из the progress bar тип. The progress bar данные can be processed по setting the тип из the progress bar, the данные range из the progress bar, etc.

показать one below `cellType: 'progressbar'` пример из:

```javascript
{
  cellType: 'progressbar',
  поле: 'progress',
  заголовок: '进度',
  min: 0,
  max: 100,
  barType: 'по умолчанию',
}
```

в this пример:

*   `min: 0` Represents the minimum данные для the progress bar display range.
*   `max: 100` Represents the maximum данные для the scope из the progress bar display.
*   `barType: 'по умолчанию'` represent**Progress Bar тип**Is the по умолчанию тип.


## Sparkline

When the column тип is "sparkline", it is used к display the данные из the miniature тип. The "sparkline" тип has high flexibility, и the данные из the miniature can be processed по setting the specific spec configuration item из the miniature.

показать one below `cellType: 'sparkline'` пример из:

```javascript
{
  cellType: 'sparkline',
  поле: 'trend',
  заголовок: '趋势',
  sparklineSpec: {
    тип: 'line',
    xполе: 'x',
    yполе: 'y',
    line: {
      style: {
        strхорошоe: '#2E62F1',
        strхорошоeширина: 2
      }
    },
    point: {
      навести: {
        strхорошоe: 'blue',
        strхорошоeширина: 1,
        fill: 'red',
        shape: 'circle',
        размер: 4
      }
    }
  }
}
```

в this пример:

*   `sparklineSpec` The тип из miniature и specific configuration items are set.


## график

When the column тип is "график", it is used к display the данные из the график тип. Before using this тип, you need к регистрация a график тип through Vтаблица.график.регистрация. для details, please refer к the tutorial.[Vграфик registration](../../guide/cell_type/график)пример из use after registration:

показать one below `cellType: 'график'` пример из:

```javascript
{
  cellType: 'график',
  поле: 'графикданные',
  заголовок: '销售趋势',
  графикModule: 'vграфик',
  графикSpec: {
    тип: 'common',
    series: [
      {
        тип: 'line',
        данные: {
          id: 'данные',
        },
        xполе: 'x',
        yполе: 'y',
        seriesполе: 'тип',
      },
    ],
    axes: [
      { orient: 'лево', range: { min: 0 } },
      { orient: 'низ', label: { видимый: true }, тип: 'band' },
    ],
    легендаs: [
      {
        видимый: true,
        orient: 'низ',
      },
    ],
  },
}
```

в this пример:

*   `графикModule: 'vграфик'` Use the график library компонент built into Vтаблица, регистрацияed under the имя vграфик
*   `графикSpec` The график тип и specific configuration items are set, и the specific configuration items need к be referred к.[Vграфик](https://visactor.io/vграфик).

## Composite cellType

в некоторые demand scenarios, it may be expected к display different данные types в different данные situations или в different rows и columns. The above cellType writing method clearly specifies what тип a column must be (the transposed таблица specifies what тип a row must be). We Supports cellType функция пользовательскийization, и can specify different types according к demand logic:

Следующий shows an пример из `cellType: ()=>{}`: (Please refer к [пример](https://visactor.io/vтаблица/демонстрация/cell-тип/composite-cellType))
 
```javascript
{
    поле: 'imвозраст',
    заголовок: 'bird imвозраст',
    cellType(args){
      if(args.row%3===1)
        возврат 'imвозраст';
      else if(args.row%3===2)
        возврат 'link';
      возврат 'текст'
    },
    полеFormat(record){
      debugger
      if(record.имя===='Magpie')
        возврат 'Magpie's access address:'+record.imвозраст;
      возврат record.imвозраст;
    },
    ширина:'авто',
    keepAspectRatio:true,
  }
```
