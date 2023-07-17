---
category: examples
group: table-type
title: 透视表格树形展示
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-tree.png
order: 1-5
link: '/guide/table_type/Pivot_table/pivot_table_tree'
---

# 透视表格

透视表格

## 关键配置

- `rowHierarchyType` 将层级展示设置为`tree`，默认为平铺模式`grid`。
## 代码演示

```javascript livedemo template=vtable

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_pivot2.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
  parentElement: document.getElementById(CONTAINER_ID),
  records:data,
  "rowTree": [
    {
        "dimensionKey": "230627170530016",
        "value": "Furniture",
        hierarchyState: 'expand',
        "children": [
            {
                "dimensionKey": "230627170530068",
                "value": "Bookcases",
                hierarchyState: 'collapse',
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Chairs",
                hierarchyState: 'collapse',
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Furnishings"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Tables"
            }
        ]
    },
    {
        "dimensionKey": "230627170530016",
        "value": "Office Supplies",
        "children": [
            {
                "dimensionKey": "230627170530068",
                "value": "Appliances"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Art"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Binders"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Envelopes"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Fasteners"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Labels"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Paper"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Storage"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Supplies"
            }
        ]
    },
    {
        "dimensionKey": "230627170530016",
        "value": "Technology",
        "children": [
            {
                "dimensionKey": "230627170530068",
                "value": "Accessories"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Copiers"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Machines"
            },
            {
                "dimensionKey": "230627170530068",
                "value": "Phones"
            }
        ]
    }
],
    "columnTree": [
    {
        "dimensionKey": "230627170530059",
        "value": "West",
        "children": [
            {
                "dimensionKey": "230627170530056",
                "value": "Sales",
                "indicatorKey": "230627170530019"
            },
            {
                "dimensionKey": "230627170530056",
                "value": "Profit",
                "indicatorKey": "230627170530022"
            }
        ]
    },
    {
        "dimensionKey": "230627170530059",
        "value": "South",
        "children": [
            {
                "dimensionKey": "230627170530056",
                "value": "Sales",
                "indicatorKey": "230627170530019"
            },
            {
                "dimensionKey": "230627170530056",
                "value": "Profit",
                "indicatorKey": "230627170530022"
            }
        ]
    },
    {
        "dimensionKey": "230627170530059",
        "value": "Central",
        "children": [
            {
                "dimensionKey": "230627170530056",
                "value": "Sales",
                "indicatorKey": "230627170530019"
            },
            {
                "dimensionKey": "230627170530056",
                "value": "Profit",
                "indicatorKey": "230627170530022"
            }
        ]
    },
    {
        "dimensionKey": "230627170530059",
        "value": "East",
        "children": [
            {
                "dimensionKey": "230627170530056",
                "value": "Sales",
                "indicatorKey": "230627170530019"
            },
            {
                "dimensionKey": "230627170530056",
                "value": "Profit",
                "indicatorKey": "230627170530022"
            }
        ]
    }
],
"rows": [
  {
            "dimensionKey": "230627170530016",
            "dimensionTitle": "Catogery",
            "width": "auto",
  },
  {
            "dimensionKey": "230627170530068",
            "dimensionTitle": "Sub-Catogery",
            "width": "auto",
        },
    ],
    "columns": [
        {
           "dimensionKey": "230627170530059",
            "dimensionTitle": "Region",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "indicators": [
                {
                    "indicatorKey": "230627170530019",
                    "caption": "Sales",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(rec)=>{
                      if(rec)
                      return '$'+Number(rec['230627170530019']).toFixed(2);
                      return '';
                    },
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
                    "indicatorKey": "230627170530022",
                    "caption": "Profit",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(rec)=>{if(rec)
                      return '$'+Number(rec['230627170530022']).toFixed(2);
                      return '';},
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
  rowHierarchyType: 'tree',
  widthMode:'standard',
  rowHierarchyIndent: 20,
  rowExpandLevel:1,
  dragHeaderMode:'all'
};
const tableInstance = new VTable.PivotTable(option);
window['tableInstance'] = tableInstance;
    })
```

## 相关教程

[性能优化](link)
