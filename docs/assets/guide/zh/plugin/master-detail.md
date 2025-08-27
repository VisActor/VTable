# 主从表插件

## 功能介绍

MasterDetailPlugin插件为ListTable提供了主从表功能，旨在实现不同数据更好的展示。该插件支持在表格行中嵌入子表格，提供层次化的数据展示体验。

### 注意事项
- 请不要使用转置功能
- 请不要把tree和主从表一起用
- 与分组功能结合使用时需要配置自定义数据获取函数

## 插件配置

### MasterDetailPluginOptions

插件构造函数接受一个配置对象，该对象需要实现 `MasterDetailPluginOptions` 接口。以下为完整的配置参数说明：

```typescript
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

### 配置参数说明

| 参数名称 | 类型 | 默认值 | 说明 |
|---------|------|--------|------|
| `id` | string | `master-detail-${timestamp}` | 插件实例的唯一标识符 |
| `detailGridOptions` | DetailGridOptions \| Function | - | 子表配置选项，可以是静态对象或动态函数 |
| `getDetailData` | Function | 使用 `record.children` | 自定义获取详情数据的函数 |
| `hasDetailData` | Function | 检查 `record.children` | 自定义检查是否有详情数据的函数 |

#### DetailGridOptions.style 配置

这个继承了ListTableConstructorOptions，可以使用ListTableConstructorOptions的配置

| 参数名称 | 类型 | 默认值 | 说明 |
|---------|------|--------|------|
| `margin` | number \| number[] | 0 | 子表的边距，支持单个数值或数组形式 |
| `height` | number | 300 | 子表的固定高度 |

## 使用方式

### 插件初始化

首先需要创建插件实例并将其添加到 VTable 的插件配置中：

```typescript
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

### 基础用法示例

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

### 动态配置示例

支持使用函数动态配置子表选项，可以根据行数据和行索引返回不同的配置：

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'employee-detail-plugin',
  detailGridOptions: ({ data, bodyRowIndex }) => {
    if (bodyRowIndex === 0) {
      return {
        columns: [
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
          }
        ],
        theme: VTable.themes.BRIGHT,
        style: {
          margin: 20,
          height: 300
        }
      };
    }
    return {
      columns: [
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
        }
      ],
      theme: VTable.themes.DARK,
      style: {
        margin: 20,
        height: 300
      }
    };
  }
});
```

## 高级配置

### 自定义数据获取

通过 `getDetailData` 和 `hasDetailData` 函数，可以自定义如何获取和检查详情数据：

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  // 自定义获取详情数据
  getDetailData: (record) => {
    // 可以从不同字段获取数据
    return record.details || record.subItems || [];
  },
  
  // 自定义检查是否有详情数据
  hasDetailData: (record) => {
    return Boolean(record.details && record.details.length > 0);
  },
  
  detailGridOptions: {
    // ... 子表配置
  }
});
```

就比如当你要和分组这样本身就依赖children的一同使用的话，就请使用hasDetailData和getDetailData来让主从表使用不同的数据源，因为我使用本插件的实现方式中包含了插入在最后面插入虚拟行的操作，所以你会在某些情况下看到最后一行有一行空白行，比如和分组兼容的时候

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
    theme: VTable.themes.DEFAULT,
    plugins: [masterDetailPlugin]
  };

  const tableInstance = new VTable.ListTable(option);
  
  return tableInstance;
}

createGroupTable();
```

### 主题和样式定制

子表支持完整的VTable主题配置：

```typescript
const masterDetailPlugin = new MasterDetailPlugin({
  detailGridOptions: {
    columns: [/*...*/],
    // 应用自定义主题
    theme: VTable.themes.DARK.extends({
      headerStyle: {
        bgColor: '#333',
        color: '#fff'
      },
      bodyStyle: {
        bgColor: '#222',
        color: '#ccc'
      }
    }),
    // 自定义样式
    style: {
      margin: [10, 20, 10, 20], // 上、右、下、左边距
      height: 250
    }
  }
});
```

## 插件实现原理

该插件实现主从表的逻辑中渲染子表的逻辑是基于Vtable中的ViewBox来定位，然后子表根据ViewBox的定位信息把子表渲染到和父亲同一个Canvas上，展开行的空白空间是通过改变行高但是不改变改行中CellGroup的height来实现的空出空行来实现的，并且该插件会把scrollEventAlwaysTrigger设置为true,也就是默认会在表滚动到边界继续触发滚动事件;为的是实现子表滚动的auto效果

# 本文档由由以下人员贡献

[抽象薯片](https://github.com/Violet2314)