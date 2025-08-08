import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

// 生成测试数据
const generateEmployeeData = (count: number) => {
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'IT', 'Design'];
  const positions = [
    'Senior Developer',
    'Marketing Manager',
    'Sales Rep',
    'HR Manager',
    'Financial Analyst',
    'System Admin',
    'UX Designer'
  ];

  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    name: `员工${i + 1}`,
    department: departments[i % 7],
    position: positions[i % 7],
    salary: 65000 + Math.floor(Math.random() * 35000),
    status: 'Active',
    // 只有部分记录有子数据
    children:
      i % 3 === 0
        ? [
            {
              project: `项目A-${i + 1}`,
              role: '负责人',
              startDate: '2024-01-15',
              endDate: '2024-12-31',
              progress: 85
            },
            {
              project: `项目B-${i + 1}`,
              role: '参与者',
              startDate: '2024-03-01',
              endDate: '2024-08-30',
              progress: 92
            },
            {
              project: `项目C-${i + 1}`,
              role: '顾问',
              startDate: '2024-02-10',
              endDate: '2024-11-20',
              progress: 78
            }
          ]
        : undefined
  }));
};

export function createTable() {
  const records = generateEmployeeData(50);

  // 创建主从表插件实例
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'employee-detail-plugin',
    enabled: true,
    hierarchyTextStartAlignment: true,
    
    // 动态子表配置函数 - 与 ListTable 原生示例一致
    getDetailGridOptions: ({ data, tableRowIndex }: { data: unknown; tableRowIndex: number }) => {
      return {
        columnDefs: [
          {
            field: 'project',
            title: '项目名称',
            width: 180
          },
          {
            field: 'role',
            title: '项目角色',
            width: 120
          },
          {
            field: 'startDate',
            title: '开始日期',
            width: 100
          },
          {
            field: 'endDate',
            title: '结束日期',
            width: 100
          },
          {
            field: 'progress',
            title: '项目进度',
            width: 100,
            fieldFormat: (value: number) => `${value}%`
          }
        ],
        style: {
          margin: 20,
          height: 300
        }
      };
    }
  });

  // 主表列定义
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      master: true, // 标记为主从表的主控列
      sort: true
    },
    {
      field: 'name',
      title: '员工姓名',
      width: 120,
      sort: true
    },
    {
      field: 'department',
      title: '部门',
      width: 120,
      sort: true
    },
    {
      field: 'position',
      title: '职位',
      width: 150,
      sort: true
    },
    {
      field: 'salary',
      title: '薪资',
      width: 100,
      sort: true,
      fieldFormat: (value: number) => `$${value.toLocaleString()}`
    },
    {
      field: 'status',
      title: '状态',
      width: 80,
      sort: true
    }
  ];

  // 表格配置选项
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records,
    autoFillWidth: true,
    defaultRowHeight: 40,
    
    // 关键：将插件添加到 plugins 数组中
    plugins: [masterDetailPlugin],
    
    // 添加初始排序状态
    sortState: {
      field: 'id',
      order: 'asc'
    }
  };

  // 创建表格实例
  const tableInstance = new VTable.ListTable(option);
  
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;

  // 绑定调试工具
  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  return tableInstance;
}
