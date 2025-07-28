---
категория: примеры
группа: таблица-тип
заголовок: базовый таблица grouping флажок
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-group-флажок.gif
порядок: 1-2
ссылка: таблица_type/список_таблица/group_список
опция: списоктаблица#groupBy
---

# базовый таблица grouping флажок

базовый таблица grouping флажок. If включен, флажок will be displayed в the лево из group title, и it will be synced с the children флажок.

## Key configuration

- enableTreeCheckbox: включить group title флажок функция

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица
const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_данные.json')
  .then(res => res.json())
  .then(данные => {
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
        ширина: 'авто'
      },
      {
        поле: 'Категория',
        заголовок: 'Категория',
        ширина: 'авто'
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
      records: данные.slice(0, 100),
      columns,
      ширинаMode: 'standard',
      groupBy: ['Категория', 'Sub-Категория', 'Регион'],
      rowSeriesNumber: {
        ширина: 50,
        format: () => {
          возврат '';
        },
        cellType: 'флажок',
        enableTreeCheckbox: true
      }
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = таблицаInstance;
  })
  .catch(e => {
    console.ошибка(e);
  });
```
