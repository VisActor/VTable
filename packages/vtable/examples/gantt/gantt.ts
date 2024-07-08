import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2019-07-04',
      end: '2019-07-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-06',
      end: '2024-07-08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-09',
      end: '2024-07-11',
      progress: 100,
      priority: 'P1'
    }
  ];

  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      sort: true
    },
    {
      field: 'title',
      title: 'title',
      width: 200,
      sort: true
    },
    {
      field: 'priority',
      title: 'priority',
      width: 200,
      sort: true
    },

    {
      field: 'progress',
      title: 'progress',
      width: 200,
      sort: true
    }
  ];
  const option: VTable.GanttConstructorOptions = {
    records,
    columns,
    infoTableWidth: 300,
    startField: 'start',
    endField: 'end',
    scales: [
      {
        unit: 'month',
        step: 1,
        format(date: Date) {
          return date.toLocaleString('default', { day: '2-digit' });
        }
      },
      {
        unit: 'day',
        step: 3,
        format(date: Date) {
          return date.toLocaleString('default', { day: '2-digit' });
        }
      }
    ],
    minDate: '2024-07-01',
    maxDate: '2024-07-31'
  };
  // columns:[
  //   {
  //     title:'2024-07',
  //     columns:[
  //       {
  //         title:'01'
  //       },
  //       {
  //         title:'02'
  //       },
  //       ...
  //     ]
  //   },
  //   ...
  // ]
  const tableInstance = new VTable.Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = tableInstance;
}
