---
категория: примеры
группа: Interaction
заголовок: Adjust row height
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/row-height-resize.gif
порядок: 4-4
ссылка: '/interaction/resize_row_height'
опция: ListTable#rowResizeMode
---

# Adjust row height

The mouse style for adjusting the row height appears when the mouse is placed on the row spacer, and the row height can be adjusted by dragging.

## Ключевые Конфигурации

*   `rowResizeMode: 'all' | 'none' | 'header' | 'body'` Specify the Region where the row height can be adjusted
*   `rowResizeType: 'row' | 'indicator' | 'all' | 'indicatorGroup'` Adjust the effective range of the row height, configurable items:

    *   row: adjust the row height to adjust only the current row
    *   Indicator: rows corresponding to the same Metirc will be adjusted when adjusting the row height
    *   indicatorGroup: Adjust the height of all Metirc rows under the same parent Dimension
    *   All: All row heights are adjusted

## Демонстрация кода

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
            "dimensionKey": "Город",
            "title": "Город",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "columns": [
        {
           "dimensionKey": "Категория",
            "title": "Категория",
            "headerStyle": {
                "textStick": true
            },
            "width": "auto",
        },
    ],
    "indicators": [
                {
                    "indicatorKey": "Количество",
                    "title": "Количество",
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
                    "indicatorKey": "Продажи",
                    "title": "Продажи",
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
                    "indicatorKey": "Прибыль",
                    "title": "Прибыль",
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
