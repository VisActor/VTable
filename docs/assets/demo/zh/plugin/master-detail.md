---
category: examples
group: plugin
title: 主从表功能展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/masterSubTable-plugin.gif
link: plugin/usage
option: plugins
---

# 主从表功能

基于 VTable 的插件机制，实现主从表功能，能够在主表的行中嵌入完整的子表格，实现层次化的数据展示效果。需要使用`masterDetailPlugin`插件

## 关键配置

- `detailTableOptions`: 子表配置选项，支持静态配置或动态配置函数

这里面可以配置的是
- `style.margin`: 子表边距设置
- `style.height`: 子表容器高度
- `columns`: 子表列定义

以及一些ListTableConstructorOptions中拥有的配置选项

在`DetailTableOptions`中不需要去配置`record`，展开行的时候会从配置的主表对应的行中的`children`中配置的值作为子表的`record`

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
  detailTableOptions: {
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