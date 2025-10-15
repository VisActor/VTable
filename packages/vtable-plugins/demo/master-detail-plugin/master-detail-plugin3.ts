// 该 case 测试：排序、冻结列行、使用静态 DetailTableOptions
// widthMode, heightMode = 'adaptive'
// widthAdaptiveMode, heightAdaptiveMode = 'all'
import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

function generateData(count: number) {
  const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    // rowNo 用于展示行序号
    rowNo: i + 1,
    name: `姓名 ${i + 1}`,
    department: depts[i % depts.length],
    score: Math.floor(Math.random() * 100),
    amount: Math.floor(Math.random() * 10000) / 100,
    // 仅部分记录含有子表数据
    children:
      i % 4 === 0
        ? [
            { task: `子任务 A-${i + 1}`, status: 'open' },
            { task: `子任务 B-${i + 1}`, status: 'done' }
          ]
        : undefined
  }));
}

export function createTable() {
  const records = generateData(11);

  // 使用静态 DetailTableOptions
  const masterDetailPlugin = new MasterDetailPlugin({
    detailTableOptions: {
      columns: [
        { field: 'task', title: '任务名', width: 220 },
        { field: 'status', title: '状态', width: 120 }
      ],
      defaultRowHeight: 30,
      defaultHeaderRowHeight: 30,
      style: { margin: 12, height: 160 },
      theme: VTable.themes.BRIGHT
    }
  });

  // 主表列定义
  const columns: VTable.TYPES.ColumnsDefine = [
    { field: 'id', title: 'ID', width: 70, sort: true },
    { field: 'rowNo', title: '#', width: 60, headerType: 'text', cellType: 'text' },
    { field: 'name', title: '姓名', width: 140, sort: true },
    { field: 'department', title: '部门', width: 140, sort: true },
    { field: 'score', title: '分数', width: 100, sort: true },
    {
      field: 'amount',
      title: '金额',
      width: 120,
      sort: true,
      fieldFormat: (v: unknown) => {
        if (typeof v === 'number' && !isNaN(v)) {
          return `$${v.toFixed(2)}`;
        }
        // 尽量返回可显示的字符串，避免抛错
        return v === undefined || v === null ? '' : String(v);
      }
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    // 使用 adaptive 模式并对表头/表体都自适应
    widthMode: 'adaptive',
    heightMode: 'adaptive',
    widthAdaptiveMode: 'all',
    heightAdaptiveMode: 'all',
    frozenColCount: 1,
    rightFrozenColCount: 1,
    frozenRowCount: 3,
    autoFillWidth: true,
    rowResizeMode: 'all',
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;
  setTimeout(() => {
    tableInstance.toggleHierarchyState(0, 1);
    tableInstance.toggleHierarchyState(0, 5);
  }, 100);

  return tableInstance;
}
