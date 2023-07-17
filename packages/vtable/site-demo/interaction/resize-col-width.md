---
category: examples
group: Interaction
title: 调整列宽
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/resize-col-width.gif
order: 4-4
link: '/guide/interaction_and_event/resize_column_width'
---

# 调整列宽

鼠标放置在列间隔线上出现调整列宽的鼠标样式，可拖拽进行列宽调整。

## 关键配置

- `columnResizeMode: 'all' | 'none' | 'header' | 'body'` 指定可操作调整列宽的区域
- `columnResizeType: 'column' | 'indicator' | 'all' | 'indicatorGroup'` 调整列宽的生效范围，可配置项：

  - column: 调整列宽只调整当前列
  - indicator: 调整列宽时对应相同指标的列都会被调整
  - indicatorGroup: 调整同父级维度下所有指标列的宽度
  - all： 所有列宽都被调整

## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_pivot.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  columnResizeMode:'header',
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
            "value": "Akron"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Albuquerque"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Alexandria"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Allen"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Allentown"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Altoona"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Amarillo"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Anaheim"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Andover"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Ann Arbor"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Antioch"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Apopka"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Apple Valley"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Appleton"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Arlington"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Arlington Heights"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Arvada"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Asheville"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Athens"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Atlanta"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Atlantic City"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Auburn"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Aurora"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Austin"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Avondale"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bakersfield"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Baltimore"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bangor"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bartlett"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bayonne"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Baytown"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Beaumont"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bedford"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Belleville"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bellevue"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bellingham"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bethlehem"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Beverly"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Billings"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bloomington"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Boca Raton"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Boise"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bolingbrook"
        },
        {
            "dimensionKey": "230517143221047",
            "value": "Bossier City"
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
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(rec)=>{return '$'+Number(rec['230517143221042']).toFixed(2)},
                    style:{
                      padding:[16,28,16,28],
                      color(args){
                        if(args.dataValue>=0)
                        return 'black';
                        return 'red'
                      }
                    }
                },
                {
                    "indicatorKey": "230517143221040",
                    "caption": "Sales",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(rec)=>{return '$'+Number(rec['230517143221040']).toFixed(2)},
                    style:{
                      padding:[16,28,16,28],
                      color(args){
                        if(args.dataValue>=0)
                        return 'black';
                        return 'red'
                      }
                    }
                },
                {
                    "indicatorKey": "230517143221041",
                    "caption": "Profit",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(rec)=>{return '$'+Number(rec['230517143221041']).toFixed(2)},
                    style:{
                      padding:[16,28,16,28],
                      color(args){
                        if(args.dataValue>=0)
                        return 'black';
                        return 'red'
                      }
                    }
                }
            ],
    "corner": {
        "titleOnDimension": "row",
        "headerStyle": {
            "textStick": true
        }
    },
    //columnResizeType:'all',
  widthMode:'standard'
};
const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
