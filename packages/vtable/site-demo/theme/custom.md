---
category: examples
group: theme custom
title: 表格主题
cover:
---

# 表格主题-custom

自定义主题

## 关键配置

- `theme` 配置主题名称或者自定义主题样式
  
## 代码演示

```ts
// <script type='text/javascript' src='../sales.js'></script>
// import { menus } from './menu';
  fetch('../mock-data/North_American_Superstore_pivot.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
  parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
  records:data,
  "rowTree": [
        {
            "dimensionKey": "230517143221047",
            "value": "Aberdeen"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Abilene"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bowling Green"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Boynton Beach"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bozeman"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Brentwood"
        }
    ],
    "columnTree": [
        {
            "dimensionKey": "230517143221023",
            "value": "Office Supplies",
            "children": [
                {
                    "indicatorKey": "230517143221042"
                },
                {
                    "indicatorKey": "230517143221040"
                },
                {
                    "indicatorKey": "230517143221041"
                }
            ]
        },
        {
            "dimensionKey": "230517143221023",
            "value": "Technology",
            "children": [
                {
                    "indicatorKey": "230517143221042"
                },
                {
                    "indicatorKey": "230517143221040"
                },
                {
                    "indicatorKey": "230517143221041"
                }
            ]
        },
        {
            "dimensionKey": "230517143221023",
            "value": "Furniture",
            "children": [
                {
                    "indicatorKey": "230517143221042"
                },
                {
                    "indicatorKey": "230517143221040"
                },
                {
                    "indicatorKey": "230517143221041"
                }
            ]
        }
    ],
    "rows": [
        {
            "dimensionKey": "230517143221047",
            "dimensionTitle": "City",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "columns": [
        {
            "dimensionKey": "230517143221023",
            "dimensionTitle": "Category",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "indicators": [
                {
                    "indicatorKey": "230517143221042",
                    "caption": "Quantity",
                    "width": "auto",
                    "showSort": false,
                },
                {
                    "indicatorKey": "230517143221040",
                    "caption": "Sales",
                    "width": "auto",
                    "showSort": false,
                    "format":(rec)=>{return Number(rec['230517143221040']).toFixed(2)}
                },
                {
                    "indicatorKey": "230517143221041",
                    "caption": "Profit",
                    "width": "auto",
                    "showSort": false,
                    "format":(rec)=>{return Number(rec['230517143221041']).toFixed(2)}
                }
            ],
    "corner": {
        "titleOnDimension": "row",
        "headerStyle": {
            "textStick": true
        }
    },
  widthMode:'standard',
  theme:{
      defaultStyle:{
        borderLineWidth:0,
      },
      headerStyle:{
        frameStyle:{
          borderColor:'blue',
          borderLineWidth:[0,0,1,0]
        }
      },
      rowHeaderStyle:{
        frameStyle:{
          borderColor:'blue',
          borderLineWidth:[0,1,0,0]
        }
      },
      cornerHeaderStyle:{
        frameStyle:{
          borderColor:'blue',
          borderLineWidth:[0,1,1,0]
        }
      }
    }
};
const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
