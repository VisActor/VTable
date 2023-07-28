---
category: examples
group: Theme
title: 表格主题-custom
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom.png
order: 6-6
link: '/guide/theme_and_style/theme'
---

# 表格主题-custom

自定义主题

## 关键配置

- `theme` 配置主题名称或者自定义主题样式
  
## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  "rowTree": [
        {
            "dimensionKey": "City",
            "value": "Aberdeen"
        },
        {
            "dimensionKey": "City",
            "value": "Abilene"
        },
        {
            "dimensionKey": "City",
            "value": "Bowling Green"
        },
        {
            "dimensionKey": "City",
            "value": "Boynton Beach"
        },
        {
            "dimensionKey": "City",
            "value": "Bozeman"
        },
        {
            "dimensionKey": "City",
            "value": "Brentwood"
        }
    ],
    "columnTree": [
        {
            "dimensionKey": "Category",
            "value": "Office Supplies",
            "children": [
                {
                    "indicatorKey": "Quantity"
                },
                {
                    "indicatorKey": "Sales"
                },
                {
                    "indicatorKey": "Profit"
                }
            ]
        },
        {
            "dimensionKey": "Category",
            "value": "Technology",
            "children": [
                {
                    "indicatorKey": "Quantity"
                },
                {
                    "indicatorKey": "Sales"
                },
                {
                    "indicatorKey": "Profit"
                }
            ]
        },
        {
            "dimensionKey": "Category",
            "value": "Furniture",
            "children": [
                {
                    "indicatorKey": "Quantity"
                },
                {
                    "indicatorKey": "Sales"
                },
                {
                    "indicatorKey": "Profit"
                }
            ]
        }
    ],
    "rows": [
        {
            "dimensionKey": "City",
            "dimensionTitle": "City",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "columns": [
        {
            "dimensionKey": "Category",
            "dimensionTitle": "Category",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "indicators": [
                {
                    "indicatorKey": "Quantity",
                    "caption": "Quantity",
                    "width": "auto",
                    "showSort": false,
                },
                {
                    "indicatorKey": "Sales",
                    "caption": "Sales",
                    "width": "auto",
                    "showSort": false,
                    "format":(rec)=>{
                       if(rec)
                      return '$'+Number(rec['Sales']).toFixed(2);
                      else return '--';
                    }
                },
                {
                    "indicatorKey": "Profit",
                    "caption": "Profit",
                    "width": "auto",
                    "showSort": false,
                    "format":(rec)=>{return Number(rec['Profit']).toFixed(2)}
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
