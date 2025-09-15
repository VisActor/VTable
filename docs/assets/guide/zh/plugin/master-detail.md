# 主从表插件

## 功能介绍

MasterDetailPlugin 插件为 VTable ListTable 提供强大的主从表功能，能够在主表的行中嵌入完整的子表格，实现层次化的数据展示效果。该插件特别适用于需要展示关联详细信息的业务场景，如订单详情、项目任务、产品规格等复杂数据结构的可视化展示。

## 插件配置

### 配置接口定义

MasterDetailPlugin 采用 TypeScript 接口规范，确保类型安全和开发体验。插件构造函数接受 `MasterDetailPluginOptions` 配置对象，具体定义如下：

```typescript
interface MasterDetailPluginOptions {
  id?: string;
  /** 子表配置选项 - 支持静态配置对象或动态配置函数 */
  detailGridOptions?: DetailGridOptions | ((params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions);
}

interface DetailGridOptions extends VTable.ListTableConstructorOptions {
  /** 子表样式配置，包括布局边距和尺寸设置 */
  style?: {
    margin?: number | [number, number] | [number, number, number, number];
    height?: number;
  };
}
```

### 核心参数详解

| 参数名称 | 类型 | 默认值 | 功能说明 |
|---------|------|--------|----------|
| `id` | string | `master-detail-${timestamp}` | 插件实例的全局唯一标识符，用于区分多个插件实例 |
| `detailGridOptions` | DetailGridOptions \| Function | - | 子表配置选项，支持静态对象配置或基于数据的动态配置函数 |

#### DetailGridOptions 高级配置

`DetailGridOptions` 完全继承 `VTable.ListTableConstructorOptions` 的所有特性，这意味着子表享有与主表相同的功能和配置能力：

**核心配置项：**
- **columns**：子表列定义，支持完整的列配置选项
- **theme**：主题样式配置，可独立于主表设置
- **defaultRowHeight**：子表行高设置
- **sortState**：排序状态配置
- **widthMode**：宽度模式（standard、adaptive、autoWidth 等）
- **以及所有 ListTable 支持的高级配置选项**

#### 样式配置选项

| 属性名称 | 数据类型 | 默认值 | 配置说明 |
|---------|----------|--------|----------|
| `margin` | number \| number[] | 0 | 子表边距设置，支持灵活的边距配置：<br/>• **单数值**：`12` - 四边统一边距<br/>• **双数值**：`[12, 16]` - 垂直和水平边距<br/>• **四数值**：`[12, 16, 12, 16]` - 上、右、下、左独立设置 |
| `height` | number | 300 | 子表容器固定高度（单位：像素），建议根据业务数据量合理设置 |

## 快速开始

### 基础集成步骤

集成 MasterDetailPlugin 到您的项目中只需三个简单步骤：

**第一步：导入插件**
```typescript
import { MasterDetailPlugin } from '@visactor/vtable-plugins';
```

**第二步：创建插件实例**
```typescript
// 创建主从表插件实例
const masterDetailPlugin = new MasterDetailPlugin({
  id: 'master-detail-plugin',
  detailGridOptions: {
    columns: [
      { field: 'task', title: '任务名称', width: 220 },
      { field: 'status', title: '状态', width: 120 }
    ],
    defaultRowHeight: 30,
    defaultHeaderRowHeight: 30,
    style: { margin: 12, height: 160 },
    theme: VTable.themes.BRIGHT
  }
});
```

**第三步：配置到 VTable 实例**
```typescript
// 将插件集成到表格配置中
const tableOptions = {
  container: document.getElementById('tableContainer'),
  columns: [/* 主表列配置 */],
  records: [/* 主表数据 */],
  plugins: [masterDetailPlugin]  // 注册插件
};

// 创建表格实例
const tableInstance = new VTable.ListTable(tableOptions);
```

## 基础功能演示

以下是一个简化的主从表功能演示，展示插件的核心工作原理和基本配置方法：

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

### 动态配置

MasterDetailPlugin 支持基于数据内容和行位置的动态配置，实现更灵活的业务逻辑处理：

**应用场景**：
- 根据不同数据类型展示不同的子表结构
- 为特定行设置个性化的样式主题
- 基于业务规则动态调整子表高度和列配置

**实现示例**：

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

### 与groupBy分组搭配使用

如果在使用注册表插件的时候想要使用分组，那么配置groupBy的时候请只传入一个参数，不然插件将无法识别

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
    },
    {
      'Order ID': 'CA-2015-112326',
      'Product Name': 'Avery 508',
      Category: 'Office Supplies',
      'Sub-Category': 'Labels',
      Region: 'West',
      Sales: 15.55,
      Profit: 5.44,
    },
    {
      'Order ID': 'US-2015-108966',
      'Product Name': 'Think Chair',
      Category: 'Furniture',
      'Sub-Category': 'Chairs',
      Region: 'West',
      Sales: 1374.37,
      Profit: 206.15,
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
    detailGridOptions: {
      columns: [
        { field: 'Order ID', title: 'Order ID', width: 150 },
        { field: 'Product Name', title: 'Product Name', width: 200 },
        { field: 'Category', title: 'Category', width: 120 },
        { field: 'Sub-Category', title: 'Sub-Category', width: 120 },
        { field: 'Region', title: 'Region', width: 100 },
        { field: 'Sales', title: 'Sales', width: 100 },
        { field: 'Profit', title: 'Profit', width: 100 }
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
      groupBy: ['Category'],
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

## 典型业务场景示例

### 场景一：企业员工管理系统

在企业人力资源管理中，需要在员工列表中展示每个员工的项目参与情况。主表显示员工的基本信息（姓名、部门、职位等），点击展开后显示该员工参与的所有项目详情和工作记录。

```javascript livedemo template=vtable
function createEmployeeTable() {
  // 生成企业员工数据
  function generateEmployeeData(count) {
    const departments = ['技术部', '产品部', '设计部', '市场部', '销售部', '人事部', '财务部', '运营部'];
    const positions = ['初级工程师', '中级工程师', '高级工程师', '技术专家', '产品经理', '设计师', '市场专员', '销售经理'];
    const projects = [
      { name: '电商平台重构', type: '技术项目', status: '进行中' },
      { name: '移动端APP开发', type: '产品项目', status: '已完成' },
      { name: '品牌推广活动', type: '市场项目', status: '计划中' },
      { name: '用户体验优化', type: '设计项目', status: '进行中' },
      { name: '数据中台建设', type: '技术项目', status: '已完成' },
      { name: '客户关系管理', type: '销售项目', status: '进行中' }
    ];
    
    const data = [];
    for (let i = 1; i <= count; i++) {
      const department = departments[Math.floor(Math.random() * departments.length)];
      const position = positions[Math.floor(Math.random() * positions.length)];
      const joinDate = new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const salary = Math.floor(Math.random() * 20000) + 8000; // 8000-28000
      
      // 为每个员工生成2-5个项目参与记录
      const employeeProjects = [];
      const projectCount = Math.floor(Math.random() * 4) + 2;
      
      for (let j = 0; j < projectCount; j++) {
        const project = projects[Math.floor(Math.random() * projects.length)];
        const startDate = new Date(2024, Math.floor(Math.random() * 8), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate.getTime() + (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000);
        const workload = Math.floor(Math.random() * 60) + 20; // 20%-80%工作量
        
        employeeProjects.push({
          '项目名称': project.name,
          '项目类型': project.type,
          '项目状态': project.status,
          '参与角色': j === 0 ? '项目负责人' : (j === 1 ? '核心成员' : '参与成员'),
          '开始时间': startDate.toLocaleDateString('zh-CN'),
          '结束时间': endDate.toLocaleDateString('zh-CN'),
          '工作量': `${workload}%`
        });
      }
      
      data.push({
        id: i,
        '员工编号': `EMP-${String(i).padStart(4, '0')}`,
        '姓名': `员工${i}`,
        '部门': department,
        '职位': position,
        '入职时间': joinDate.toLocaleDateString('zh-CN'),
        '月薪': `¥${salary.toLocaleString()}`,
        '项目数量': projectCount,
        children: employeeProjects
      });
    }
    return data;
  }

  const employeeRecords = generateEmployeeData(50);

  // 创建企业员工管理主从表插件
  const employeeDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'employee-management-plugin',
    detailGridOptions: {
      columns: [
        { 
          field: '项目名称', 
          title: '项目名称', 
          width: 180,
          style: { fontWeight: 'bold' }
        },
        { 
          field: '项目类型', 
          title: '项目类型', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                '技术项目': '#e6f7ff',
                '产品项目': '#f6ffed',
                '设计项目': '#fff1f0',
                '市场项目': '#f9f0ff',
                '销售项目': '#fff7e6'
              };
              return colors[args.value] || '#f8f9fa';
            }
          }
        },
        { 
          field: '项目状态', 
          title: '项目状态', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                '进行中': '#dbeafe',
                '已完成': '#d1fae5',
                '计划中': '#fef3c7'
              };
              return colors[args.value] || '#f8f9fa';
            },
            textAlign: 'center'
          }
        },
        { 
          field: '参与角色', 
          title: '参与角色', 
          width: 120,
          style: {
            color: (args) => {
              const colors = {
                '项目负责人': '#dc2626',
                '核心成员': '#059669',
                '参与成员': '#7c3aed'
              };
              return colors[args.value] || '#374151';
            },
            fontWeight: 'bold'
          }
        },
        { 
          field: '开始时间', 
          title: '开始时间', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: '结束时间', 
          title: '结束时间', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: '工作量', 
          title: '工作量占比', 
          width: 100,
          style: { textAlign: 'center', fontWeight: 'bold' }
        }
      ],
      defaultRowHeight: 36,
      defaultHeaderRowHeight: 42,
      style: { 
        margin: [16, 20], 
        height: 220 
      },
      theme: VTable.themes.BRIGHT.extends({
        headerStyle: {
          bgColor: '#1e40af',
          color: '#ffffff'
        }
      })
    }
  });

  // 主表配置
  const columns = [
    { field: 'id', title: 'ID', width: 100, sort: true },
    { field: '员工编号', title: '员工编号', width: 120 },
    { field: '姓名', title: '姓名', width: 100, sort: true },
    { field: '部门', title: '部门', width: 100, sort: true },
    { field: '职位', title: '职位', width: 120, sort: true },
    { field: '入职时间', title: '入职时间', width: 120, sort: true },
    { 
      field: '月薪', 
      title: '月薪', 
      width: 120,
      style: { textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }
    },
    { 
      field: '项目数量', 
      title: '参与项目', 
      width: 100,
      style: { textAlign: 'center', fontWeight: 'bold' }
    }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: employeeRecords,
    widthMode: 'standard',
    theme: VTable.themes.BRIGHT,
    plugins: [employeeDetailPlugin]
  };

  return new VTable.ListTable(option);
}

createEmployeeTable();
```

### 场景二：B2B客户订单跟踪系统

**业务需求**：在 B2B 客户关系管理系统中，销售人员需要快速掌握客户概况，并能够详细查看每个客户的历史订单、交易金额和订单状态分布。

**解决方案**：主表展示客户关键信息（客户名称、所属行业、地区分布、累计交易等），展开后显示该客户的完整订单历史，包括订单详情、产品信息、交易金额和订单状态跟踪。

```javascript livedemo template=vtable
function createCustomerTable() {
  // 生成客户订单数据
  function generateCustomerData(count) {
    const industries = ['互联网', '制造业', '金融', '教育', '医疗', '零售', '物流', '房地产'];
    const regions = ['华北', '华东', '华南', '华中', '东北', '西北', '西南'];
    const orderStatuses = ['待确认', '生产中', '已发货', '已完成', '已取消'];
    const products = [
      { name: '企业级服务器', category: 'IT设备', unitPrice: 25000 },
      { name: '办公软件许可证', category: '软件服务', unitPrice: 8000 },
      { name: '网络安全设备', category: 'IT设备', unitPrice: 15000 },
      { name: '云服务订阅', category: '云计算', unitPrice: 12000 },
      { name: '数据分析平台', category: '软件服务', unitPrice: 30000 },
      { name: '移动办公设备', category: 'IT设备', unitPrice: 5000 }
    ];
    
    const data = [];
    for (let i = 1; i <= count; i++) {
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const region = regions[Math.floor(Math.random() * regions.length)];
      const registerDate = new Date(2019 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      
      // 为每个客户生成3-8个订单
      const customerOrders = [];
      const orderCount = Math.floor(Math.random() * 6) + 3;
      let totalAmount = 0;
      
      for (let j = 0; j < orderCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const orderAmount = product.unitPrice * quantity;
        const orderDate = new Date(2024, Math.floor(Math.random() * 9), Math.floor(Math.random() * 28) + 1);
        const status = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
        totalAmount += orderAmount;
        
        customerOrders.push({
          '订单号': `ORD-${i}-${String(j + 1).padStart(3, '0')}`,
          '产品名称': product.name,
          '产品类别': product.category,
          '数量': quantity,
          '单价': `¥${product.unitPrice.toLocaleString()}`,
          '订单金额': `¥${orderAmount.toLocaleString()}`,
          '下单日期': orderDate.toLocaleDateString('zh-CN'),
          '订单状态': status
        });
      }
      
      data.push({
        id: i,
        '客户编号': `CUS-${String(i).padStart(4, '0')}`,
        '客户名称': `${industry === '互联网' ? '科技' : industry === '制造业' ? '制造' : industry}有限公司${i}`,
        '所属行业': industry,
        '所在地区': region,
        '联系人': `联系人${i}`,
        '注册时间': registerDate.toLocaleDateString('zh-CN'),
        '订单总数': orderCount,
        '累计金额': `¥${totalAmount.toLocaleString()}`,
        children: customerOrders
      });
    }
    return data;
  }

  const customerRecords = generateCustomerData(40);

  // 创建客户订单管理主从表插件
  const customerDetailPlugin = new VTablePlugins.MasterDetailPlugin({
    id: 'customer-management-plugin',
    detailGridOptions: {
      columns: [
        { 
          field: '订单号', 
          title: '订单号', 
          width: 150,
          style: { fontFamily: 'monospace', fontWeight: 'bold' }
        },
        { 
          field: '产品名称', 
          title: '产品名称', 
          width: 160,
          style: { fontWeight: 'bold' }
        },
        { 
          field: '产品类别', 
          title: '产品类别', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                'IT设备': '#e6f7ff',
                '软件服务': '#f6ffed',
                '云计算': '#fff1f0'
              };
              return colors[args.value] || '#f8f9fa';
            }
          }
        },
        { 
          field: '数量', 
          title: '数量', 
          width: 80,
          style: { textAlign: 'center' }
        },
        { 
          field: '单价', 
          title: '单价', 
          width: 120,
          style: { textAlign: 'right', color: '#059669' }
        },
        { 
          field: '订单金额', 
          title: '订单金额', 
          width: 130,
          style: { textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }
        },
        { 
          field: '下单日期', 
          title: '下单日期', 
          width: 120,
          style: { textAlign: 'center' }
        },
        { 
          field: '订单状态', 
          title: '订单状态', 
          width: 100,
          style: {
            bgColor: (args) => {
              const colors = {
                '已完成': '#d1fae5',
                '已发货': '#dbeafe',
                '生产中': '#fef3c7',
                '待确认': '#f3e8ff',
                '已取消': '#fee2e2'
              };
              return colors[args.value] || '#f8f9fa';
            },
            textAlign: 'center'
          }
        }
      ],
      defaultRowHeight: 38,
      defaultHeaderRowHeight: 44,
      style: { 
        margin: [18, 24], 
        height: 260 
      },
      theme: VTable.themes.BRIGHT.extends({
        headerStyle: {
          bgColor: '#7c2d12',
          color: '#ffffff'
        }
      })
    }
  });

  // 主表配置
  const columns = [
    { field: 'id', title: 'ID', width: 100, sort: true },
    { field: '客户编号', title: '客户编号', width: 120, sort: true },
    { field: '客户名称', title: '客户名称', width: 180, sort: true },
    { field: '所属行业', title: '所属行业', width: 100, sort: true },
    { field: '所在地区', title: '所在地区', width: 100, sort: true },
    { field: '联系人', title: '联系人', width: 100 },
    { field: '注册时间', title: '注册时间', width: 120, sort: true },
    { 
      field: '订单总数', 
      title: '订单总数', 
      width: 100,
      style: { textAlign: 'center', fontWeight: 'bold' }
    },
    { 
      field: '累计金额', 
      title: '累计金额', 
      width: 140,
      style: { textAlign: 'right', fontWeight: 'bold', color: '#dc2626' }
    }
  ];

  const option = {
    container: document.getElementById(CONTAINER_ID),
    columns,
    records: customerRecords,
    widthMode: 'standard',
    theme: VTable.themes.BRIGHT,
    plugins: [customerDetailPlugin]
  };

  return new VTable.ListTable(option);
}

createCustomerTable();
```

## 技术实现原理

MasterDetailPlugin 采用了高效的渲染策略来实现主从表功能：

1. **ViewBox 定位系统**：插件基于 VTable 的 ViewBox 机制进行精确定位，确保子表能够准确渲染在展开行的指定位置。

2. **Canvas 共享渲染**：子表与主表共享同一个 Canvas 画布，避免了多画布切换带来的性能开销，同时保证了视觉一致性。

3. **动态行高调整**：通过智能调整展开行的行高，同时保持该行中 CellGroup 的原始高度不变，巧妙地创造出用于渲染子表的空白区域。

4. **滚动事件优化**：插件自动将 `scrollEventAlwaysTrigger` 设置为 `true`，确保在表格滚动到边界时仍能触发滚动事件，实现子表的自动滚动效果。

## 注意事项
- 请不要使用转置功能
- 请不要把tree和主从表一起用

## 本文档贡献者

[抽象薯片](https://github.com/Violet2314)