// 该case测试autoFillWidth,autoFillHeight,maxCharactersNumber，maxOperatableRecordCount，limitMaxAutoWidth，showFrozenIcon， autoFillWidth

import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

function generateLongTextData(count: number) {
  const departments = ['前端开发部门', '后端开发部门', '产品设计部门', '数据分析部门', '运营推广部门'];
  const cities = ['北京市海淀区中关村软件园', '上海市浦东新区陆家嘴金融贸易区', '深圳市南山区科技园'];
  const descriptions = [
    '负责公司核心产品的前端开发工作，包括用户界面设计、交互逻辑实现、性能优化等多个方面的技术工作',
    '专注于后端服务架构设计与开发，数据库优化，API接口设计，微服务架构实施等技术领域',
    '从事产品需求分析、用户体验设计、产品原型制作、功能规划等产品相关工作内容',
    '进行大数据分析、用户行为分析、业务数据挖掘、报表制作等数据相关工作',
    '负责市场推广、用户运营、活动策划、品牌宣传等运营相关工作内容和策略制定'
  ];

  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `员工姓名${i + 1}号`,
    department: departments[i % departments.length],
    location: cities[i % cities.length],
    description: descriptions[i % descriptions.length],
    email: `employee${i + 1}@company.com`,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    salary: 8000 + Math.floor(Math.random() * 20000),
    experience: Math.floor(Math.random() * 10) + 1,
    status: Math.random() > 0.3 ? '在职' : '离职',
    joinDate: new Date(
      2018 + Math.floor(Math.random() * 6),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ).toLocaleDateString(),
    // 每3行有子表数据
    children:
      i % 3 === 0
        ? [
            {
              projectName: `重点项目Alpha-${i + 1}`,
              projectDescription: '这是一个非常重要的战略级项目，涉及多个部门协作',
              startDate: '2024-01-15',
              endDate: '2024-12-31',
              progress: Math.floor(Math.random() * 100) + '%',
              priority: '高',
              budget: `${Math.floor(Math.random() * 1000) + 100}万元`
            },
            {
              projectName: `创新项目Beta-${i + 1}`,
              projectDescription: '探索性的创新项目，用于验证新技术方案的可行性',
              startDate: '2024-03-01',
              endDate: '2024-11-30',
              progress: Math.floor(Math.random() * 100) + '%',
              priority: '中',
              budget: `${Math.floor(Math.random() * 500) + 50}万元`
            }
          ]
        : undefined
  }));
}

export function createTable() {
  const data = generateLongTextData(20); // 生成150条记录测试maxOperatableRecordCount

  // 创建主从表插件
  const masterDetailPlugin = new MasterDetailPlugin({
    detailTableOptions: {
      columns: [
        {
          field: 'projectName',
          title: '项目名称',
          width: 200
        },
        {
          field: 'projectDescription',
          title: '项目描述',
          width: 300
        },
        { field: 'startDate', title: '开始日期', width: 120 },
        { field: 'endDate', title: '结束日期', width: 120 },
        { field: 'progress', title: '进度', width: 80 },
        { field: 'priority', title: '优先级', width: 80 },
        { field: 'budget', title: '预算', width: 100 }
      ],
      defaultRowHeight: 40,
      defaultHeaderRowHeight: 40,
      style: { margin: 20, height: 200 },
      theme: VTable.themes.ARCO,
      autoFillWidth: true, // 子表自动填充宽度
      limitMaxAutoWidth: 800 // 限制子表最大自动宽度
    }
  });

  // 主表列定义
  const columns: VTable.TYPES.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID',
      width: 60,
      sort: true
    },
    {
      field: 'name',
      title: '姓名',
      width: 120
    },
    {
      field: 'department',
      title: '部门',
      width: 150
    },
    {
      field: 'location',
      title: '工作地点',
      width: 200
    },
    {
      field: 'description',
      title: '工作描述',
      width: 250
    },
    {
      field: 'email',
      title: '邮箱',
      width: 180
    },
    {
      field: 'phone',
      title: '电话',
      width: 130
    },
    {
      field: 'salary',
      title: '薪资',
      width: 100,
      fieldFormat: (v: unknown) => {
        if (typeof v === 'number' && !isNaN(v)) {
          return `¥${v.toLocaleString()}`;
        }
        return v === undefined || v === null ? '' : String(v);
      }
    },
    {
      field: 'experience',
      title: '工作经验',
      width: 100
    },
    {
      field: 'status',
      title: '状态',
      width: 80
    },
    {
      field: 'joinDate',
      title: '入职日期',
      width: 120
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: data,
    // 容器适配相关配置
    autoFillWidth: true, // 自动填充宽度
    autoFillHeight: true, // 自动填充高度
    limitMaxAutoWidth: 1200, // 限制最大自动宽度
    // 操作记录数限制
    maxOperatableRecordCount: 100, // 最大可操作记录数限制为100
    // 冻结相关配置
    frozenColCount: 2, // 冻结前2列
    showFrozenIcon: true, // 显示冻结图标
    defaultRowHeight: 45,
    defaultHeaderRowHeight: 50,
    // 主题配置
    theme: VTable.themes.ARCO.extends({
      headerStyle: {
        color: '#333',
        bgColor: '#f7f8fa',
        borderColor: '#e1e4e8'
      },
      bodyStyle: {
        borderColor: '#e1e4e8'
      }
    }),
    // 添加主从表插件
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);

  // 展开一些行来展示子表和功能
  setTimeout(() => {
    tableInstance.toggleHierarchyState(0, 1);
    tableInstance.toggleHierarchyState(0, 4);
    tableInstance.toggleHierarchyState(0, 7);
  }, 200);
  // 挂载到全局，方便调试
  (window as unknown as Record<string, unknown>).tableInstance = tableInstance;
  (window as unknown as Record<string, unknown>).masterDetailPlugin = masterDetailPlugin;
  return tableInstance;
}

// 自动初始化
createTable();