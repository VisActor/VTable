import * as VTable from '@visactor/vtable';
import { FilterPlugin } from '../../src/filter';

const CONTAINER_ID = 'vTable';

const generateDemoData = (count: number) => {
  const departments = ['研发部', '市场部', '销售部', '人事部', '财务部'];
  const statuses = ['在职', '请假', '离职'];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    age: 22 + (i % 20),
    department: departments[i % departments.length],
    salary: 5000 + i * 300,
    status: statuses[i % statuses.length],
    isFullTime: i % 3 !== 0,
    status1: statuses[(i + 1) % statuses.length],
    status2: statuses[(i + 2) % statuses.length],
    status3: statuses[i % statuses.length],
    status4: statuses[(i + 1) % statuses.length],
    status5: statuses[(i + 2) % statuses.length]
  }));
};

export function createTable() {
  const container = document.getElementById(CONTAINER_ID)!;
  container.style.width = '800px';
  container.style.height = '500px';

  const filterPlugin = new FilterPlugin({
    filterModes: ['byValue', 'byCondition']
  });

  const tableInstance = new VTable.ListTable({
    container,
    records: generateDemoData(50),
    columns: [
      { field: 'id', title: 'ID', width: 60 },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄', width: 100 },
      { field: 'department', title: '部门', width: 120 },
      {
        field: 'salary',
        title: '薪资',
        width: 120,
        fieldFormat: record => `￥${record.salary}`
      },
      { field: 'status', title: '状态', width: 100 },
      { field: 'isFullTime', title: '全职', width: 80, cellType: 'checkbox' },
      { field: 'status1', title: '状态1', width: 100 },
      { field: 'status2', title: '状态2', width: 100 },
      { field: 'status3', title: '状态3', width: 100 },
      { field: 'status4', title: '状态4', width: 100 },
      { field: 'status5', title: '状态5', width: 100 }
    ],
    plugins: [filterPlugin]
  });

  window.tableInstance = tableInstance;
}
