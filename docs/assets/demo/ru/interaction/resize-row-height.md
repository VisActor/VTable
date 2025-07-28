---
категория: примеры
группа: Interaction
заголовок: Adjust row высота
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/row-высота-изменение размера.gif
порядок: 4-4
ссылка: '/interaction/resize_row_высота'
опция: списоктаблица#rowResizeMode
---

# Adjust row высота

The mouse style для adjusting the row высота appears when the mouse is placed на the row spacer, и the row высота can be adjusted по dragging.

## Ключевые Конфигурации

*   `rowResizeMode: 'все' | 'никто' | 'header' | 'body'` Specify the Регион where the row высота can be adjusted
*   `rowResizeType: 'row' | 'indicator' | 'все' | 'indicatorGroup'` Adjust the effective range из the row высота, configurable items:

    *   row: adjust the row высота к adjust only the текущий row
    *   Indicator: rows corresponding к the same Metirc will be adjusted when adjusting the row высота
    *   indicatorгруппа: Adjust the высота из все Metirc rows under the same parent Dimension
    *   все: все row высотаs are adjusted

## код демонстрация

```javascript liveдемонстрация template=vтаблица

let  таблицаInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
    .then((res) => res.json())
    .then((данные) => {

const option = {
  columnResizeMode:'header',
  records:данные,
    "rows": [
        {
            "dimensionKey": "Город",
            "title": "Город",
            "headerStyle": {
                "textStick": true
            },
            "ширина": "авто",
        },
    ],
    "columns": [
        {
           "dimensionKey": "Категория",
            "title": "Категория",
            "headerStyle": {
                "textStick": true
            },
            "ширина": "авто",
        },
    ],
    "indicators": [
                {
                    "indicatorKey": "Количество",
                    "title": "Количество",
                    "ширина": "авто",
                    "showсортировка": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(значение)=>{возврат '$'+число(значение).toFixed(2)},
                    style:{
                      заполнение:[16,28,16,28],
                      цвет(args){
                        if(args.данныеValue>=0)
                        возврат 'black';
                        возврат 'red'
                      }
                    }
                },
                {
                    "indicatorKey": "Продажи",
                    "title": "Продажи",
                    "ширина": "авто",
                    "showсортировка": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(значение)=>{ 
                      if(значение)
                      возврат '$'+число(значение).toFixed(2);
                      else возврат '--';},
                    style:{
                      заполнение:[16,28,16,28],
                      цвет(args){
                        if(args.данныеValue>=0)
                        возврат 'black';
                        возврат 'red'
                      }
                    }
                },
                {
                    "indicatorKey": "Прибыль",
                    "title": "Прибыль",
                    "ширина": "авто",
                    "showсортировка": false,
                    "headerStyle":{
                      fontWeight: "normal",
                    },
                    "format":(значение)=>{возврат '$'+число(значение).toFixed(2)},
                    style:{
                      заполнение:[16,28,16,28],
                      цвет(args){
                        if(args.данныеValue>=0)
                        возврат 'black';
                        возврат 'red'
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
  ширинаMode:'standard',
  rowResizeType: 'row',
  rowResizeMode: 'все',
  defaultHeaderColширина: 100
};
таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID),option);
window['таблицаInstance'] = таблицаInstance;
    })
```
