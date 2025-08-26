# 主从表插件

## 功能介绍

MasterDetailPlugin插件为ListTable提供了主从表功能，旨在实现不同数据更好的展示

### 注意事项
- 请不要使用转置功能
- 请不要把tree和主从表一起用

## 插件配置

### MasterDetailPluginOptions

插件构造函数接受一个配置对象，该对象需要实现 `MasterDetailPluginOptions` 接口。以下为完整的配置参数说明：

```
interface MasterDetailPluginOptions {
  id?: string;
  /** 子表配置 - 可以是静态配置对象或动态配置函数 */
  detailGridOptions?: DetailGridOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions);
  /** 自定义获取详情数据的函数，默认使用record.children */
  getDetailData?: (record: unknown) => unknown[];
  /** 自定义检查是否有详情数据的函数，默认检查record.children */
  hasDetailData?: (record: unknown) => boolean;
}

interface DetailGridOptions extends VTable.ListTableConstructorOptions {
  // 这个style配置的是展开的子表的宽度和margin
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}
```

## 使用方式

### 插件初始化

首先需要创建插件实例并将其添加到 VTable 的插件配置中：

```ts
// 初始化插件
  const masterDetailPlugin = new MasterDetailPlugin({
    id: 'master-detail-static-2',
    detailGridOptions: {
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
```

### 用法示例

首先确保你使用了MasterDetailPlugin插件，然后他会去根据hasDetailData中配置的去检查用户配置的record中是否配置了相关子表，如果没有配置hasDetailData和getDetailData那么默认是children

```javascript livedemo template=vtable
function generateData(count) {
  const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    rowNo: i + 1,
    name: `姓名 ${i + 1}`,
    department: depts[i % depts.length],
    score: Math.floor(Math.random() * 100),
    amount: Math.floor(Math.random() * 10000) / 100,
    children:
      i % 4 === 0
        ? [
            { task: `子任务 A-${i + 1}`, status: 'open' },
            { task: `子任务 B-${i + 1}`, status: 'done' }
          ]
        : undefined
  }));
}

function createTable() {
  const records = generateData(11);

  // 使用静态 DetailGridOptions
  const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'master-detail-static-3',
    detailGridOptions: {
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
  const columns = [
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
      fieldFormat: (v) => {
        if (typeof v === 'number' && !isNaN(v)) {
          return `$${v.toFixed(2)}`;
        }
        // 尽量返回可显示的字符串，避免抛错
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

  return tableInstance;
}

createTable();
```

当你要和分组这样本身就依赖children的一同使用的话，就请使用hasDetailData和getDetailData来让主从表使用不同的数据源

```javascript livedemo template=vtable
function createGroupTable() {
  // 模拟数据 - 注意这里使用detailData而不是children，因为children被分组功能占用
  const mockData = [
    {
      'Order ID': 'CA-2015-103800',
      'Product Name': 'Message Book',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 21.78,
      Profit: 6.53,
      detailData: [
        { task: '子任务 1-A', status: 'open', priority: 'high', assignee: '张三' },
        { task: '子任务 1-B', status: 'done', priority: 'medium', assignee: '李四' }
      ]
    },
    {
      'Order ID': 'CA-2015-167199',
      'Product Name': 'Granite Paper',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 15.98,
      Profit: 3.19
    },
    {
      'Order ID': 'CA-2015-118192',
      'Product Name': 'Xerox 1923',
      Category: 'Office Supplies',
      'Sub-Category': 'Paper',
      Region: 'Central',
      Sales: 47.98,
      Profit: 7.19,
      detailData: [
        { task: '子任务 2-A', status: 'progress', priority: 'high', assignee: '王五' },
        { task: '子任务 2-B', status: 'done', priority: 'low', assignee: '赵六' }
      ]
    },
    {
      'Order ID': 'CA-2015-112326',
      'Product Name': 'Avery 508',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      Region: 'West',
      Sales: 15.55,
      Profit: 5.44,
      detailData: [
        { task: '子任务 3-A', status: 'open', priority: 'medium', assignee: '张三' }
      ]
    },
    {
      'Order ID': 'US-2015-108966',
      'Product Name': 'Think Chair',
      Category: 'Furniture',
      'Sub-Category': 'Chairs',
      Region: 'West',
      Sales: 1374.37,
      Profit: 206.15,
      detailData: [
        { task: '子任务 4-A', status: 'done', priority: 'high', assignee: '李四' },
        { task: '子任务 4-B', status: 'progress', priority: 'medium', assignee: '王五' },
        { task: '子任务 4-C', status: 'open', priority: 'low', assignee: '赵六' }
      ]
    }
  ];

  const columns = [
    { field: 'Order ID', title: 'Order ID', width: 150 },
    { field: 'Product Name', title: 'Product Name', width: 200 },
    { field: 'Category', title: 'Category', width: 120 },
    { field: 'Sub-Category', title: 'Sub-Category', width: 120 },
    { field: 'Region', title: 'Region', width: 100 },
    { field: 'Sales', title: 'Sales', width: 100 },
    { field: 'Profit', title: 'Profit', width: 100 }
  ];

  // 创建主从表插件 - 使用detailData字段而不是默认的children
  const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'master-detail-grouping-demo',
    // 自定义获取详情数据的函数
    getDetailData: (record) => record.detailData || [],
    // 自定义检查是否有详情数据的函数
    hasDetailData: (record) => {
      const data = record.detailData;
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
      style: { margin: 12, height: 150 },
      theme: VTable.themes.BRIGHT
    }
  });

  const option = {
    container: document.getElementById(CONTAINER_ID),
    records: mockData,
    columns,
    widthMode: 'standard',
    // 分组配置 - children字段被分组功能占用
    groupConfig: {
      groupBy: ['Category', 'Sub-Category'],
      titleFieldFormat: (record) => {
        return record.vtableMergeName + '(' + record.children.length + ')';
      },
      enableTreeStickCell: true
    },
    hierarchyExpandLevel: 1, // 自动展开第一层
    theme: VTable.themes.DEFAULT,
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);
  

  return tableInstance;
}

createGroupTable();
```