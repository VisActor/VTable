// 该case是调整列宽，调整行高，移动表头位置，移动行
// 包含行序号、主从表插件、支持移动行/列/调整宽高等交互功能
// limitMinHeight,limitMinWidth
import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

function generateData(count: number) {
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const depts = ['研发部', '市场部', '销售部', '人事部', '财务部', '运营部'];
  const positions = ['工程师', '经理', '专员', '主管', '总监', '助理'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `${names[i % names.length]}${Math.floor(i / names.length) + 1}`,
    department: depts[i % depts.length],
    position: positions[i % positions.length],
    age: 22 + Math.floor(Math.random() * 30),
    salary: 8000 + Math.floor(Math.random() * 15000),
    score: Math.floor(Math.random() * 100),
    startDate: new Date(
      2020 + Math.floor(Math.random() * 4),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString(),
    // 每5行数据有子表
    children:
      i % 5 === 0
        ? [
            {
              project: `项目 A-${i + 1}`,
              progress: Math.floor(Math.random() * 100) + '%',
              deadline: new Date(
                2024,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
              ).toLocaleDateString(),
              status: Math.random() > 0.5 ? '进行中' : '已完成'
            },
            {
              project: `项目 B-${i + 1}`,
              progress: Math.floor(Math.random() * 100) + '%',
              deadline: new Date(
                2024,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
              ).toLocaleDateString(),
              status: Math.random() > 0.5 ? '进行中' : '已完成'
            },
            {
              project: `项目 C-${i + 1}`,
              progress: Math.floor(Math.random() * 100) + '%',
              deadline: new Date(
                2024,
                Math.floor(Math.random() * 12),
                Math.floor(Math.random() * 28) + 1
              ).toLocaleDateString(),
              status: Math.random() > 0.5 ? '进行中' : '已完成'
            }
          ]
        : undefined
  }));
}

export function createTable() {
  const data = generateData(100);

  // 创建主从表插件
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-interactive-7',
    detailGridOptions: {
      columns: [
        { field: 'project', title: '项目名称', width: 180 },
        { field: 'progress', title: '进度', width: 100 },
        { field: 'deadline', title: '截止日期', width: 120 },
        { field: 'status', title: '状态', width: 100 }
      ],
      defaultRowHeight: 35,
      defaultHeaderRowHeight: 35,
      style: { margin: 15, height: 180 },
      theme: VTable.themes.ARCO
    }
  });

  // 主表列定义
  const columns: VTable.TYPES.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 80
    },
    {
      field: 'name',
      title: '姓名',
      width: 120
    },
    {
      field: 'department',
      title: '部门',
      width: 100
    },
    {
      field: 'position',
      title: '职位',
      width: 100
    },
    {
      field: 'age',
      title: '年龄',
      width: 80
    },
    {
      field: 'salary',
      title: '薪资',
      width: 120
    },
    {
      field: 'score',
      title: '评分',
      width: 80
    },
    {
      field: 'startDate',
      title: '入职日期',
      width: 120
    }
  ];

  const option = {
    records: data,
    columns,
    limitMinHeight: 20,
    limitMinWidth: 20,
    widthMode: 'standard' as const,
    heightMode: 'standard' as const,
    // 行序号配置
    rowSeriesNumber: {
      title: '序号',
      dragOrder: true,
      width: 'auto' as const,
      headerStyle: {
        color: 'black',
        bgColor: 'pink'
      },
      style: {
        color: 'red'
      }
    },
    // 启用各种交互功能
    rowResizeMode: 'all' as const, // 支持调整行高
    columnResizeMode: 'all' as const, // 支持调整列宽
    dragHeaderMode: 'all' as const, // 支持移动表头位置
    // 其他配置
    defaultRowHeight: 40,
    defaultHeaderRowHeight: 45,
    autoWrapText: true,
    limitMaxAutoWidth: 800,
    // 添加主从表插件
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID) as HTMLElement, option);

  // 挂到全局便于调试
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).tableInstance = tableInstance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).masterDetailPlugin = masterDetailPlugin;

  // 绑定调试工具
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  // 展开一些行来展示子表
  setTimeout(() => {
    if (masterDetailPlugin.expandRow) {
      masterDetailPlugin.expandRow(1); // 展开第一行（序号1）
      masterDetailPlugin.expandRow(6); // 展开第六行（序号6）
      masterDetailPlugin.expandRow(11); // 展开第十一行（序号11）
    }
  }, 100);

  return tableInstance;
}

// 自动初始化
createTable();
