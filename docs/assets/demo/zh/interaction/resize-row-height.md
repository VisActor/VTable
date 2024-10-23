---
category: examples
group: Interaction
title: 调整行高
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/row-height-resize.gif
order: 4-4
link: '/interaction/resize_row_width'
option: ListTable#rowResizeMode
---

# 调整行高

鼠标放置在列间隔线上出现调整行高的鼠标样式，可拖拽进行行高调整。

## 关键配置
- `rowResizeMode: 'all' | 'none' | 'header' | 'body'` 指定可操作调整行高的区域
- `rowResizeType: 'row' | 'indicator' | 'all' | 'indicatorGroup'` 调整行高的生效范围，可配置项：

  - row: 调整行高只调整当前列
  - indicator: 调整行高时对应相同指标的列都会被调整
  - indicatorGroup: 调整同父级维度下所有指标列的宽度
  - all： 所有行高都被调整

## 代码演示

```javascript livedemo template=vtable

let  tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then((res) => res.json())
    .then((data) => {

const option = {
  columnResizeMode:'header',
  records:data,
    "rows": [
        {
            "dimensionKey": "City",
            "title": "City",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "columns": [
        {
           "dimensionKey": "Category",
            "title": "Category",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "indicators": [
                {
                    "indicatorKey": "Quantity",
                    "title": "Quantity",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(value)=>{return '$'+Number(value).toFixed(2)},
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
                    "indicatorKey": "Sales",
                    "title": "Sales",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(value)=>{ 
                      if(value)
                      return '$'+Number(value).toFixed(2);
                      else return '--';},
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
                    "indicatorKey": "Profit",
                    "title": "Profit",
                    "width": "auto",
                    "showSort": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(value)=>{return '$'+Number(value).toFixed(2)},
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
        "titleOnDimension": "column",
        "headerStyle": {
            "textStick": true
        }
    },
  indicatorsAsCol: false,
  widthMode:'standard',
  rowResizeType: 'row',
  rowResizeMode: 'all',
  defaultHeaderColWidth: 100
};
tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID),option);
window['tableInstance'] = tableInstance;
    })
```
