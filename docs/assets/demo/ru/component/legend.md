---
категория: примеры
группа: компонент
заголовок: легенда
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/легенда.png
ссылка: компонентs/легенда
опция: списоктаблица-легендаs-discrete#тип
---

# легенда

в this пример, the фон цвет из the cell is mapped по the Категория Dimension значение к generate a легенда item, и the Нажать событие из the легенда item is списокened для к highlight the cell content.

## Ключевые Конфигурации

- `легенда` Configuration таблица легенда, please refer к: https://www.visactor.io/vтаблица/option/списоктаблица#легенда

## код демонстрация

```javascript liveдемонстрация template=vтаблица
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
    const Категорияs = ['Office Supplies', 'Technology', 'Furniture'];
    const colorToКатегория = ['rgba(255, 127, 14,1)', 'rgba(227, 119, 194, 1)', 'rgba(44, 160, 44, 1)'];
    const colorToКатегорияUnactive = ['rgba(255, 127, 14, .2)', 'rgba(227, 119, 194, .2)', 'rgba(44, 160, 44, .2)'];

    const columns = [
      {
        поле: 'ID Заказа',
        заголовок: 'ID Заказа',
        ширина: 'авто'
      },
      {
        поле: 'пользовательскийer ID',
        заголовок: 'пользовательскийer ID',
        ширина: 'авто'
      },
      {
        поле: 'Product имя',
        заголовок: 'Product имя',
        ширина: '200'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто',
        style: {
          // bgColor(args) {
          //   const index = Категорияs.indexOf(args.значение);
          //   возврат colorToКатегория[index];
          // }
        }
      },
      {
        поле: 'Sub-Категория',
        заголовок: 'Sub-Категория',
        ширина: 'авто'
      },
      {
        поле: 'Регион',
        заголовок: 'Регион',
        ширина: 'авто'
      },
      {
        поле: 'Город',
        заголовок: 'Город',
        ширина: 'авто'
      },
      {
        поле: 'Дата Заказа',
        заголовок: 'Дата Заказа',
        ширина: 'авто'
      },
      {
        поле: 'Количество',
        заголовок: 'Количество',
        ширина: 'авто'
      },
      {
        поле: 'Продажи',
        заголовок: 'Продажи',
        ширина: 'авто'
      },
      {
        поле: 'Прибыль',
        заголовок: 'Прибыль',
        ширина: 'авто'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard',
      Подсказка: {
        isShowOverflowTextПодсказка: true
      },
      тема: Vтаблица.темаs.по умолчанию.extends({
        bodyStyle: {
          bgColor(args) {
            const { row, col } = args;
            const record = args.таблица.getCellOriginRecord(col, row);
            возврат colorToКатегория[Категорияs.indexOf(record.Категория)];
          }
        }
      }),
      легендаs: {
        данные: [
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
        orient: 'верх',
        позиция: 'начало',
        maxRow: 1,
        заполнение: 10
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = таблицаInstance;
    const { легенда_ITEM_Нажать } = Vтаблица.списоктаблица.событие_TYPE;
    таблицаInstance.на(легенда_ITEM_Нажать, args => {
      const highlightКатегорияs = args.значение;
      таблицаInstance.updateтема(
        Vтаблица.темаs.по умолчанию.extends({
          bodyStyle: {
            цвет(args) {
              const { row, col } = args;
              const record = таблицаInstance.getCellOriginRecord(col, row);
              if (highlightКатегорияs.indexOf(record.Категория) >= 0) {
                возврат 'black';
              }
              возврат '#e5dada';
            },
            bgColor(args) {
              const { row, col } = args;
              const record = таблицаInstance.getCellOriginRecord(col, row);
              if (highlightКатегорияs.indexOf(record.Категория) >= 0) {
                возврат colorToКатегория[Категорияs.indexOf(record.Категория)];
              }
              возврат colorToКатегорияUnactive[Категорияs.indexOf(record.Категория)];
            }
          }
        })
      );
      console.log(таблицаInstance.stateManвозрастr?.выбрать);
    });
  });
```
