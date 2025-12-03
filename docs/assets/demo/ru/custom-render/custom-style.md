---
категория: примеры
группа: Custom
заголовок: cell custom style
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/custom-style.png
порядок: 7-4
ссылка: custom_define/custom_style
опция: ListTable#customCellStyle
---

#Cell custom style

Customize the display style of some cells by defining and assigning styles.

## Key configuration

- `customCellStyle` Custom style definition configuration
- `customCellStyleArrangement` Custom style assignment configuration

## Code Demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'ИД Заказа',
        title: 'ИД Заказа',
        width: 'auto'
      },
      {
        field: 'ИД Клиента',
        title: 'ИД Клиента',
        width: 'auto'
      },
      {
        field: 'Название Товара',
        title: 'Название Товара',
        width: 'auto'
      },
      {
        field: 'Категория',
        title: 'Категория',
        width: 'auto'
      },
      {
        field: 'Подкатегория',
        title: 'Подкатегория',
        width: 'auto'
      },
      {
        field: 'Регион',
        title: 'Регион',
        width: 'auto'
      },
      {
        field: 'Город',
        title: 'Город',
        width: 'auto'
      },
      {
        field: 'Дата Заказа',
        title: 'Дата Заказа',
        width: 'auto'
      },
      {
        field: 'Количество',
        title: 'Количество',
        width: 'auto'
      },
      {
        field: 'Продажи',
        title: 'Продажи',
        width: 'auto'
      },
      {
        field: 'Прибыль',
        title: 'Прибыль',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard',
      customCellStyle: [
        {
          id: 'custom-1',
          style: {
            bgColor: 'red'
          }
        },
        {
          id: 'custom-2',
          style: {
            color: 'green'
          }
        },
        {
          id: 'custom-3',
          style: styleArg => {
            return {
              color: styleArg.row % 2 === 0 ? 'red' : 'blue'
            };
          }
        }
      ],
      customCellStyleArrangement: [
        {
          cellPosition: {
            col: 3,
            row: 4
          },
          customStyleId: 'custom-1'
        },
        {
          cellPosition: {
            range: {
              start: {
                col: 3,
                row: 5
              },
              end: {
                col: 4,
                row: 6
              }
            }
          },
          customStyleId: 'custom-2'
        },
        {
          cellPosition: {
            range: {
              start: {
                col: 1,
                row: 3
              },
              end: {
                col: 2,
                row: 10
              }
            }
          },
          customStyleId: 'custom-3'
        }
      ]
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
