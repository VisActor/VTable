# 日历图

日历图是一种常见的表格，用于展示日期和相应的日程安排。VTable-Calendar 是一款基于 VTable 表格组件开发的日历图组件，用户可以快速实现一个日历工具，也可以基于VTable的强大能力自定义相关的业务功能。相比于传统日历图，VTable-Calendar 具有以下优势：

- 无级滚动功能，支持跨月、跨年滚动
- 熟悉VTable api的用户可以快速上手定制功能

## 日历图的基础配置

在创建日历图时，可以传入日历日对应的配置：

```js
import { Calendar } from '@visactor/vtable-calendar';

const calendar = new Calendar(domContainer, options);
```

其中，option支持下列属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| startDate | Date | 日历开始的日期 |
| endDate | Date | 日历结束的日期 |
| currentDate | Date | 日历当天显示的日期 |
| rangeDays | number | 日历显示的天数范围（如果没有配置startDate&endDate，会从currentDate取前后rangeDays的日期作为startDate&endDate，默认90天） |
| dayTitles | string[] | 日历的标题（可以替换为不同语言） |
| customEventOptions | ICustomEventOptions | 自定义日程的配置 |
| customEvents | ICustomEvent[] | 自定义日程的数组 |
| tableOptions | ListTableConstructorOptions | 日历表格的配置（这里的配置会被传给对应的VTable实例，用于深度自定义） |

`tableOptions` 配置的属性可以参考 [VTable的配置](../../option/ListTable)，用于表格的进一步配置。例如，如果希望日历图标题中周六显示为蓝色，周日显示为红色，可以使用以下配置：

```javascript livedemo template=vtable
const calendarInstance = new VTableCalendar.Calendar(document.getElementById(CONTAINER_ID), {
  tableOptions: {
    theme: {
      headerStyle: {
        color: args => {
          if (args.col === 0) {
            return 'red';
          } else if (args.col === 6) {
            return 'blue';
          }
          return '#000';
        }
      }
    }
  },
});
window['calendarInstance'] = calendarInstance;
```

## 日历图的自定义日程

Calendar支持两种自定义日程的方式，一种为单日内的日程，一种为跨多天的日程。自定义日程的配置如下：

```ts
export interface ICustomEvent {
  type: 'list' | 'bar'; // 日程类型，list为单日内的日程，bar为跨多天的日程
  id: string; // 日程的id，用于区分不同的日程

  startDate?: Date; // 日程的开始日期（用于跨多天的日程）
  endDate?: Date; // 日程的结束日期（用于跨多天的日程）
  date?: Date;  // 日程的日期（用于单日内的日程）

  text: string;
  color?: string; // text color
  bgColor?: string; // bar background color

  customInfo?: any; // user custom data
}
```

自定义日程可以在初始化时配置，也可以通过API进行动态添加、删除、更新。

初始化时配置：
```ts
const calendar = new Calendar(document.getElementById(CONTAINER_ID), {
  customEvents: [
    {
      date: new Date(2024, 9, 23),
      text: 'Event A',
      id: 'Event A',
      type: 'list',
      color: '#f99'
    },
    {
      id: 'Event B',
      startDate: new Date(2024, 9, 21),
      endDate: new Date(2024, 9, 23),
      text: 'Event B',
      type: 'bar',
      bgColor: '#f99',
      color: '#fff'
    }
  ]
});
```

动态添加、删除、更新：
```ts
// 添加
calendar.addCustomEvent({
  id: 'Event C',
  startDate: new Date(2024, 9, 22),
  endDate: new Date(2024, 10, 4),
  text: 'Event C',
  type: 'bar',
  bgColor: '#9f9',
  color: '#fff'
});

// 删除
calendar.removeCustomEvent('Event C');

// 更新
calendar.updateCustomEvent({
  id: 'Event C', // 通过id更新
  startDate: new Date(2024, 9, 22),
  endDate: new Date(2024, 9, 30),
});
```

自定义日程相关API
| 方法 | 参数 | 说明 |
| --- | --- | --- |
| addCustomEvent | ICustomEvent | 添加自定义日程 |
| addCustomEvents | ICustomEvent[] | 批量添加自定义日程 |
| removeCustomEvent | string | 删除自定义日程 |
| removeCustomEvents | string[] | 批量删除自定义日程 |
| updateCustomEvent | ICustomEvent | 更新自定义日程 |
| updateCustomEvents | ICustomEvent[] | 批量更新自定义日程 |

## 日历图的事件

Calendar支持以下事件：

| 事件名 | 说明 |
| --- | --- |
| calendar_date_click | 点击日历日时触发 |
| selected_date | 选中日期时触发 |
| selected_date_clear | 取消选中日期时触发 |
| drag_select_date_end | 拖拽选择日期结束时触发 |
| calendar_custom_event_click | 点击自定义日程时触发 |

如果需要进一步的事件处理，可以通过`calendarInstance.table.on()`监听VTable的所有事件。