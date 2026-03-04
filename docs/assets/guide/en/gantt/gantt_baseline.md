# Gantt Baseline Bar

The baseline bar visualizes the "planned baseline" against the actual task schedule. It can be drawn above, below, or overlapped with the task bar to highlight deviations.

## Options

- `taskBar.baselineStartDateField`: baseline start date field in records, e.g. `baselineStartDate`.
- `taskBar.baselineEndDateField`: baseline end date field in records, e.g. `baselineEndDate`.
- `taskBar.baselineStyle`: baseline bar style, same fields as `barStyle`, or a function returning per-task style.
- `taskBar.baselinePosition`: `'top' | 'bottom' | 'overlap'`, default `'bottom'`.

Default baseline style:
```
{ barColor: '#d3d3d3', completedBarColor: '#a9a9a9', width: 20, cornerRadius: 3, borderWidth: 0 }
```

## Positioning Suggestions 

- If you want the task bar and baseline bar to be layered, set `baselinePosition` to `'top'` or `'bottom'`; if you want them to overlap, set `baselinePosition: 'overlap'`, and the task bar and baseline bar will be centered vertically.
- If you want to customize the position of the task bar, you can adjust `paddingTop` in `baselineStyle` and `barStyle` to achieve it.

## API: Read baseline info

Use `getBaselineInfoByTaskListIndex(index, subIndex?)` to get baseline start/end dates and days:
```
const info = ganttInstance.getBaselineInfoByTaskListIndex(0);
// { baselineStartDate, baselineEndDate, baselineDays }
```

## Example

```javascript
import { Gantt } from '@visactor/vtable-gantt';

const records = [
  {
    id: 1,
    title: 'Project Planning',
    startDate: '2024-07-05',
    endDate: '2024-07-14',
    baselineStartDate: '2024-07-01',
    baselineEndDate: '2024-07-10',
    progress: 80
  }
];

const option = {
  records,
  taskListTable: {
    columns: [{ field: 'title', title: 'Task', width: 180 }],
    tableWidth: 300
  },
  rowHeight: 90,
  taskBar: {
    startDateField: 'startDate',
    endDateField: 'endDate',
    progressField: 'progress',
    baselineStartDateField: 'baselineStartDate',
    baselineEndDateField: 'baselineEndDate',
    baselinePosition: 'bottom',
    baselineStyle: {
      width: 15,
      barColor: 'gray',
      cornerRadius: 5
    }
  },
  timelineHeader: {
    colWidth: 50,
    scales: [{ unit: 'day', step: 1 }]
  },
  minDate: '2024-06-25',
  maxDate: '2024-09-01'
};

const ganttInstance = new Gantt(document.getElementById('vTable'), option);
```

