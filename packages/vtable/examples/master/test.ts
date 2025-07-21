import * as VTable from '../../src';

const CONTAINER_ID = 'vTable';

export function createTable() {
  // 模拟主从表格数据 - 部分记录包含 children 数据
  const records = [
    {
      id: 1,
      name: 'John Doe',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      status: 'Active',
      children: [
        { project: 'A系统', role: '开发' },
        { project: 'B系统', role: '测试' },
        { project: 'C系统', role: '架构设计' }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      department: 'Marketing',
      position: 'Marketing Manager',
      salary: 87000,
      status: 'Active'
      // 没有 children，不会显示展开图标
    },
    {
      id: 3,
      name: 'Mike Johnson',
      department: 'Sales',
      position: 'Sales Representative',
      salary: 65000,
      status: 'Active',
      children: [
        { project: 'D系统', role: '需求分析' },
        { project: 'E系统', role: '用户培训' }
      ]
    },
    {
      id: 4,
      name: 'Alice Brown',
      department: 'HR',
      position: 'HR Manager',
      salary: 82000,
      status: 'Active'
      // 没有 children
    },
    {
      id: 5,
      name: 'Bob Wilson',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 72000,
      status: 'Active',
      // children: [
      //   { project: 'F系统', role: '财务分析' },
      //   { project: 'G系统', role: '预算管理' },
      //   { project: 'H系统', role: '成本核算' },
      //   { project: 'I系统', role: '报表生成' }
      // ]
    },
    {
      id: 6,
      name: 'Carol Davis',
      department: 'IT',
      position: 'System Admin',
      salary: 68000,
      status: 'Active'
      // 没有 children
    },
    {
      id: 7,
      name: 'David Lee',
      department: 'Engineering',
      position: 'Frontend Developer',
      salary: 78000,
      status: 'Active',
      children: [
        { project: 'J系统', role: 'UI设计' },
        { project: 'K系统', role: '前端开发' },
        { project: 'G系统', role: '预算管理' },
        { project: 'H系统', role: '成本核算' },
        { project: 'I系统', role: '报表生成' }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      children: [
        { project: 'A系统', role: '开发' },
        { project: 'B系统', role: '测试' },
        { project: 'C系统', role: '架构设计' }
      ]
    },
    {
      id: 9,
      name: 'Frank Miller',
      department: 'Engineering',
      position: 'Backend Developer',
      salary: 85000,
      status: 'Active',
      children: [
        { project: 'L系统', role: '后端开发' },
        { project: 'M系统', role: '数据库设计' },
        { project: 'N系统', role: 'API开发' }
      ]
    },
    {
      id: 10,
      name: 'Grace Taylor',
      department: 'QA',
      position: 'QA Engineer',
      salary: 70000,
      status: 'Active',
      children: [
        { project: 'A系统', role: '开发' },
        { project: 'B系统', role: '测试' },
        { project: 'C系统', role: '架构设计' }
      ]
    }
  ];

  // 主表列定义
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 200,
      tree: true // 启用树形图标，用于展开/收起功能
    },
    {
      field: 'name',
      title: 'Employee Name',
      width: 200,
    },
    {
      field: 'department',
      title: 'Department',
      width: 200,
    },
    {
      field: 'position',
      title: 'Position',
      width: 200,
    },
    {
      field: 'salary',
      title: 'Salary',
      width: 200,
    },
    {
      field: 'status',
      title: 'Status',
      width: 200,
    }
  ];

  // 子表配置
  const detailGridOptions = {
    type: 'ListTable' as const,
    columnDefs: [
      { field: 'project', title: '项目名称', width: 200 },
      { field: 'role', title: '角色', width: 150 }
    ],
    style: {
      margin: 16,
      height: 300
    }
  };

  // 配置选项
  const option: VTable.MasterDetailTableConstructorOptions = {
    columns,
    records,
    detailGridOptions,
    autoFillWidth: true
  };

  // 创建 MasterDetailTable 实例（父表）
  const tableInstance = new VTable.MasterDetailTable(document.getElementById(CONTAINER_ID) as HTMLElement, option);
  
  // 将表格实例挂载到 window 对象上，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
}

