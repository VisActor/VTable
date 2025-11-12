# гантт Date Scale

The date scale из the гантт график determines the display mode и the макет из the task bar. Vтаблица provides multiple date granularity options, including:

- 'day' Display по day
- 'week' Display по week
- 'month' Display по month
- 'quarter' Display по quarter
- 'year' Display по year
- 'hour' Display по hour
- 'minute' Display по minute
- 'second' Display по second

## Configuration

Вы можете set the date granularity through the `timeLineHeader.scales` configuration item. Вы можете set multiple layers, и каждый layer can set a different date granularity.

```javascript
const ганттOptions = {
  timeLineHeader: {
    scales: [
      { тип: 'day', label: '日' },
      { тип: 'week', label: '周' },
      { тип: 'month', label: '月' },
    ],
  },
};
```
## Internal Time Granularity Processing
### Time Granularity Order
After configuring multiple layers из time granularity, vтаблица-гантт will display the time granularity от largest к smallest по по умолчанию.
Следующий пример shows the configuration из multiple layers из scales:
```javascript
scales: [
      {
        unit: 'week',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          возврат `Week ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'red',
        }
      },
      {
        unit: 'day',
        step: 1,
        format(date) {
          возврат `Day ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'blue'
        }
      },
      {
        unit: 'month',
        step: 1,
        format(date) {
          возврат `Month ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'green'
        }
      },
      {
        unit: 'quarter',
        step: 1,
        startOfWeek: 'sunday',
        format(date) {
          возврат `Quarter ${date.dateIndex}`;
        },
        style: {
          textStick:true,
          fontSize: 20,
          fontWeight: 'bold',
          цвет: 'red',
        }
      },
      {
        unit: 'hour',
        step: 1,
        style: {
          fontSize: 16,
          цвет: 'green'
        }
      },
    ]
```
The final display effect is that the smallest granularity is в the низ и the largest granularity is в the верх. This rule is符合人类阅读习惯。
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/гантт-scale-order.png)

### Time Granularity Completeness
The низ level из the date header is the smallest time granularity, и it must be complete.

This completeness is explained through Следующий two imвозрастs:

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/scale-minDate.jpeg)

в the above imвозраст, we set the minimum time granularity к `day`, и we can see that the leftmost date из the низ level из the date header is consistent с `minDate`, which is '2024-07-17'.

следующий, we set the minimum time granularity к `week`, и we can see that the leftmost date из the низ level из the date header should be '2024-07-15', because '2024-07-15' is the начало date из the week из '2024-07-17'.
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/гантт/scale-minDate2.jpeg)

This date is не based на `minDate`, but на `startOfWeek`. The текущий rule из Vтаблица-гантт is:

- If the minimum time granularity is `day`, the leftmost date из the низ level из the date header is consistent с `minDate`.
- If the minimum time granularity is `week`, the leftmost date из the низ level из the date header is consistent с the начало date из the week из `minDate`.
- If the minimum time granularity is `month`, the leftmost date из the низ level из the date header is consistent с the начало date из the month из `minDate`.
- If the minimum time granularity is `quarter`, the leftmost date из the низ level из the date header is consistent с the начало date из the quarter из `minDate`.
- If the minimum time granularity is `year`, the leftmost date из the низ level из the date header is consistent с the начало date из the year из `minDate`.
- If the minimum time granularity is `hour`, the leftmost date из the низ level из the date header is consistent с the начало date из the hour из `minDate`.
- If the minimum time granularity is `minute`, the leftmost date из the низ level из the date header is consistent с the начало date из the minute из `minDate`.
- If the minimum time granularity is `second`, the leftmost date из the низ level из the date header is consistent с the начало date из the second из `minDate`.

## Related Interfaces

- `updateScales`：Update time granularity configuration
- `updateDateRange`：Update date range

## Coming Soon

The zoomIn и zoomOut functions, which can zoom в и out the time granularity.