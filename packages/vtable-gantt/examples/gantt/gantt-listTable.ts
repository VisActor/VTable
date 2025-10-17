import * as VTable from '@visactor/vtable';
import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { Gantt } from '../../src/index';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
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

const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

const container = document.getElementById(CONTAINER_ID)!;
// const parent = container.container;
const container1 = document.createElement('div');
container.appendChild(container1);
const container2 = document.createElement('div');
container.appendChild(container2);
const container3 = document.createElement('div');
container.appendChild(container3);
const container4 = document.createElement('div');
container.appendChild(container4);
const container5 = document.createElement('div');
container.appendChild(container5);
// container.style =
container1.style =
  container2.style =
  container3.style =
  container4.style =
  container5.style =
    'height: 100%; width: 50%; position:relative';
container.style =
  'height: 500px; width: 100%;overflow: visible; display: flex; place-content: flex-start; flex-wrap: wrap;';

createTable(container1);
createTable(container2);
createGantt(container3);
createTable(container4);
createTable(container5);
export function createTable(container) {
  const records = generatePersons(100);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 120,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
    },
    {
      field: 'sex',
      title: 'sex',
      width: 100
    },
    {
      field: 'tel',
      title: 'telephone',
      width: 150
    },
    {
      field: 'work',
      title: 'job',
      width: 200
    },
    {
      field: 'city',
      title: 'city',
      width: 150
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: container,
    columns,
    records,
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    overscrollBehavior: container === container1 ? 'none' : 'auto',
    theme: VTable.themes.ARCO
  };

  const instance = new ListTable(option);
  container === container2 && instance.disableScroll();
  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}

export function createGantt(container) {
  const records = [
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-01',
      end: '2024-08-14',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-04',
      end: '2024-08-04',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/05',
      end: '2024/08/04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-04',
      end: '2024-08-04',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/24/2024',
      end: '08/04/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
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
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-30',
      end: '2024-08-14',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/24',
      end: '2024/08/04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-08-04',
      end: '2024-08-04',
      progress: 90,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07/24/2024',
      end: '08/04/2024',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
      progress: 31,
      priority: 'P0'
    },
    {
      id: 2,
      title: 'Scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024.07.06',
      end: '2024.07.08',
      progress: 60,
      priority: 'P0'
    },
    {
      id: 3,
      title: 'Determine project scope',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024/07/09',
      end: '2024/07/11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '07.24.2024',
      end: '08.04.2024',
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
      start: '2024-08-09',
      end: '2024-09-11',
      progress: 100,
      priority: 'P1'
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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
    },
    {
      id: 1,
      title: 'Software Development',
      developer: 'liufangfang.jane@bytedance.com',
      start: '2024-07-24',
      end: '2024-08-04',
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

  const columns: ColumnsDefine = [
    // {
    //   field: 'id',
    //   title: 'ID',
    //   width: 80,
    //   sort: true
    // },
    {
      field: 'title',
      title: 'title',
      width: 200,
      sort: true
    },
    {
      field: 'start',
      title: 'start',
      width: 150,
      sort: true
    },
    {
      field: 'end',
      title: 'end',
      width: 150,
      sort: true
    },
    {
      field: 'priority',
      title: 'priority',
      width: 100,
      sort: true
    },

    {
      field: 'progress',
      title: 'progress',
      width: 200,
      sort: true
    }
  ];
  const option: GanttConstructorOptions = {
    records,
    taskListTable: {
      columns: columns,
      tableWidth: 100,
      minTableWidth: 100,
      maxTableWidth: 300,
      theme: VTable.themes.ARCO
    },

    frame: {
      verticalSplitLineMoveable: true,
      outerFrameStyle: {
        borderLineWidth: 2,
        borderColor: 'red',
        cornerRadius: 8
      },
      verticalSplitLine: {
        lineWidth: 3,
        lineColor: '#e1e4e8'
      },
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 3
      }
    },
    grid: {
      // backgroundColor: 'gray',
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    headerRowHeight: 60,
    rowHeight: 40,

    taskBar: {
      selectable: false,
      startDateField: 'start',
      endDateField: 'end',
      progressField: 'progress',
      labelText: '{title} {progress}%',
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 16,
        textAlign: 'left'
      },
      barStyle: {
        width: 20,
        /** 任务条的颜色 */
        barColor: '#ee8800',
        /** 已完成部分任务条的颜色 */
        completedBarColor: '#91e8e0',
        /** 任务条的圆角 */
        cornerRadius: 10
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
      colWidth: 60,
      zoomScale: {
        enabled: true,
        dataZoomAxis: {
          enabled: true,
          height: 30,
          delayTime: 1
        },
        levels: [
          // 级别0：月-周组合 (最粗糙)
          [
            {
              unit: 'month',
              step: 1,
              format: date => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
              }
            },
            {
              unit: 'week',
              step: 1,
              format: date => {
                const weekNum = Math.ceil(
                  (date.startDate.getDate() +
                    new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                    7
                );
                return `Week ${weekNum}`;
              }
            }
          ],
          // 级别1：月-日组合
          [
            {
              unit: 'month',
              step: 1,
              format: date => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
              }
            },
            {
              unit: 'week',
              step: 1,
              format: date => {
                const weekNum = Math.ceil(
                  (date.startDate.getDate() +
                    new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                    7
                );
                return `Week ${weekNum}`;
              }
            },
            {
              unit: 'day',
              step: 4,
              format: date => date.startDate.getDate().toString()
            }
          ],
          // 级别2：月-周-日组合
          [
            {
              unit: 'month',
              step: 1,
              format: date => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
              }
            },
            {
              unit: 'week',
              step: 1,
              format: date => {
                const weekNum = Math.ceil(
                  (date.startDate.getDate() +
                    new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                    7
                );
                return `Week ${weekNum}`;
              }
            },
            {
              unit: 'day',
              step: 1,
              format: date => date.startDate.getDate().toString()
            }
          ],
          // 级别3：周-日-小时组合 (12小时)
          [
            {
              unit: 'week',
              step: 1,
              format: date => {
                const weekNum = Math.ceil(
                  (date.startDate.getDate() +
                    new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                    7
                );
                return `Week ${weekNum}`;
              }
            },
            {
              unit: 'day',
              step: 1,
              format: date => {
                const day = date.startDate.getDate();
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${day} ${monthNames[date.startDate.getMonth()]}`;
              }
            },
            {
              unit: 'hour',
              step: 12,
              format: date => {
                const startHour = date.startDate.getHours();
                const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
                return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
              }
            }
          ],
          // 级别4：日-小时组合 (6小时)
          [
            {
              unit: 'day',
              step: 1,
              format: date => {
                const day = date.startDate.getDate();
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${day} ${monthNames[date.startDate.getMonth()]}`;
              }
            },
            {
              unit: 'hour',
              step: 6,
              format: date => {
                const startHour = date.startDate.getHours();
                const endHour = date.endDate.getHours() - 1; // 结束时间减1小时，然后显示59分
                return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
              }
            }
          ],
          // 级别5：日-小时组合 (1小时)
          [
            {
              unit: 'day',
              step: 1,
              format: date => {
                const day = date.startDate.getDate();
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${day} ${monthNames[date.startDate.getMonth()]}`;
              }
            },
            {
              unit: 'hour',
              step: 1,
              format: date => {
                const hour = date.startDate.getHours();
                return `${hour.toString().padStart(2, '0')}:00`;
              }
            }
          ]
        ]
      },
      scales: [
        {
          unit: 'week',
          step: 1,
          startOfWeek: 'sunday',
          format(date: TYPES.DateFormatArgumentType) {
            return `Week ${date.dateIndex}`;
          },
          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red'
          }
        },
        {
          unit: 'day',
          step: 1,
          format(date: TYPES.DateFormatArgumentType) {
            return date.dateIndex.toString();
          },
          style: {
            fontSize: 20,
            fontWeight: 'bold',
            color: 'red'
          }
        }
        // {
        //   unit: 'quarter',
        //   step: 1,
        //   format(date: TYPES.DateFormatArgumentType) {
        //     return '第' + date.index + '季度';
        //   }
        // }
      ]
    },
    minDate: '2024-07-01',
    maxDate: '2024-10-15',
    markLine: [
      {
        date: '2024-07-17',
        style: {
          lineWidth: 1,
          lineColor: 'blue',
          lineDash: [8, 4]
        }
      },
      {
        date: '2024-08-17',
        position: 'middle',
        scrollToMarkLine: true,
        style: {
          lineWidth: 2,
          lineColor: 'red',
          lineDash: [8, 4]
        }
      }
    ],
    rowSeriesNumber: {
      title: '行号',
      dragOrder: true,
      headerStyle: {
        bgColor: '#EEF1F5',

        borderColor: '#e1e4e8'
      },
      style: {
        borderColor: '#e1e4e8'
      }
    },
    scrollStyle: {
      visible: 'scrolling'
    },
    overscrollBehavior: 'none'
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
  const ganttInstance = new Gantt(container, option);
  window.ganttInstance = ganttInstance;
}
