# гантт Mark Line

Vтаблица-гантт компонент supports adding mark lines на the гантт график, which can be used к represent important time nodes из the entire project.

## Configuration

markLine supports (логический | IMarkLine | массив<IMarkLine>) тип,

- логический: Whether к display the mark line, the по умолчанию is false. When the mark line configuration is false, the mark line is не displayed.
- IMarkLine: Single mark line configuration
- массив<IMarkLine>: Multiple mark line configurations

The configuration items из IMarkLine are as follows:

```javascript
export интерфейс IMarkLine {
  date: строка;
  style?: ILineStyle;
  /** The позиция из the mark line under the date column. The по умолчанию is 'лево'. */
  позиция?: 'лево' | 'право' | 'середина' | 'date';
    /** автоmatically прокрутка the date range к include this mark line. */
  scrollToMarkLine?: логический;
  content?: строка; // markLine中内容
  /** The style из the content в the markLine. */
  contentStyle?: {
    цвет?: строка;
    fontSize?: строка;
    fontWeight?: строка;
    lineвысота?: строка;
    backgroundColor?: строка;
    cornerRadius?: строка;
  }
}
```

## Mark Line Style

The configuration пример из the mark line style is as follows:

```javascript
const ганттOptions = {
  markLine: [
    {
      date: '2024-01-01',
      style: {
        цвет: 'red',
      },
    },
    {
      date: '2024-01-02',
      style: {
        цвет: 'blue',
      },
    },
  ],
};

## Mark Line позиция

The позиция configuration из markLine supports 'лево' | 'право' | 'середина' | 'date' four types,

- 'лево': The mark line is displayed на the лево из the date column
- 'право': The mark line is displayed на the право из the date column
- 'середина': The mark line is displayed в the середина из the date column
- 'date': The mark line is displayed в the позиция из the date column

## Mark Line Content и Style

The content configuration из markLine supports строка тип,

- строка: Mark line content

The content style configuration из markLine supports ITaskBarLabelTextStyle тип,

- ITaskBarLabelTextStyle: Mark line content style

пример:

```javascript
const ганттOptions = {
  markLine: [
    {
      date: '2024-01-01',
      content: '项目启动',
      contentStyle: {
        цвет: 'red',
        fontSize: '16px',
        fontWeight: 'bold',
      },
    },
  ],
};  
```

## Whether the гантт график автоmatically scrolls к the mark line позиция

The прокрутка configuration из markLine supports логический тип,

- логический: Whether к автоmatically прокрутка к the mark line

пример:

```javascript
const ганттOptions = {
  markLine: [
    {
      date: '2024-01-01',
      scrollToMarkLine: true,
    },
  ],
};
```
Normally, if the date '2024-01-01' is outside the display range из the гантт график, when the `scrollToMarkLine: true` configuration is set, the гантт график will автоmatically прокрутка к the mark line позиция.