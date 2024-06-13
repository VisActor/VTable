---
category: examples
group: export
title: 表格导出（忽略图标）
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/export-tree.png
order: 4-6
link: '../../guide/export/excel'
# option: ListTable
---

# 表格导出（忽略图标）

By default, when the cell has an icon, the icon and text will be treated as an image when exporting. If you do not need to export the icon, you can set `ignoreIcon` to true, and only the text will be output.

## Code demo

```javascript livedemo template=vtable
// You need to introduce the plug-in package when using it `@visactor/vtable-export`
// import {
//   downloadCsv,
//   exportVTableToCsv,
//   downloadExcel,
//   exportVTableToExcel,
// } from "@visactor/vtable-export";
// When umd is introduced, the export tool will be mounted to VTable.export

const records = [
  { productName: 'aaaa', price: 20, check: { text: 'unchecked', checked: false, disable: false } },
  { productName: 'bbbb', price: 18, check: { text: 'checked', checked: true, disable: false } },
  { productName: 'cccc', price: 16, check: { text: 'disable', checked: true, disable: true } },
  { productName: 'cccc', price: 14, check: { text: 'disable', checked: false, disable: true } },
  { productName: 'eeee', price: 12, check: { text: 'checked', checked: false, disable: false } },
  { productName: 'ffff', price: 10, check: { text: 'checked', checked: false, disable: false } },
  { productName: 'gggg', price: 10, check: { text: 'checked', checked: false, disable: false } }
];

const columns = [
  {
    field: 'isCheck',
    title: '',
    width: 60,
    headerType: 'checkbox',
    cellType: 'checkbox'
  },
  {
    field: 'productName',
    title: 'productName',
    width: 120
  },
  {
    field: 'price',
    title: 'checkbox',
    width: 120,
    cellType: 'checkbox',
    disable: true,
    checked: true
  },
  {
    field: 'check',
    title: 'checkbox',
    width: 120,
    cellType: 'checkbox'
    // disable: true
  }
];
const option = {
  records,
  columns
};
const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
window.tableInstance = tableInstance;

bindExport();

function bindExport() {
  let exportContainer = document.getElementById('export-buttom');
  if (exportContainer) {
    exportContainer.parentElement.removeChild(exportContainer);
  }

  exportContainer = document.createElement('div');
  exportContainer.id = 'export-buttom';
  exportContainer.style.position = 'absolute';
  exportContainer.style.bottom = '0';
  exportContainer.style.right = '0';

  window['tableInstance'].getContainer().appendChild(exportContainer);

  const exportCsvButton = document.createElement('button');
  exportCsvButton.innerHTML = 'CSV-export';
  const exportExcelButton = document.createElement('button');
  exportExcelButton.innerHTML = 'Excel-export';
  exportContainer.appendChild(exportCsvButton);
  exportContainer.appendChild(exportExcelButton);

  exportCsvButton.addEventListener('click', () => {
    if (window.tableInstance) {
      downloadCsv(exportVTableToCsv(window.tableInstance), 'export');
    }
  });

  exportExcelButton.addEventListener('click', async () => {
    if (window.tableInstance) {
      downloadExcel(await exportVTableToExcel(window.tableInstance), 'export');
    }
  });
}
```
