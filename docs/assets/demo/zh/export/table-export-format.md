---
category: examples
group: export
title: 表格导出（自定义导出）
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/checkbox-demo.png
order: 4-6
link: '../../guide/export/excel'
# option: ListTable
---

# 表格导出（自定义导出）

默认情况下，表格导出时，会将导出单元格的内文字或图片输出到 Excel 中，如果需要自定义导出内容，可以设置`formatExportOutput`为一个函数，函数的参数为单元格信息，函数的返回值为导出字符串，如果返回`undefined`，则按照默认导出逻辑处理。

## 代码演示

```javascript livedemo template=vtable
// 使用时需要引入插件包@visactor/vtable-export
// import {
//   downloadCsv,
//   exportVTableToCsv,
//   downloadExcel,
//   exportVTableToExcel,
// } from "@visactor/vtable-export";
// umd引入时导出工具会挂载到VTable.export

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

  exportCsvButton.addEventListener('click', async () => {
    if (window.tableInstance) {
      await downloadCsv(exportVTableToCsv(window.tableInstance), 'export');
    }
  });

  exportExcelButton.addEventListener('click', async () => {
    if (window.tableInstance) {
      await downloadExcel(
        await exportVTableToExcel(window.tableInstance, {
          formatExportOutput: ({ cellType, cellValue, table, col, row }) => {
            if (cellType === 'checkbox') {
              return table.getCellCheckboxState(col, row) ? 'true' : 'false';
            }
          }
        }),
        'export'
      );
    }
  });
}
```
