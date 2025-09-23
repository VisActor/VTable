{{ target: common-гантт-mark-line }}

IMarkLine specific definition:

```
export интерфейс IMarkLine {
  date: строка;
  style?: ILineStyle;
  /** The позиция where the mark line is displayed under the date column. по умолчанию is 'лево' */
  позиция?: 'лево' | 'право' | 'середина' | 'date';
  /** автоmatically include the mark line within the date range */
  scrollToMarkLine?: логический;
  content?: строка; // markLine content
  /** markLine content style */
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

${prefix} date(строка)

Specify date

обязательный

${prefix} style(ILineStyle)

Mark line style

необязательный

{{ use: common-гантт-line-style }}

${prefix} позиция('лево' | 'право' | 'середина' | 'date')

The позиция where the mark line is displayed under the date column. по умолчанию is 'лево'

'date 'is located based на the specific time

необязательный

${prefix} scrollToMarkLine(логический)

автоmatically include the mark line within the date range. If set к true и the mark line is не within the display range, it will автоmatically прокрутка к the display range.

по умолчанию is true. If markLine is an массив и multiple mark lines have scrollToMarkLine set к true, only the первый one set к true will be recognized.

If no значение is set, the первый one is defaulted к true.

необязательный

${prefix} contentStyle

markLine content style

необязательный

```
export тип иконкаtentStyle = {
    цвет?: строка;
    fontSize?: строка;
    fontWeight?: строка;
    lineвысота?: строка;
    backgroundColor?: строка;
    cornerRadius?: строка;
};
```
