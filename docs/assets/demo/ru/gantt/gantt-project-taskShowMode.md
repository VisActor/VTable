---
категория: примеры
группа: gantt
заголовок: Gantt Project Task Show Mode
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/gantt/gantt-project-show-mode.gif
ссылка: gantt/gantt_task_show_mode
опция: Gantt#tasksShowMode
---

# Gantt Project Task Show Mode

In the above example, the main purpose is to show the effect of the `Gantt#tasksShowMode` опция. However, the `Project_Sub_Tasks_Inline` mode is special, so it is displayed separately. This mode requires setting the `type` of the data item to `project` to take effect.

## Key Configuration

- `Gantt`
- `Gantt#tasksShowMode`

## Code Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;
const records = [
  {
    id: 0,
    name: 'Planning',
    type: 'project',
    children: [
      {
        id: 1,
        name: 'Michael Smith 1',
        start: '2024-11-15',
        end: '2024-11-15',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
      },
      {
        id: 2,
        name: 'Emily 2',
        start: '2024-11-17',
        end: '2024-11-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        id: 3,
        name: 'Rramily 3',
        start: '2024-11-19',
        end: '2024-11-20',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        id: 4,
        name: 'Lichael Join 4',
        start: '2024-11-21',
        end: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
      }
    ]
  },
  {
    id: 300,
    name: 'Research',
     type: 'project',
    children: [
      {
        id: 5,
        name: 'Ryan 5',
        start: '2024-11-18',
        end: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ]
  },
  {
    name: 'Goal Setting',
    type: 'project',
    children: [
      {
        id: 6,
        name: 'Daniel Davis 6',
        start: '2024-11-21',
        end: '2024-11-22',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg'
      },
      {
        id: 7,
        name: 'Lauren 7',
        start: '2024-11-18',
        end: '2024-11-19',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg'
      }
    ]
  },

  {
    name: 'Strategy',
    type: 'project',
    children: [
      {
        id: 8,
        name: 'Tacarah Siller 8',
        start: '2024-11-20',
        end: '2024-11-21',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        id: 9,
        name: 'Camentew Olision 9',
        start: '2024-11-25',
        end: '2024-11-26',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
      },
      {
        id: 10,
        name: 'Sarah Miller 10',
        start: '2024-11-17',
        end: '2024-11-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        id: 11,
        name: 'Matthew Wilson 11',
        start: '2024-11-22',
        end: '2024-11-25',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
      },
      {
        id: 12,
        name: 'Grarah Poliller 12',
        start: '2024-11-23',
        end: '2024-11-24',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    name: 'Execution',
    type: 'project',
    children: [
      {
        id: 13,
        name: 'Ashley Taylor 13',
        start: '2024-11-22',
        end: '2024-11-25',

        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        id: 14,
        name: 'Megan 14',
        start: '2024-11-27',
        end: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg'
      },
      {
        id: 15,
        name: 'David 15',
        start: '2024-12-10',
        end: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg'
      }
    ]
  },
  {
    name: 'Monitoring',
    type: 'project',
    children: [
      {
        id: 16,
        name: 'Hannah 16',
        start: '2024-11-20',
        end: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        id: 17,
        name: 'Andrew 17',
        start: '2024-12-02',
        end: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/wolf.jpg'
      }
    ]
  },
  {
    name: 'Reporting',
   type: 'project',
    children: [
      {
        id: 18,
        name: 'Joshua Anderson 18',
        start: '2024-12-22',
        end: '2024-12-28',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ]
  },
  {
    name: 'Process review',
   type: 'project',
    children: [
      {
        id: 19,
        name: 'Christopher Moore 19',
        start: '2024-11-25',
        end: '2024-11-30',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/cat.jpg'
      },
      {
        id: 20,
        name: 'Emma 20',
        start: '2024-12-01',
        end: '2024-12-18',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/flower.jpg'
      }
    ]
  }
];

const columns = [
  {
    field: 'имя',
    title: 'PROCESS',
    width: 150,
    tree: true
  }
];
const option = {
  records,
  taskListTable: {
    columns: columns,
    theme: {
      bodyStyle: {
        bgColor: 'white',
        color: 'rgb(115 115 115)'
      },
      headerStyle: {
        color: 'white'
      }
    }
  },
  groupBy: true,
  tasksShowMode: VTableGantt.TYPES.TasksShowMode.Project_Sub_Tasks_Inline,
  frame: {
    outerFrameStyle: {
      borderLineWidth: 1,
      borderColor: '#e1e4e8',
      cornerRadius: 8
    },
    verticalSplitLineMoveable: false
  },
  grid: {
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  },
  headerRowHeight: 60,
  rowHeight: 40,
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{name}',
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      textAlign: 'center',
      color: 'white'
    },
    barStyle: {
      width: 22,
      /** 任务条的颜色 */
      barColor: 'rgb(68 99 244)',
      /** 已完成部分任务条的颜色 */
      completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 15,
      borderColor: 'black',
      borderLineWidth: 1
    }
  },
  dependency: {
    linkCreatable: true,
    links: [
      {
        type: VTableGantt.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 1,
        linkedToTaskKey: 2
      },
      {
        type: VTableGantt.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: 2,
        linkedToTaskKey: 3
      },
      {
        type: VTableGantt.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 3,
        linkedToTaskKey: 5
      },
      {
        type: VTableGantt.TYPES.DependencyType.FinishToFinish,
        linkedFromTaskKey: 5,
        linkedToTaskKey: 4
      },
      {
        type: VTableGantt.TYPES.DependencyType.StartToStart,
        linkedFromTaskKey: 8,
        linkedToTaskKey: 9
      },
      {
        type: VTableGantt.TYPES.DependencyType.FinishToStart,
        linkedFromTaskKey: 9,
        linkedToTaskKey: 10
      }
    ]
  },
  timelineHeader: {
    verticalLine: {
      lineColor: '#e1e4e8',
      lineWidth: 1
    },
    horizontalLine: {
      lineColor: '#e1e4e8',
      lineWidth: 1
    },
    backgroundColor: '#63a8ff',
    scales: [
      {
        unit: 'day',
        step: 1,
        format(date) {
          return date.dateIndex.toString();
        },
        style: {
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white'
        }
      }
    ]
  },
  minDate: '2024-11-14',
  maxDate: '2024-12-31',

  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'none',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c'
  }
};
ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;

```
