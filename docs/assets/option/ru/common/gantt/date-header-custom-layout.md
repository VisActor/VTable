{{ target: common-гантт-date-header-пользовательский-макет }}
The пользовательский rendering из the date header corresponds к the тип IDateпользовательскиймакет. The specific configuration items are as follows:
```
export тип DateпользовательскиймакетArgumentType = {
  ширина: число;
  высота: число;
  index: число;
  /** The позиция из the текущий date в the date scale. для пример, the fourth quarter в a quarterly date returns 4. */
  dateIndex: число;
  заголовок: строка;
  startDate: Date;
  endDate: Date;
  days: число;
  ганттInstance: гантт;
};
export тип IDateпользовательскиймакет = (args: DateпользовательскиймакетArgumentType) => IDateпользовательскиймакетObj;
export тип IDateпользовательскиймакетObj = {
  rootContainer: VRender.Group;
  renderDefaultText?: логический; // по умолчанию is false
};
```
