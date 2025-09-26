---
category: examples
group: vtable-sheet
title: 电子表格
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/arco.png
link: vtable-sheet/sheet
option: VTableSheet
---

# 电子表格

该示例展示了如何简单配置出一个在线电子表格。该电子表格包括了两个sheet，一个sheet用于输入数据，一个sheet用于展示销售数据。并且配置了导入导出及过滤功能。

## 关键配置

- `VTableSheet` 配置主题名称或者自定义主题样式

## 代码演示

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
      { name: '导入', description: '导入数据替换到当前sheet', menuKey: 'import'},
      { name: '导出',items: [
            { name: '导出CSV',  description: '导出当前sheet数据',menuKey: 'export-current-sheet-csv'},
            { name: '导出XLSX', menuKey: 'export-current-sheet-xlsx' },
          ] },
      {
          name: '测试',
          description: '测试',
          onClick: () => {
            console.log('测试');
          }
        }
    ]
  }
});
window.sheetInstance = sheetInstance;
```