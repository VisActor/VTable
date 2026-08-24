---
category: examples
group: Business
title: 人员信息表
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/personnel-info.gif
link: custom_define/custom_icon
---

# 人员信息表

展示人员信息，电话号码默认脱敏显示（部分隐藏），点击眼睛图标可切换显示完整号码。

## 关键配置

- `fieldFormat` 格式化电话号码，默认只显示前三位和后四位，中间用 `****` 替换
- `VTable.register.icon` 注册显示/隐藏图标，通过 `visibleTime: 'always'` 常驻显示
- `click_cell` 事件监听图标点击，切换该行的电话号码显示状态并重建单元格，确保号码和图标状态同步刷新

## 代码演示

```javascript livedemo template=vtable
const eyeOpenSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7S2 12 2 12Z" stroke="#4E5969" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="12" cy="12" r="3.2" stroke="#4E5969" stroke-width="1.8"/>
  <circle cx="12" cy="12" r="1.2" fill="#4E5969"/>
</svg>`;

const eyeCloseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M3 3L21 21" stroke="#86909C" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M9.88 5.18A9.4 9.4 0 0 1 12 4.94C18.2 4.94 22 12 22 12a16.18 16.18 0 0 1-3.25 4.02" stroke="#86909C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14.12 18.82A9.4 9.4 0 0 1 12 19.06C5.8 19.06 2 12 2 12a16.18 16.18 0 0 1 3.25-4.02" stroke="#86909C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9.76 9.76A3.2 3.2 0 0 0 14.24 14.24" stroke="#86909C" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

// 注册"点击显示号码"图标（眼睛张开）
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
    title: '点击显示号码',
    placement: VTable.TYPES.Placement.top
  },
  svg: eyeOpenSvg
});

// 注册"点击隐藏号码"图标（眼睛闭合）
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
    title: '点击隐藏号码',
    placement: VTable.TYPES.Placement.top
  },
  svg: eyeCloseSvg
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
    // 根据下一步操作动态切换图标：隐藏状态显示开眼，展开状态显示闭眼
    icon(args) {
      const rowId = args.record?.id;
      return phoneVisible[rowId] ? 'eye-close' : 'eye-open';
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
    // 重建单元格以同步刷新号码和图标状态
    tableInstance.renderWithRecreateCells();
  }
});
```
