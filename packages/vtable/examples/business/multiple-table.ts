import * as VTable from '../../src';
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
    'height: 100%; width: 50%';
container.style =
  'height: 500px; width: 100%;overflow: visible; display: flex; place-content: flex-start; flex-wrap: wrap;';

createTable(container1);
createTable(container2);
createTable(container3);
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
    overscrollBehavior: container === container1 ? 'none' : 'auto'
  };

  const instance = new ListTable(option);
  container === container2 && instance.disableScroll();
  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
