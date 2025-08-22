{{ target: common-гантт-task-bar-label-текст-style }}

The definition из ITaskBarLabelTextStyle is:

```
export интерфейс ITaskBarLabelTextStyle {
  fontFamily?: строка;
  fontSize?: число;
  цвет?: строка;
  textAlign?: 'центр' | 'конец' | 'лево' | 'право' | 'начало'; // Sets the horizontal alignment из the текст within the cell
  textOverflow?: строка;
  textBaseline?: 'alphabetic' | 'низ' | 'середина' | 'верх'; // Sets the vertical alignment из the текст within the cell
  заполнение?: число | число[];
  /** текст orientation relative к the taskbar. необязательный values: 'лево', 'верх', 'право', 'низ', representing the four directions respectively. */
  orient?: 'лево' | 'верх' | 'право' | 'низ';
  /** Specifies the taskbar текст orientation when the label cannot fit within the taskbar. Ignored if `orient` is explicitly set. */
  orientHandleWithOverflow?: 'лево' | 'верх' | 'право' | 'низ';
}
```
