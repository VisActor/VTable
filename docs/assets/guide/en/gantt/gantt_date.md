# Gantt Date Related

## Gantt Time Axis Date Range

The Gantt time axis date range determines the display range of the time axis. It can be set using the `minDate` and `maxDate` options. If not set, the default value is the maximum and minimum values of the `[startDateField]` and `[endDateField]` fields in the records.

## Gantt Task Bar Date Range

The Gantt task bar date range determines the display range of the task bar. It is related to the `[startDateField]` and `[endDateField]` fields in the records.

## Date Format

VTable-Gantt components support interactive scheduling for unscheduled tasks. The date format for new scheduled tasks can be set using the `dateFormat` configuration option. The date data will be added to the date field value in the data record, with the default format being 'yyyy-mm-dd'.

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

The Gantt component exposes a simple date formatting utility method:
```
import { tools } from '@visactor/vtable-gantt';
// Format date
const date = tools.formatDate(new Date(), 'yyyy-mm-dd');
// Other methods: tools.getWeekNumber, tools.getTodayNearDay, tools.getWeekday
```

## Data Item Date Requirements

Under normal configuration, the date requirements for data items are as follows:

- The `[startDateField]` and `[endDateField]` fields in the records are date strings, formatted as `yyyy-mm-dd`

Consider the minimum time granularity `scales`, if the minimum time granularity is a time level such as hours or seconds, the date requirements for data items are as follows:

- The `[startDateField]` and `[endDateField]` fields in the records are date objects, formatted as `yyyy-mm-dd hh:mm:ss`

## Related Interfaces

- `updateDateRange`：Update date range
- `updateDateFormat`：Update date format
