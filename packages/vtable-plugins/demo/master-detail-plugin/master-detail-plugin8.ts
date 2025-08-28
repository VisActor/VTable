// 该case是测试分组和主从表的适配
import * as VTable from '@visactor/vtable';
import { MasterDetailPlugin } from '../../src';

const CONTAINER_ID = 'vTable';

// 定义数据记录类型
interface DataRecord {
  'Order ID': string;
  'Customer ID': string;
  'Product Name': string;
  Category: string;
  'Sub-Category': string;
  Region: string;
  City: string;
  'Order Date': string;
  Quantity: number;
  Sales: number;
  Profit: number;
  detailData?: DetailRecord[];
}

interface DetailRecord {
  task: string;
  status: string;
  priority: string;
  assignee: string;
}

interface ThemeArgs {
  col: number;
  row: number;
  table: VTable.ListTable;
}

declare global {
  interface Window {
    tableInstance?: VTable.ListTable;
  }
}

// 主题颜色池
const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];

// 模拟数据
const mockData: DataRecord[] = [
  // Office Supplies - Paper
  {
    'Order ID': 'CA-2015-103800',
    'Customer ID': 'DP-13000',
    'Product Name': 'Message Book, Wirebound, Four 5 1/2" X 4" Forms/Pg., 200 Dup...',
    Category: 'Office Supplies',
    'Sub-Category': 'Paper',
    Region: 'Central',
    City: 'Huntsville',
    'Order Date': '2015/1/7',
    Quantity: 3,
    Sales: 21.78,
    Profit: 6.5343,
    detailData: [
      { task: '子任务 1-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 1-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 1-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-167199',
    'Customer ID': 'ME-17320',
    'Product Name': 'Southworth 25% Cotton Granite Paper & Envelopes',
    Category: 'Office Supplies',
    'Sub-Category': 'Paper',
    Region: 'Central',
    City: 'Huntsville',
    'Order Date': '2015/1/7',
    Quantity: 2,
    Sales: 15.98,
    Profit: 3.196
  },
  {
    'Order ID': 'CA-2015-118192',
    'Customer ID': 'MM-17920',
    'Product Name': 'Xerox 1923',
    Category: 'Office Supplies',
    'Sub-Category': 'Paper',
    Region: 'Central',
    City: 'Huntsville',
    'Order Date': '2015/1/7',
    Quantity: 5,
    Sales: 47.98,
    Profit: 7.197,
    detailData: [
      { task: '子任务 2-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 2-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 2-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-146591',
    'Customer ID': 'TS-21340',
    'Product Name': 'TOPS Carbonless Receipt Book, Four 2-3/4 x 7-1/4 Money Recei...',
    Category: 'Office Supplies',
    'Sub-Category': 'Paper',
    Region: 'Central',
    City: 'Huntsville',
    'Order Date': '2015/1/7',
    Quantity: 2,
    Sales: 31.12,
    Profit: 14.004,
    detailData: [
      { task: '子任务 3-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 3-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 3-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-148614',
    'Customer ID': 'MV-17485',
    'Product Name': 'Wirebound Service Call Books, 5 1/2" x 4"',
    Category: 'Office Supplies',
    'Sub-Category': 'Paper',
    Region: 'Central',
    City: 'Huntsville',
    'Order Date': '2015/1/7',
    Quantity: 3,
    Sales: 21.78,
    Profit: 6.5343
  },
  
  // Office Supplies - Labels
  {
    'Order ID': 'CA-2015-112326',
    'Customer ID': 'PO-19195',
    'Product Name': 'Avery 508',
    Category: 'Office Supplies',
    'Sub-Category': 'Labels',
    Region: 'West',
    City: 'Los Angeles',
    'Order Date': '2015/6/10',
    Quantity: 3,
    Sales: 15.552,
    Profit: 5.4432,
    detailData: [
      { task: '子任务 5-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 5-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 5-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-149020',
    'Customer ID': 'AJ-10780',
    'Product Name': 'Avery 482',
    Category: 'Office Supplies',
    'Sub-Category': 'Labels',
    Region: 'West',
    City: 'Los Angeles',
    'Order Date': '2015/6/10',
    Quantity: 5,
    Sales: 25.92,
    Profit: 9.072
  },
  {
    'Order ID': 'CA-2015-115791',
    'Customer ID': 'DL-13315',
    'Product Name': 'Round Specialty Laser Printer Labels',
    Category: 'Office Supplies',
    'Sub-Category': 'Labels',
    Region: 'West',
    City: 'Los Angeles',
    'Order Date': '2015/6/10',
    Quantity: 2,
    Sales: 10.368,
    Profit: 3.6288,
    detailData: [
      { task: '子任务 6-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 6-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 6-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },

  // Office Supplies - Storage
  {
    'Order ID': 'CA-2015-131905',
    'Customer ID': 'ND-18460',
    'Product Name': 'SAFCO Boltless Steel Shelving',
    Category: 'Office Supplies',
    'Sub-Category': 'Storage',
    Region: 'East',
    City: 'New York',
    'Order Date': '2015/8/15',
    Quantity: 1,
    Sales: 665.88,
    Profit: 132.588,
    detailData: [
      { task: '子任务 7-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 7-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 7-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-168368',
    'Customer ID': 'GA-14725',
    'Product Name': 'File Storage Box',
    Category: 'Office Supplies',
    'Sub-Category': 'Storage',
    Region: 'East',
    City: 'New York',
    'Order Date': '2015/8/15',
    Quantity: 4,
    Sales: 51.84,
    Profit: 15.552
  },

  // Furniture - Chairs
  {
    'Order ID': 'US-2015-108966',
    'Customer ID': 'SO-20335',
    'Product Name': 'Steelcase Think Chair',
    Category: 'Furniture',
    'Sub-Category': 'Chairs',
    Region: 'West',
    City: 'San Francisco',
    'Order Date': '2015/10/11',
    Quantity: 2,
    Sales: 1374.372,
    Profit: 206.1558,
    detailData: [
      { task: '子任务 8-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 8-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 8-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'US-2015-156909',
    'Customer ID': 'BH-11710',
    'Product Name': 'Hon Executive Leather Armchair',
    Category: 'Furniture',
    'Sub-Category': 'Chairs',
    Region: 'West',
    City: 'San Francisco',
    'Order Date': '2015/10/11',
    Quantity: 1,
    Sales: 1499.95,
    Profit: 599.98
  },
  {
    'Order ID': 'CA-2015-115812',
    'Customer ID': 'BM-11650',
    'Product Name': 'Global Troy Executive Leather Low-Back Tilter',
    Category: 'Furniture',
    'Sub-Category': 'Chairs',
    Region: 'West',
    City: 'San Francisco',
    'Order Date': '2015/10/11',
    Quantity: 3,
    Sales: 2235.54,
    Profit: 894.216,
    detailData: [
      { task: '子任务 9-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 9-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 9-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },

  // Furniture - Tables
  {
    'Order ID': 'US-2015-118983',
    'Customer ID': 'CC-12220',
    'Product Name': 'Bretford CR4500 Series Slim Rectangular Table',
    Category: 'Furniture',
    'Sub-Category': 'Tables',
    Region: 'South',
    City: 'Houston',
    'Order Date': '2015/12/5',
    Quantity: 2,
    Sales: 957.5775,
    Profit: 383.031,
    detailData: [
      { task: '子任务 10-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 10-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 10-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-143336',
    'Customer ID': 'PO-19915',
    'Product Name': 'Chromcraft Rectangular Conference Tables',
    Category: 'Furniture',
    'Sub-Category': 'Tables',
    Region: 'South',
    City: 'Houston',
    'Order Date': '2015/12/5',
    Quantity: 1,
    Sales: 1706.184,
    Profit: 85.3092
  },

  // Technology - Phones
  {
    'Order ID': 'US-2015-156147',
    'Customer ID': 'DV-13045',
    'Product Name': 'Cisco SPA 501G IP Phone',
    Category: 'Technology',
    'Sub-Category': 'Phones',
    Region: 'Central',
    City: 'Chicago',
    'Order Date': '2015/11/20',
    Quantity: 4,
    Sales: 213.48,
    Profit: 25.617,
    detailData: [
      { task: '子任务 11-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 11-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 11-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-145317',
    'Customer ID': 'ZD-21925',
    'Product Name': 'Polycom CX600 IP Conference Phone',
    Category: 'Technology',
    'Sub-Category': 'Phones',
    Region: 'Central',
    City: 'Chicago',
    'Order Date': '2015/11/20',
    Quantity: 2,
    Sales: 896.928,
    Profit: 89.6928
  },

  // Technology - Accessories
  {
    'Order ID': 'US-2015-108673',
    'Customer ID': 'EM-14140',
    'Product Name': 'Logitech Wireless Optical Mouse',
    Category: 'Technology',
    'Sub-Category': 'Accessories',
    Region: 'East',
    City: 'Boston',
    'Order Date': '2015/9/3',
    Quantity: 6,
    Sales: 159.984,
    Profit: 63.9936,
    detailData: [
      { task: '子任务 12-A', status: 'open', priority: 'high', assignee: '张三' },
      { task: '子任务 12-B', status: 'done', priority: 'medium', assignee: '李四' },
      { task: '子任务 12-C', status: 'progress', priority: 'low', assignee: '王五' }
    ]
  },
  {
    'Order ID': 'CA-2015-167164',
    'Customer ID': 'KB-16315',
    'Product Name': 'Microsoft Wireless Optical Desktop Elite',
    Category: 'Technology',
    'Sub-Category': 'Accessories',
    Region: 'East',
    City: 'Boston',
    'Order Date': '2015/9/3',
    Quantity: 3,
    Sales: 269.976,
    Profit: 40.4964
  }
];

export function createTable(): VTable.ListTable {
  const columns = [
    {
      field: 'Order ID',
      title: 'Order ID',
      width: 'auto'
    },
    {
      field: 'Customer ID',
      title: 'Customer ID',
      width: 'auto'
    },
    {
      field: 'Product Name',
      title: 'Product Name',
      width: 'auto'
    },
    {
      field: 'Category',
      title: 'Category',
      width: 'auto'
    },
    {
      field: 'Sub-Category',
      title: 'Sub-Category',
      width: 'auto'
    },
    {
      field: 'Region',
      title: 'Region',
      width: 'auto'
    },
    {
      field: 'City',
      title: 'City',
      width: 'auto'
    },
    {
      field: 'Order Date',
      title: 'Order Date',
      width: 'auto'
    },
    {
      field: 'Quantity',
      title: 'Quantity',
      width: 'auto'
    },
    {
      field: 'Sales',
      title: 'Sales',
      width: 'auto'
    },
    {
      field: 'Profit',
      title: 'Profit',
      width: 'auto'
    }
  ];

  // 创建主从表插件
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-grouping-demo',
    // 配置插件使用 detailData 字段而不是默认的 children
    getDetailData: (record: unknown) => (record as DataRecord).detailData || [],
    hasDetailData: (record: unknown) => {
      const data = (record as DataRecord).detailData;
      return Boolean(data && data.length > 0);
    },
    detailGridOptions: {
      columns: [
        { field: 'task', title: '任务名称', width: 200 },
        { field: 'status', title: '状态', width: 100 },
        { field: 'priority', title: '优先级', width: 100 },
        { field: 'assignee', title: '负责人', width: 120 }
      ],
      defaultRowHeight: 32,
      defaultHeaderRowHeight: 36,
      style: { margin: 12, height: 180 },
      theme: VTable.themes.BRIGHT
    }
  });

  const option = {
    records: mockData,
    columns,
    widthMode: 'standard' as const,
    // 分组配置
    groupConfig: {
      groupBy: ['Category', 'Sub-Category'],
      titleFieldFormat: (record: unknown, col: number, row: number, table: VTable.ListTable) => {
        const groupRecord = record as { vtableMergeName: string; children: unknown[] };
        return groupRecord.vtableMergeName + '(' + groupRecord.children.length + ')';
      },
      enableTreeStickCell: true
    },
    // 设置层次展开级别 - 0表示不自动展开任何层级，让用户手动控制
    hierarchyExpandLevel: 0,
    // 主题配置
    theme: VTable.themes.DEFAULT.extends({
      groupTitleStyle: {
        fontWeight: 'bold',
        bgColor: (args: unknown) => {
          const { col, row, table } = args as ThemeArgs;
          const index = table.getGroupTitleLevel(col, row);
          if (index !== undefined) {
            return titleColorPool[index % titleColorPool.length];
          }
          return '#f0f0f0'; // 默认颜色
        }
      }
    }),
    // 添加主从表插件
    plugins: [masterDetailPlugin]
  };

  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    throw new Error(`Container element with id "${CONTAINER_ID}" not found`);
  }

  const tableInstance = new VTable.ListTable(container, option);
  window.tableInstance = tableInstance;
  setTimeout(() => {
    if (masterDetailPlugin.expandRow) {
      masterDetailPlugin.expandRow(3);
    }
  }, 100);
  return tableInstance;
}

// 自动在页面上初始化（如果容器存在）
if (document.getElementById(CONTAINER_ID)) {
  try {
    createTable();
  } catch (e) {
    console.error('初始化表格失败:', e);
  }
}
