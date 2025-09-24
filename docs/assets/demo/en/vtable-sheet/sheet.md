---
category: examples
group: vtable-sheet
title: vtable spread sheet
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/arco.png
link: vtable-sheet/sheet
option: VTableSheet
---

# vtable spread sheet

This example shows how to configure a simple online spreadsheet. The spreadsheet includes two sheets, one sheet for input data and one sheet for displaying sales data. And it is configured with import, export and filtering functions.

## Key Configurations

- `VTableSheet` Configure the theme name or custom theme style

## Code Demo

```javascript livedemo template=vtable
// import { VTableSheet } from '@visactor/vtable-sheet';
// import { VTablePlugins } from '@visactor/vtable-plugins';

const container = document.getElementById(CONTAINER_ID);
const sheetInstance = new VTableSheet.VTableSheet(container, {
  VTablePluginModules: [
    { module: VTablePlugins.TableExportPlugin },
    { module: VTablePlugins.ExcelImportPlugin },
  ],
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'sheet1',
    },
    {
      sheetKey: 'sheet2',
      sheetTitle: '销售数据',
      columns: [
        { title: '产品', width: 120 },
        { title: '一季度', width: 100 },
        { title: '二季度', width: 100 },
        { title: '三季度', width: 100 },
        { title: '四季度', width: 100 },
        { title: '总计', width: 100 }
      ],
      data: [
        ['产品A', 1200, 1500, 1800, 2000, 6500],
        ['产品B', 2500, 2800, 3000, 3500, 11800],
        ['产品C', 900, 950, 1100, 1300, 4250],
        ['产品D', 500, 650, 800, 950, 2900],
      ],
      active: true,
      filter: true,
      widthMode:'autoWidth',
      // frozenRowCount: 1,
      // frozenColCount: 1
    },
  ],
  mainMenu: {
    show: true,
    items: [
      { name: 'import', description: 'import data to replace the current sheet', menuKey: 'import'},
      { name: 'export',items: [
            { name: 'export CSV',  description: 'export current sheet data',menuKey: 'export-current-sheet-csv'},
            { name: 'export XLSX', description: 'export current sheet data',menuKey: 'export-current-sheet-xlsx' },
          ] },
      {
          name: 'Test',
          description: 'Test',
          onClick: () => {
            console.log('Test');
          }
        }
    ]
  }
});
window.sheetInstance = sheetInstance;
```