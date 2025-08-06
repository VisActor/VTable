import * as VTable from '../../src';
import { sort } from '../../src/tools/sort';

const CONTAINER_ID = 'vTable';

export function createTable() {
  // 模拟员工数据，包含项目详情
  const records = [
    {
      id: 1,
      name: 'John Doe',
      department: 'Engineering',
      position: 'Senior Developer',
      salary: 95000,
      status: 'Active',
      children: [
        { project: 'VTable开发', role: '核心开发', startDate: '2024-01-15', endDate: '2024-12-31', progress: 85 },
        { project: '性能优化', role: '技术专家', startDate: '2024-03-01', endDate: '2024-08-30', progress: 92 },
        { project: '架构设计', role: '架构师', startDate: '2024-02-10', endDate: '2024-11-20', progress: 78 }
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
        { project: '客户关系管理', role: '客户经理', startDate: '2024-01-01', endDate: '2024-12-31', progress: 68 },
        { project: '市场推广', role: '推广专员', startDate: '2024-04-01', endDate: '2024-10-31', progress: 55 }
      ]
    },
    {
      id: 4,
      name: 'Alice Brown',
      department: 'HR',
      position: 'HR Manager',
      salary: 82000,
      status: 'Active',
      children: [
        { project: '招聘计划', role: 'HR负责人', startDate: '2024-01-01', endDate: '2024-12-31', progress: 72 },
        { project: '员工培训', role: '培训师', startDate: '2024-02-15', endDate: '2024-11-30', progress: 89 },
        { project: '绩效考核', role: '考核专员', startDate: '2024-03-01', endDate: '2024-12-15', progress: 45 }
      ]
    },
    {
      id: 5,
      name: 'Bob Wilson',
      department: 'Finance',
      position: 'Financial Analyst',
      salary: 72000,
      status: 'Active',
      children: [
        { project: '财务分析', role: '分析师', startDate: '2024-01-10', endDate: '2024-12-20', progress: 83 },
        { project: '预算管理', role: '预算专员', startDate: '2024-02-01', endDate: '2024-11-30', progress: 91 },
        { project: '成本控制', role: '成本分析', startDate: '2024-03-15', endDate: '2024-09-30', progress: 76 }
      ]
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
        { project: 'UI组件库', role: '前端开发', startDate: '2024-01-20', endDate: '2024-10-31', progress: 94 },
        { project: '移动端适配', role: 'H5开发', startDate: '2024-04-01', endDate: '2024-08-15', progress: 67 },
        { project: '用户体验优化', role: 'UX开发', startDate: '2024-05-01', endDate: '2024-12-31', progress: 52 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 11,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 8,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    },
    {
      id: 12,
      name: 'Emma White',
      department: 'Design',
      position: 'UX Designer',
      salary: 75000,
      status: 'Active',
      hierarchyState: VTable.TYPES.HierarchyState.collapse, // 初始为折叠状态
      children: [
        { project: '设计系统', role: 'UI设计师', startDate: '2024-01-05', endDate: '2024-09-30', progress: 88 },
        { project: '用户研究', role: 'UX研究员', startDate: '2024-02-20', endDate: '2024-11-15', progress: 71 }
      ]
    }
  ];

  // 主表列定义
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
      master: true,
      sort: true, // 禁用ID列排序
    },
    {
      field: 'name',
      title: 'Employee Name',
      width: 150,
      sort: true, // 启用姓名排序
    },
    {
      field: 'department',
      title: 'Department', 
      width: 120,
      sort: true, // 启用部门排序
    },
    {
      field: 'position',
      title: 'Position',
      width: 160,
      sort: true, // 启用职位排序
    },
    {
      field: 'salary',
      title: 'Salary',
      width: 100,
      sort: true, // 启用薪资排序
      fieldFormat(value) {
        return `$${value.toLocaleString()}`;
      }
    },
    {
      field: 'status',
      title: 'Status',
      width: 80,
      sort: true, // 启用状态排序
    }
  ];

  // 子表配置 - 动态配置函数
  const getDetailGridOptions = ({ data, rowIndex }: { data: unknown; rowIndex: number }) => {
    return {
      type: 'ListTable' as const,
      columnDefs: [
        {
          field: 'project',
          title: '项目名称',
          width: 150
        },
        {
          field: 'role',
          title: '角色',
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
          title: '进度',
          width: 80
        }
      ],
      style: {
        margin: 20,
        height: 300
      }
    };
  };

  // 配置选项 - 使用 master 系统，基于 masterDetail 基础设施
  const option: VTable.ListTableConstructorOptions = {
    columns,
    records,
    masterDetail: true, // 启用主从表基础设施，master 系统依赖这个
    getDetailGridOptions, // 提供子表配置函数
    autoFillWidth: true,
    hierarchyTextStartAlignment: true, // 启用层级文本对齐
    // 添加初始排序状态 - 按 name 字段升序排序
    sortState: {
      field: 'id',
      order: 'asc'
    }
  };

  // 创建 ListTable 实例，启用主从表格功能
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID) as HTMLElement, option);
  return tableInstance;
}
