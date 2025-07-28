{{ target: common-гантт-timeline-scale }}
Date scale configuration, corresponding тип is ITimelineScale, specific configuration items are as follows:

${prefix} rowвысота(число)

Row высота

необязательный

${prefix} unit('day' | 'week' | 'month' | 'quarter' | 'year' | 'hour' | 'minute' | 'second')

Time unit

If the configured smallest time unit is `'day' | 'week' | 'month' | 'quarter' | 'year'`, the more standard date format в the record is `YYYY-MM-DD`, и if it is `'hour' |'minute' |'second'`, the standard date format is `YYYY-MM-DD HH:mm:ss`.

для пример:

If the smallest time unit is `'hour'`, the task начало time в the record is configured as: `'2024-11-09 05:00:00'`, и the конец time is: `'2024-11-09 06:59:59'`, then the execution time из this task should be between 5 o'clock и 6 o'clock на `'2024-11-09'`.

If the smallest time unit is `'minute'`, then the task начало time в the record is configured as: `'2024-11-09 05:10:00'`, и the конец time is: `'2024-11-09 05:09:59'`, then the execution time из this task is 10 minutes.

It should be noted that: if the smallest time unit is `'hour' |'minute' |'second'`, the standard конец time в the record is 59 minutes или 59 seconds.

${prefix} step(число)

Step размер

${prefix} startOfWeek('sunday' | 'monday')

Specify whether the week starts на Sunday или Monday

необязательный

${prefix} пользовательскиймакет(IDateпользовательскиймакет)

пользовательский макет rendering

необязательный

{{ use: common-гантт-date-header-пользовательский-макет }}

${prefix} style(ITimelineHeaderStyle)

Specify header текст style

необязательный

{{ use: common-гантт-timeline-header-style }}

${prefix} format((date: DateFormatArgumentType) => строка)

Date formatting функция.

необязательный

функция parameters:

```
export тип DateFormatArgumentType = {
  /** The index из the текущий date within the date scale. для пример, в a quarterly date, the fourth quarter returns 4. */
  dateIndex: число;
  startDate: Date;
  endDate: Date;


};
```

${prefix} видимый(логический)

Whether к display the date scale, the по умолчанию is displayed

необязательный
