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

默认情况下，表格导出时，会将导出单元格的内文字或图片输出到Excel中，如果需要自定义导出内容，可以设置`formatExportOutput`为一个函数，函数的参数为单元格信息，函数的返回值为导出字符串，如果返回`undefined`，则按照默认导出逻辑处理。

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

const data = [
  {
    类别: '办公用品',
    销售额: '129.696',
    数量: '2',
    利润: '-60.704',
    children: [
      {
        类别: '信封', // 对应原子类别
        销售额: '125.44',
        数量: '2',
        利润: '42.56',
        children: [
          {
            类别: '黄色信封',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '白色信封',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '器具', // 对应原子类别
        销售额: '1375.92',
        数量: '3',
        利润: '550.2',
        children: [
          {
            类别: '订书机',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '计算器',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      }
    ]
  },
  {
    类别: '技术',
    销售额: '229.696',
    数量: '20',
    利润: '90.704',
    children: [
      {
        类别: '设备', // 对应原子类别
        销售额: '225.44',
        数量: '5',
        利润: '462.56'
      },
      {
        类别: '配件', // 对应原子类别
        销售额: '375.92',
        数量: '8',
        利润: '550.2'
      },
      {
        类别: '复印机', // 对应原子类别
        销售额: '425.44',
        数量: '7',
        利润: '342.56'
      },
      {
        类别: '电话', // 对应原子类别
        销售额: '175.92',
        数量: '6',
        利润: '750.2'
      }
    ]
  },
  {
    类别: '家具',
    销售额: '129.696',
    数量: '2',
    利润: '-60.704',
    children: [
      {
        类别: '桌子', // 对应原子类别
        销售额: '125.44',
        数量: '2',
        利润: '42.56',
        children: [
          {
            类别: '黄色桌子',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '白色桌子',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '椅子', // 对应原子类别
        销售额: '1375.92',
        数量: '3',
        利润: '550.2',
        children: [
          {
            类别: '老板椅',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '沙发椅',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      }
    ]
  },
  {
    类别: '生活家电（懒加载）',
    销售额: '229.696',
    数量: '20',
    利润: '90.704'
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      field: '类别',
      tree: true,
      title: '类别',
      width: 'auto',
      sort: true
    },
    {
      field: '销售额',
      title: '销售额',
      width: 'auto',
      sort: true
      // tree: true,
    },
    {
      field: '利润',
      title: '利润',
      width: 'auto',
      sort: true
    }
  ],
  showPin: true, //显示VTable内置冻结列图标
  widthMode: 'standard',
  allowFrozenColCount: 2,
  records: data,

  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,
  hierarchyTextStartAlignment: true,
  sortState: {
    field: '销售额',
    order: 'asc'
  },
  theme: VTable.themes.BRIGHT,
  defaultRowHeight: 32
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
