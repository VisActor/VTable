---
category: examples
group: Business
title: Personnel Information Sheet
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table.png
link: custom_define/custom_icon
---

# Personnel Information Sheet

Display personnel information with phone numbers masked by default (showing only first 3 and last 4 digits). Click the eye icon to toggle displaying the full phone number.

## Key Configuration

- `fieldFormat` formats phone numbers: shows `138****5678` by default
- `VTable.register.icon` registers eye-open / eye-close icons with `visibleTime: 'always'` to always show the toggle button
- `click_cell` event listens for icon clicks, toggles per-row visibility state, and calls `updateRecords` to refresh the cell

## Code Demo

```javascript livedemo template=vtable
// Register "show full number" icon (eye open)
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
    title: 'Click to hide number',
    placement: VTable.TYPES.Placement.top
  },
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`
});

// Register "hide number" icon (eye closed)
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
    title: 'Click to show number',
    placement: VTable.TYPES.Placement.top
  },
  svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`
});

// Mask phone number: keep first 3 and last 4 digits, replace the rest with ****
function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

// Sample personnel data
const records = [
  { id: '001', name: 'Zhang Wei', department: 'R&D', position: 'Senior Engineer', phone: '13812345678', email: 'zhangwei@company.com', location: 'Beijing' },
  { id: '002', name: 'Li Na', department: 'Product', position: 'Product Manager', phone: '13987654321', email: 'lina@company.com', location: 'Shanghai' },
  { id: '003', name: 'Wang Fang', department: 'Design', position: 'UI Designer', phone: '15012349876', email: 'wangfang@company.com', location: 'Shenzhen' },
  { id: '004', name: 'Zhao Lei', department: 'Operations', position: 'Operations Specialist', phone: '18611112222', email: 'zhaolei@company.com', location: 'Guangzhou' },
  { id: '005', name: 'Chen Jing', department: 'HR', position: 'HR Manager', phone: '13711113333', email: 'chenjing@company.com', location: 'Hangzhou' },
  { id: '006', name: 'Liu Yang', department: 'R&D', position: 'Frontend Engineer', phone: '15888889999', email: 'liuyang@company.com', location: 'Beijing' },
  { id: '007', name: 'Zhou Chao', department: 'Sales', position: 'Sales Director', phone: '13666667777', email: 'zhouchao@company.com', location: 'Chengdu' },
  { id: '008', name: 'Wu Min', department: 'Finance', position: 'Finance Supervisor', phone: '18900001111', email: 'wumin@company.com', location: 'Wuhan' },
  { id: '009', name: 'Zheng Hao', department: 'R&D', position: 'Backend Engineer', phone: '13544445555', email: 'zhenghao@company.com', location: "Xi'an" },
  { id: '010', name: 'Sun Li', department: 'Marketing', position: 'Marketing Specialist', phone: '17722223333', email: 'sunli@company.com', location: 'Nanjing' }
];

// Track per-row phone number visibility
const phoneVisible = {};

let tableInstance;

const columns = [
  {
    field: 'id',
    title: 'ID',
    width: 70,
    style: { textAlign: 'center', color: '#666' }
  },
  {
    field: 'name',
    title: 'Name',
    width: 120
  },
  {
    field: 'department',
    title: 'Department',
    width: 120
  },
  {
    field: 'position',
    title: 'Position',
    width: 160
  },
  {
    field: 'phone',
    title: 'Phone Number',
    width: 190,
    // Show masked or full number based on per-row visibility state
    fieldFormat(record) {
      const rowId = record.id;
      return phoneVisible[rowId] ? record.phone : maskPhone(record.phone);
    },
    // Show eye-open when full number is visible, eye-close when masked
    icon(args) {
      const rowId = args.record?.id;
      return phoneVisible[rowId] ? 'eye-open' : 'eye-close';
    }
  },
  {
    field: 'email',
    title: 'Email',
    width: 210
  },
  {
    field: 'location',
    title: 'City',
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

// Listen for icon clicks to toggle phone number visibility per row
tableInstance.on('click_cell', args => {
  const { col, row, targetIcon } = args;
  if (!targetIcon) return;
  if (targetIcon.name === 'eye-open' || targetIcon.name === 'eye-close') {
    const record = tableInstance.getCellOriginRecord(col, row);
    if (!record) return;
    const rowId = record.id;
    // Toggle visibility for this row
    phoneVisible[rowId] = !phoneVisible[rowId];
    // Refresh the row to reflect the new state
    tableInstance.updateRecords([record], [row - tableInstance.columnHeaderLevelCount]);
  }
});
```
