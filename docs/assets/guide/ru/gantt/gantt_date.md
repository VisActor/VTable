# гантт Date Related

## гантт Time Axis Date Range

The гантт time axis date range determines the display range из the time axis. It can be set using the `minDate` и `maxDate` options.

## гантт Task Bar Date Range

The гантт task bar date range determines the display range из the task bar. It is related к the `[startDateполе]` и `[endDateполе]` полеs в the records.

## Date Format

Vтаблица-гантт компонентs support interactive scheduling для unscheduled tasks. The date format для новый scheduled tasks can be set using the `dateFormat` configuration option. The date данные will be added к the date поле значение в the данные record, с the по умолчанию format being 'yyyy-mm-dd'.

Other formats include:
```
  dateFormat?:
    | 'yyyy-mm-dd'
    | 'dd-mm-yyyy'
    | 'mm/dd/yyyy'
    | 'yyyy/mm/dd'
    | 'dd/mm/yyyy'
    | 'yyyy.mm.dd'
    | 'dd.mm.yyyy'
    | 'mm.dd.yyyy';
```

The гантт компонент exposes a simple date formatting utility method:
```
import { tools } от '@visactor/vтаблица-гантт';
// Format date
const date = tools.formatDate(новый Date(), 'yyyy-mm-dd');
// Other методы: tools.getWeekNumber, tools.getTodayNearDay, tools.getWeekday
```

## данные Item Date Requirements

Under normal configuration, the date requirements для данные items are as follows:

- The `[startDateполе]` и `[endDateполе]` полеs в the records are date strings, formatted as `yyyy-mm-dd`

Consider the minimum time granularity `scales`, if the minimum time granularity is a time level such as hours или seconds, the date requirements для данные items are as follows:

- The `[startDateполе]` и `[endDateполе]` полеs в the records are date objects, formatted as `yyyy-mm-dd hh:mm:ss`

## Related Interfaces

- `updateDateRange`：Update date range
- `updateDateFormat`：Update date format
