import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions } from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';

export function createTable() {
  const records = [
    {
      id: 1,
      title: '项目规划',
      developer: '张三',
      startDate: '2024-07-05',
      endDate: '2024-07-14',
      baselineStartDate: '2024-07-01',
      baselineEndDate: '2024-07-10',
      progress: 80
    },
    {
      id: 2,
      title: '需求分析',
      developer: '李四',
      startDate: '2024-07-08',
      endDate: '2024-07-12',
      baselineStartDate: '2024-07-03',
      baselineEndDate: '2024-07-08',
      progress: 100
    },
    {
      id: 3,
      title: '设计阶段',
      developer: '王五',
      startDate: '2024-07-15',
      endDate: '2024-07-25',
      baselineStartDate: '2024-07-11',
      baselineEndDate: '2024-07-20',
      progress: 40
    },
    {
      id: 4,
      title: '开发阶段',
      developer: '赵六',
      startDate: '2024-07-20',
      endDate: '2024-08-10',
      baselineStartDate: '2024-07-18',
      baselineEndDate: '2024-08-05',
      progress: 30
    },
    {
      id: 5,
      title: '测试阶段',
      developer: '钱七',
      startDate: '2024-08-05',
      endDate: '2024-08-20',
      baselineStartDate: '2024-08-01',
      baselineEndDate: '2024-08-15',
      progress: 0
    },
    {
      id: 6,
      title: '部署上线',
      developer: '孙八',
      startDate: '2024-08-18',
      endDate: '2024-08-25',
      baselineStartDate: '2024-08-15',
      baselineEndDate: '2024-08-22',
      progress: 0
    }
  ];

  const columns: ColumnsDefine = [
    {
      field: 'title',
      title: '任务名称',
      width: 180
    },
    {
      field: 'developer',
      title: '负责人',
      width: 120
    },
    {
      field: 'progress',
      title: '进度',
      width: 80,
      format: (val: number) => `${val}%`
    }
  ];

  const option: GanttConstructorOptions = {
    records: [],
    taskListTable: {
      columns: columns,
      tableWidth: 'auto',
      minTableWidth: 300,
      maxTableWidth: 500
    },
    headerRowHeight: 50,
    rowHeight: 90,
    taskBar: {
      startDateField: 'startDate',
      endDateField: 'endDate',
      progressField: 'progress',
      baselineStartDateField: 'baselineStartDate',
      baselineEndDateField: 'baselineEndDate',
      // baselinePosition: 'top',
      labelText: '{title}',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        color: '#ffffff'
      },
      barStyle: {
        // paddingTop: 50,
        width: 25,
        barColor: '#3498db',
        completedBarColor: '#27ae60',
        cornerRadius: 5
      },
      baselineStyle: {
        // paddingTop: 0,
        width: 15,
        barColor: 'gray',
        cornerRadius: 5
      }
    },
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 50,
      scales: [
        {
          unit: 'month',
          step: 1
        },
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'monday',
          format(date: any) {
            return `W${date.dateIndex}`;
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date: any) {
            return date.dateIndex.toString();
          }
        }
      ]
    },
    minDate: '2024-06-25',
    maxDate: '2024-09-01',
    grid: {
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    overscrollBehavior: 'none'
  };

  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.setRecords(records);

  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}
