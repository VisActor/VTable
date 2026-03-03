# 甘特图基线任务条

基线任务条用于展示“计划基线”与“实际任务”的差异。通过在任务条上方、下方或与其重叠位置绘制一条基线条，帮助识别偏差。

## 配置项

- `taskBar.baselineStartDateField`：基线开始日期字段，例如 `baselineStartDate`。
- `taskBar.baselineEndDateField`：基线结束日期字段，例如 `baselineEndDate`。
- `taskBar.baselineStyle`：基线条样式，支持与 `barStyle` 相同字段（如 `width`、`barColor`、`cornerRadius`、`borderLineWidth` 等），也支持传函数按任务返回样式。
- `taskBar.baselinePosition`：`'top' | 'bottom' | 'overlap'`，默认 `'bottom'`。

默认基线样式为：
```
{ barColor: '#d3d3d3', completedBarColor: '#a9a9a9', width: 20, cornerRadius: 3, borderWidth: 0 }
```

## API：读取基线信息

使用 `getBaselineInfoByTaskListIndex(index, subIndex?)` 可获取指定任务的基线开始/结束日期与天数：
```
const info = ganttInstance.getBaselineInfoByTaskListIndex(0);
// { baselineStartDate, baselineEndDate, baselineDays }
```

## 代码示例

```javascript
import { Gantt } from '@visactor/vtable-gantt';

const records = [
  {
    id: 1,
    title: '项目规划',
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
    columns: [{ field: 'title', title: '任务名称', width: 180 }],
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

## 使用建议

- 若希望主任务条与基线条分层展示，设置 `baselinePosition` 为 `top` 或 `bottom` 。
- 若希望对比更紧凑，设置 `baselinePosition: 'overlap'` 以居中重叠绘制。
