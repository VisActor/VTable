---
category: examples
group: theme custom
title: 表格主题
cover:
---

# 表格主题-custom

自定义主题

## 关键配置

- `VTable.register.theme` 全局注册theme
- `theme: xxx` 指定注册theme的名称
  
## 代码演示

```ts

VTable.register.theme('themeRegisterOne',{
      defaultStyle:{
        borderLineWidth:0,
      },
      headerStyle:{
        bgColor:'#a881e1',
        borderColor:'white',
        fontWeight:'normal',
        color:'white'
      },
      rowHeaderStyle:{
        bgColor:'#eae1fa',
        borderColor:'white',
        borderLineWidth:1,
        fontWeight:'normal',
      },
      cornerHeaderStyle:{
        bgColor:'#a881e1',
        fontWeight:'normal',
        color:'white'
      },
      bodyStyle:{
        borderColor:'#f1e8fe',
        borderLineWidth:1,
        bgColor:(args) => {
          if ((args.row & 1)) {
            return '#f8f5fe';
          }
          return '#FDFDFD';
        }
      }
    })
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
  theme:'themeRegisterOne'
};
const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
