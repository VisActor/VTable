// 子表事件监听示例 - 展示所有子表事件的使用
import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src/master-detail-plugin';

const CONTAINER_ID = 'vTable';

function generateData(count: number) {
  const depts = ['工程部', '市场部', '销售部', '人事部', '财务部'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    rowNo: i + 1,
    name: `用户 ${i + 1}`,
    department: depts[i % depts.length],
    score: Math.floor(Math.random() * 100),
    amount: Math.floor(Math.random() * 10000) / 100,
    children:
      i % 3 === 0
        ? [
            { task: `子任务 A-${i + 1}`, status: 'open' },
            { task: `子任务 B-${i + 1}`, status: 'done' }
          ]
        : undefined
  }));
}

export function createTable() {
  const records = generateData(11);

  // 创建主从表插件实例
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-events-demo',
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
      fieldFormat: v => {
        if (typeof v === 'number' && !isNaN(v)) {
          return `$${v.toFixed(2)}`;
        }
        return v === undefined || v === null ? '' : String(v);
      }
    }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    autoFillWidth: true,
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);

  // 统一监听所有子表事件
  tableInstance.on(VTable.TABLE_EVENT_TYPE.PLUGIN_EVENT, args => {
    // 只处理来自主从表插件的事件
    if (args.plugin === masterDetailPlugin) {
      const eventInfo = args.pluginEventInfo;
      console.log(eventInfo);
    }
  });

  return tableInstance;
}