---
категория: примеры
группа: Component
заголовок: legend
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/legend.png
ссылка: компонентs/legend
опция: ListTable-legends-discrete#type
---

# Legend

In this example, the background color of the cell is mapped by the категория Dimension value to generate a legend item, and the click событие of the legend item is listened for to highlight the cell content.

## Ключевые Конфигурации

- `legend` Configuration table legend, please refer to: https://www.visactor.io/vtable/опция/ListTable#legend

## Code Demo

```javascript livedemo template=vtable
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const categorys = ['Office Supplies', 'Technology', 'Furniture'];
    const colorToКатегория = ['rgba(255, 127, 14,1)', 'rgba(227, 119, 194, 1)', 'rgba(44, 160, 44, 1)'];
    const colorToКатегорияUnactive = ['rgba(255, 127, 14, .2)', 'rgba(227, 119, 194, .2)', 'rgba(44, 160, 44, .2)'];

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
        width: '200'
      },
      {
        field: 'Категория',
        title: 'Категория',
        width: 'auto',
        style: {
          // bgColor(args) {
          //   const index = categorys.indexOf(args.value);
          //   return colorToКатегория[index];
          // }
        }
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
      tooltip: {
        isShowOverflowTextTooltip: true
      },
      theme: VTable.themes.DEFAULT.extends({
        bodyStyle: {
          bgColor(args) {
            const { row, col } = args;
            const record = args.table.getCellOriginRecord(col, row);
            return colorToКатегория[categorys.indexOf(record.Категория)];
          }
        }
      }),
      legends: {
        data: [
          {
            label: 'Office Supplies',
            shape: {
              fill: '#ff7f0e',
              symbolType: 'circle'
            }
          },
          {
            label: 'Technology',
            shape: {
              fill: '#e377c2',
              symbolType: 'square'
            }
          },
          {
            label: 'Furniture',
            shape: {
              fill: '#2ca02c',
              symbolType: 'circle'
            }
          }
        ],
        orient: 'top',
        position: 'start',
        maxRow: 1,
        padding: 10
      }
    };
    tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;
    const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
    tableInstance.on(LEGEND_ITEM_CLICK, args => {
      const highlightКатегорияs = args.value;
      tableInstance.updateTheme(
        VTable.themes.DEFAULT.extends({
          bodyStyle: {
            color(args) {
              const { row, col } = args;
              const record = tableInstance.getCellOriginRecord(col, row);
              if (highlightКатегорияs.indexOf(record.Категория) >= 0) {
                return 'black';
              }
              return '#e5dada';
            },
            bgColor(args) {
              const { row, col } = args;
              const record = tableInstance.getCellOriginRecord(col, row);
              if (highlightКатегорияs.indexOf(record.Категория) >= 0) {
                return colorToКатегория[categorys.indexOf(record.Категория)];
              }
              return colorToКатегорияUnactive[categorys.indexOf(record.Категория)];
            }
          }
        })
      );
      console.log(tableInstance.stateManager?.select);
    });
  });
```
