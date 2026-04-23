---
category: examples
group: Business
title: 人员信息表
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table.png
link: custom_define/custom_icon
---

# 人员信息表

展示人员信息，电话号码默认脱敏显示（部分隐藏），点击眼睛图标可切换显示完整号码。

## 关键配置

- `fieldFormat` 格式化电话号码，默认只显示前三位和后四位，中间用 `****` 替换
- `VTable.register.icon` 注册显示/隐藏图标，通过 `visibleTime: 'always'` 常驻显示
- `click_cell` 事件监听图标点击，切换该行的电话号码显示状态并调用 `updateRecords` 刷新

## 代码演示

```javascript livedemo template=vtable
// 注册"显示完整号码"图标（眼睛张开）
VTable.register.icon('eye-open', {
  type: 'svg',
  name: 'eye-open',
  width: 16,
  height: 16,
  positionType: VTable.TYPES.IconPosition.right,
  marginLeft: 4,
  cursor: 'pointer',
  visibleTime: 'always',
  tooltip: {
    title: '点击隐藏号码',
    placement: VTable.TYPES.Placement.top
  },
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`
});

// 注册"隐藏号码"图标（眼睛闭合）
VTable.register.icon('eye-close', {
  type: 'svg',
  name: 'eye-close',
  width: 16,
  height: 16,
  positionType: VTable.TYPES.IconPosition.right,
  marginLeft: 4,
  cursor: 'pointer',
  visibleTime: 'always',
  tooltip: {
    title: '点击显示号码',
    placement: VTable.TYPES.Placement.top
  },
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`
});

// 脱敏电话号码：保留前3位和后4位，中间替换为 ****
function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

// 模拟人员数据
const records = [
  { id: '001', name: '张伟', department: '研发部', position: '高级工程师', phone: '13812345678', email: 'zhangwei@company.com', location: '北京' },
  { id: '002', name: '李娜', department: '产品部', position: '产品经理', phone: '13987654321', email: 'lina@company.com', location: '上海' },
  { id: '003', name: '王芳', department: '设计部', position: 'UI设计师', phone: '15012349876', email: 'wangfang@company.com', location: '深圳' },
  { id: '004', name: '赵磊', department: '运营部', position: '运营专员', phone: '18611112222', email: 'zhaolei@company.com', location: '广州' },
  { id: '005', name: '陈静', department: '人力资源部', position: 'HR经理', phone: '13711113333', email: 'chenjing@company.com', location: '杭州' },
  { id: '006', name: '刘洋', department: '研发部', position: '前端工程师', phone: '15888889999', email: 'liuyang@company.com', location: '北京' },
  { id: '007', name: '周超', department: '销售部', position: '销售总监', phone: '13666667777', email: 'zhouchao@company.com', location: '成都' },
  { id: '008', name: '吴敏', department: '财务部', position: '财务主管', phone: '18900001111', email: 'wumin@company.com', location: '武汉' },
  { id: '009', name: '郑浩', department: '研发部', position: '后端工程师', phone: '13544445555', email: 'zhenghao@company.com', location: '西安' },
  { id: '010', name: '孙丽', department: '市场部', position: '市场专员', phone: '17722223333', email: 'sunli@company.com', location: '南京' }
];

// 记录每行的电话号码展开状态
const phoneVisible = {};

let tableInstance;

const columns = [
  {
    field: 'id',
    title: '工号',
    width: 70,
    style: { textAlign: 'center', color: '#666' }
  },
  {
    field: 'name',
    title: '姓名',
    width: 90
  },
  {
    field: 'department',
    title: '部门',
    width: 120
  },
  {
    field: 'position',
    title: '职位',
    width: 130
  },
  {
    field: 'phone',
    title: '电话号码',
    width: 180,
    // 根据展开状态决定显示脱敏号码还是完整号码
    fieldFormat(record) {
      const rowId = record.id;
      return phoneVisible[rowId] ? record.phone : maskPhone(record.phone);
    },
    // 根据展开状态动态切换图标
    icon(args) {
      const rowId = args.record?.id;
      return phoneVisible[rowId] ? 'eye-open' : 'eye-close';
    }
  },
  {
    field: 'email',
    title: '邮箱',
    width: 200
  },
  {
    field: 'location',
    title: '所在城市',
    width: 100,
    style: { textAlign: 'center' }
  }
];

const option = {
  records,
  columns,
  widthMode: 'standard',
  frozenColCount: 1,
  theme: VTable.themes.ARCO
};

tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;

// 监听图标点击事件，切换电话号码的显示状态
tableInstance.on('click_cell', args => {
  const { col, row, targetIcon } = args;
  if (!targetIcon) return;
  if (targetIcon.name === 'eye-open' || targetIcon.name === 'eye-close') {
    const record = tableInstance.getCellOriginRecord(col, row);
    if (!record) return;
    const rowId = record.id;
    // 切换该行的显示状态
    phoneVisible[rowId] = !phoneVisible[rowId];
    // 刷新该行数据
    tableInstance.updateRecords([record], [row - tableInstance.columnHeaderLevelCount]);
  }
});
```
