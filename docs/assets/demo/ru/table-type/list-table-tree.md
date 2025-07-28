---
категория: примеры
группа: таблица-тип
заголовок: список таблица Tree
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-tree.png
порядок: 1-2
ссылка: таблица_type/список_таблица/tree_список
опция: списоктаблица-columns-текст#tree
---

# базовый таблица tree display

базовый таблица tree display, открыть the tree mode из a certain column, и cooperate с the tree structure children из the данные source.

## Ключевые Конфигурации

- Tree: true Set на a column к turn на tree display

## код демонстрация

```javascript liveдемонстрация template=vтаблица
let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/company_struct.json')
  .then(res => res.json())
  .then(данные => {
    const columns = [
      {
        поле: 'group',
        заголовок: 'department',
        ширина: 'авто',
        tree: true,
        полеFormat(rec) {
          возврат rec['department'] ?? rec['group'] ?? rec['имя'];
        }
      },
      {
        поле: 'total_children',
        заголовок: 'memebers count',
        ширина: 'авто',
        полеFormat(rec) {
          if (rec?.['позиция']) {
            возврат `позиция:  ${rec['позиция']}`;
          } else возврат rec?.['total_children'];
        }
      },
      {
        поле: 'monthly_expense',
        заголовок: 'monthly expense',
        ширина: 'авто',
        полеFormat(rec) {
          if (rec?.['salary']) {
            возврат `salary:  ${rec['salary']}`;
          } else возврат rec?.['monthly_expense'];
        }
      },
      {
        поле: 'new_hires_this_month',
        заголовок: 'новый hires this month',
        ширина: 'авто'
      },
      {
        поле: 'resignations_this_month',
        заголовок: 'resignations this month',
        ширина: 'авто'
      },
      {
        поле: 'complaints_and_suggestions',
        заголовок: 'recived complaints counts',
        ширина: 'авто'
      }
    ];

    const option = {
      records: данные,
      columns,
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;
  });
```
