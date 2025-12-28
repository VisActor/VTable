---
category: examples
group: List Table
title: 主从表功能展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/masterSubTable.gif
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
    detailTableOptions: {
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