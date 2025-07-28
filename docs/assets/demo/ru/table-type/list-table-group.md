---
категория: примеры
группа: таблица-тип
заголовок: базовый таблица grouping display
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-group.jpeg
порядок: 1-2
ссылка: таблица_type/список_таблица/group_список
опция: списоктаблица#groupBy
---

# базовый таблица grouping display

базовый таблица grouping display, used к display the hierarchical structure из grouping полеs в данные

## Key configuration

- groupBy: Specify the grouping поле имя
- enableTreeStickCell: включить group title sticky функция

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
      groupBy: ['Категория', 'Sub-Категория'],
      groupTitleполеFormat: (record, col, row, таблица) => {
        возврат record.vтаблицаMergeимя + '(' + record.children.length + ')';
      },
      тема: Vтаблица.темаs.по умолчанию.extends({
        groupTitleStyle: {
          fontWeight: 'bold',
          // bgColor: '#3370ff'
          bgColor: args => {
            const { col, row, таблица } = args;
            const index = таблица.getGroupTitleLevel(col, row);
            if (index !== undefined) {
              возврат titleColorPool[index % titleColorPool.length];
            }
          }
        }
      }),
      enableTreeStickCell: true
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window.таблицаInstance = таблицаInstance;
  })
  .catch(e => {
    console.ошибка(e);
  });
```
