---
category: examples
group: plugin
title: master detail table functions
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/masterSubTable-plugin.gif
link: plugin/usage
option: plugins
---

# MasterDetailTable Function

Based on the VTable plugin mechanism, the master-detail function is realized, enabling the embedding of a complete sub-table within the rows of the main table, achieving a hierarchical data display effect. The `masterDetailPlugin` plugin needs to be used.

## Key configuration

- `detailTableOptions`: Sub-table configuration options, supporting either static configuration or dynamic configuration functions

The configurations required here are:
- `style.margin`: Margin settings for the sub-table
- `style.height`: Height of the sub-table container
- `columns`: Definition of sub-table columns

As well as some configuration options available in ListTableConstructorOptions

In `DetailTableOptions`, there is no need to configure `record`. When expanding rows, the values configured in the `children` of the corresponding row in the main table will be used as the `record` of the sub-table

## Code demonstration

```javascript livedemo template=vtable
// When using it, you need to import the plugin package @visactor/vtable-plugins
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