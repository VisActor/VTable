# 主从表插件

基于 VTable 的插件机制，实现主从表功能，能够在主表的行中嵌入完整的子表格，实现层次化的数据展示效果。

主从表插件特别适用于需要展示关联详细信息的业务场景，如：
- 员工管理：主表显示员工信息，子表显示项目参与记录
- 订单管理：主表显示客户信息，子表显示订单详情
- 产品管理：主表显示产品分类，子表显示具体产品规格

## 关键配置

- `detailGridOptions`: 子表配置选项，支持静态配置或动态配置函数
- `style.margin`: 子表边距设置
- `style.height`: 子表容器高度
- `columns`: 子表列定义

## 代码演示

```javascript livedemo template=vtable
// 使用时需要引入插件包@visactor/vtable-plugins
// import * as VTablePlugins from '@visactor/vtable-plugins';

// 生成模拟数据
function generateData(count) {
  const departments = ['技术部', '产品部', '设计部', '市场部', '销售部'];
  const data = [];
  
  for (let i = 1; i <= count; i++) {
    const department = departments[Math.floor(Math.random() * departments.length)];
    const salary = Math.floor(Math.random() * 20000) + 8000;
    
    // 为每个员工生成项目参与记录
    const projects = [];
    const projectCount = Math.floor(Math.random() * 4) + 2;
    
    for (let j = 0; j < projectCount; j++) {
      projects.push({
        '项目名称': `项目 ${String.fromCharCode(65 + j)}-${i}`,
        '项目状态': Math.random() > 0.5 ? '进行中' : '已完成',
        '参与角色': Math.random() > 0.5 ? '开发工程师' : '项目经理',
        '工作量': `${Math.floor(Math.random() * 60) + 20}%`
      });
    }
    
    data.push({
      id: i,
      '员工编号': `EMP-${String(i).padStart(4, '0')}`,
      '姓名': `员工${i}`,
      '部门': department,
      '职位': i % 3 === 0 ? '高级工程师' : '开发工程师',
      '月薪': `¥${salary.toLocaleString()}`,
      '项目数量': projectCount,
      children: projects
    });
  }
  
  return data;
}

// 创建主从表插件
const masterDetailPlugin = new VTablePlugins.MasterDetailPlugin({
  id: 'employee-detail-plugin',
  detailGridOptions: {
    columns: [
      { 
        field: '项目名称', 
        title: '项目名称',
        width: 200,
        style: { fontWeight: 'bold' }
      },
      { 
        field: '项目状态', 
        title: '项目状态',
        width: 120,
        style: { textAlign: 'center' }
      },
      { 
        field: '参与角色', 
        title: '参与角色',
        width: 140
      },
      { 
        field: '工作量', 
        title: '工作量',
        width: 100,
        style: { textAlign: 'center', fontWeight: 'bold', color: '#dc2626' }
      }
    ],
    defaultRowHeight: 36,
    defaultHeaderRowHeight: 42,
    style: { 
      margin: [16, 20], 
      height: 200 
    },
    theme: VTable.themes.BRIGHT
  }
});

// 主表配置
const records = generateData(15);

const columns = [
  { field: 'id', title: 'ID', width: 80, sort: true },
  { field: '员工编号', title: '员工编号', width: 120 },
  { field: '姓名', title: '姓名', width: 100, sort: true },
  { field: '部门', title: '部门', width: 100, sort: true },
  { field: '职位', title: '职位', width: 120, sort: true },
  { 
    field: '月薪', 
    title: '月薪', 
    width: 120,
    style: { textAlign: 'right', fontWeight: 'bold', color: '#059669' }
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
  records,
  autoFillWidth: true,
  widthMode: 'standard',
  ttheme: VTable.themes.ARCO,
  plugins: [masterDetailPlugin]
};

const tableInstance = new VTable.ListTable(option);
window.tableInstance = tableInstance;
```