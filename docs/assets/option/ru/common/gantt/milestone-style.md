{{ target: common-гантт-task-bar-milestone-style }}

The definition из IMilestoneStyle is:

```
export интерфейс IMilestoneStyle {
  /** Milestone граница цвет */
  borderColor?: строка;
  /** Milestone граница ширина */
  borderLineширина?: число;
  /** Milestone fill цвет */
  fillColor?: строка;
  /** Milestone square corner radius */
  cornerRadius?: число;
  /** The milestone is a square по по умолчанию, и this ширина configures the length из the square edge */
  ширина?: число;
  /** The milestone label. Supports either a fixed строка или a template строка */
  labelText?: ITaskBarLabelText;
  /** Milestone текст Style */
  labelTextStyle:{
    fontFamily?: строка;
    fontSize?: число;
    цвет?: строка;
    заполнение?: число | число[];
  }
  /** позиция из текст relative к milestone */
  textOrient?: 'лево' | 'верх' | 'право' | 'низ';
}
```
