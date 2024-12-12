---
category: examples
group: data-analysis
title: 透视分析表格下钻上钻
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-table-drill.gif
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable-columns-text#drillDown
---

# 透视分析表格下钻上钻

在维度配置 rows 或者 columns 中加上 drillDown 的配置项来显示下载按钮，监听点击图标按钮事件`drillmenu_click`,根据事件参数`drillDown` 或者 `drillUp`来确定是维度下钻还是上卷，根据参数`dimensionKey`确定下钻或上钻的维度，将其添加或者删除到 rows 或者 columns 中，并获取新维度层级对应数据源，并调用接口`updateOption`将新的 option 更新至表格。

下面的 demo 示例中如果鼠标 hover 到行维度上 会出现下钻按钮，点击下载会将`Sub-Category`添加到行维度中。

## 关键配置

- `PivotTable` 表格类型
- `columns` 列维度配置
- `columns.drillDown` 维度下钻配置
- `columns.drillUp` 维度上钻配置
- `rows` 行维度配置
- `indicators` 指标配置

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
const data = [
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '16'
  },
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '4'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '37.90399980545044'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '62.22999954223633'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '10'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '4'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '7'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '18'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '7'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '17'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '7'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '17'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '4'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '6'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '4.361999988555908'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '280.58800506591797'
  }
];
const option = {
  records: data,
  rows: [
    {
      dimensionKey: 'Category',
      title: 'Category',
      drillDown: true,
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: 'Region',
      title: 'Region',
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: 'Quantity',
      title: 'Quantity',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    },
    {
      indicatorKey: 'Sales',
      title: 'Sales',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: rec => {
        return '$' + Number(rec).toFixed(2);
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    },
    {
      indicatorKey: 'Profit',
      title: 'Profit',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: rec => {
        return '$' + Number(rec).toFixed(2);
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      textStick: true
    }
  },
  widthMode: 'standard'
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
const newData = [
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '16',
    'Sub-Category': 'Chairs'
  },
  {
    Region: 'Central',
    Category: 'Furniture',
    Quantity: '4',
    'Sub-Category': 'Tables'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '37.90399980545044',
    'Sub-Category': 'Paper'
  },
  {
    Region: 'Central',
    Category: 'Office Supplies',
    Sales: '62.22999954223633',
    'Sub-Category': 'Appliances'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '10',
    'Sub-Category': 'Phones'
  },
  {
    Region: 'Central',
    Category: 'Technology',
    Quantity: '4',
    'Sub-Category': 'Accessories'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '7',
    'Sub-Category': 'Bookcases'
  },
  {
    Region: 'East',
    Category: 'Furniture',
    Quantity: '18',
    'Sub-Category': 'Furnishings'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '7',
    'Sub-Category': 'Paper'
  },
  {
    Region: 'East',
    Category: 'Office Supplies',
    Quantity: '17',
    'Sub-Category': 'Binders'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '4',
    'Sub-Category': 'Furnishings'
  },
  {
    Region: 'South',
    Category: 'Furniture',
    Quantity: '6',
    'Sub-Category': 'Tables'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '4.361999988555908',
    'Sub-Category': 'Accessories'
  },
  {
    Region: 'South',
    Category: 'Technology',
    Profit: '280.58800506591797',
    'Sub-Category': 'Phones'
  }
];
tableInstance.on('drillmenu_click', args => {
  if (args.drillDown) {
    if (args.dimensionKey === 'Category') {
      tableInstance.updateOption({
        records: newData,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            drillUp: true,
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          },
          {
            dimensionKey: 'Sub-Category',
            title: 'Sub-Catogery',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Region',
            title: 'Region',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        indicators: [
          {
            indicatorKey: 'Quantity',
            title: 'Quantity',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Sales',
            title: 'Sales',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Profit',
            title: 'Profit',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
                return 'red';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textStick: true
          }
        },
        widthMode: 'standard'
      });
    }
  } else if (args.drillUp) {
    if (args.dimensionKey === 'Category') {
      tableInstance.updateOption({
        records: data,
        rows: [
          {
            dimensionKey: 'Category',
            title: 'Category',
            drillDown: true,
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
        ],
        columns: [
          {
            dimensionKey: 'Region',
            title: 'Region',
            headerStyle: {
              textStick: true
            },
            width: 'auto'
          }
          //  {
          //    "dimensionKey": "Order Year",
          //     "title": "Order Year",
          //     "headerStyle": {
          //         "textStick": true
          //     },
          //     "width": "auto",
          // },
        ],
        indicators: [
          {
            indicatorKey: 'Quantity',
            title: 'Quantity',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Sales',
            title: 'Sales',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
                return 'red';
              }
            }
          },
          {
            indicatorKey: 'Profit',
            title: 'Profit',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
                return 'red';
              }
            }
          }
        ],
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            textStick: true
          }
        },
        widthMode: 'standard'
      });
    }
  }
});
```
