import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  // 模拟主从表格数据
  const records = [
    {
      id: 1,
      name: 'John Doe',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      department: 'Marketing',
      position: 'Marketing Manager',
      salary: 87000,
      status: 'Active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 65000,
      status: 'Active'
    },
    {
      id: 4,
      name: 'Alice Brown',
      department: 'HR',
      position: 'HR Manager',
      salary: 82000,
      status: 'Active'
    },
    {
      id: 5,
      name: 'Bob Wilson',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 72000,
      status: 'Active'
    }
  ];

  // 主表列定义
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      tree: true // 启用树形图标，用于展开/收起功能
    },
    {
      field: 'name',
      title: 'Employee Name',
      width: 150
    },
    {
      field: 'department',
      title: 'Department',
      width: 120
    },
    {
      field: 'position',
      title: 'Position',
      width: 160
    },
    {
      field: 'salary',
      title: 'Salary',
      width: 100
    },
    {
      field: 'status',
      title: 'Status',
      width: 100
    }
  ];

  // 配置选项
  const option: VTable.MasterDetailTableConstructorOptions = {
    columns,
    records,

    // 主从表格特有配置
    expandedRows: [0], // 默认展开第1行
    detailRowHeight: 100, // 子表区域高度

    // 基础表格配置
    widthMode: 'standard' as const
  };

  // 创建 MasterDetailTable 实例
  const tableInstance = new VTable.MasterDetailTable(document.getElementById(CONTAINER_ID) as HTMLElement, option);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).tableInstance = tableInstance;

  return tableInstance;
}

