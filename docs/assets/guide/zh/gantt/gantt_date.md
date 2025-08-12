# 甘特图日期相关

## 时间轴日期范围

时间轴日期范围决定了时间轴的显示范围，可以通过`minDate`和`maxDate`来设置。如果没有设置，则默认使用records数据项中`[startDateField]`, `[endDateField]`字段值的最大值和最小值。

## 任务条日期范围

任务条日期范围决定了任务条的显示范围，和records中的数据项`[startDateField]`, `[endDateField]`的字段有关。

## 日期格式Format

VTable-Gantt组件支持对未排期任务进行交互场景新排期，新排期任务的日期格式可以通过配置项`dateFormat`来设置。日期数据将被添加到数据 record 中日期字段值中，默认为'yyyy-mm-dd'。
其他如：
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

组件透出简单的日期格式化工具方法：
```
import { tools } from '@visactor/vtable-gantt';
// 格式化日期
const date = tools.formatDate(new Date(), 'yyyy-mm-dd');
//其他方法 tools.getWeekNumber, tools.getTodayNearDay, tools.getWeekday
```

## 数据项日期要求

正常配置下，数据项的日期要求如下：

- records中`[startDateField]`, `[endDateField]`字段值为日期字符串，格式为`yyyy-mm-dd`

具体的情况需要考虑最小时间粒度`scales`,如果最小时间粒度是时分秒级别，那么数据项的日期要求如下：

- records中`[startDateField]`, `[endDateField]`字段值为日期对象，格式为`yyyy-mm-dd hh:mm:ss`

## 相关接口

- `updateDateRange`：更新日期范围
- `updateDateFormat`：更新日期格式
