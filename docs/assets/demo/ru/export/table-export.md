---
категория: примеры
группа: export
заголовок: таблица export
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-таблица.png
порядок: 4-6
ссылка: '../../guide/export/excel'
# опция: списоктаблица
---

# таблица export

Using the `@visactor/таблица-export` tool, the таблица export функция can be implemented very simply. Следующий is a simple пример that демонстрацияnstrates how к use Vтаблица к implement the таблица export функция.

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// You need к introduce the plug-в packвозраст when using it `@visactor/vтаблица-export`
// import {
//   downloadCsv,
//   exportVтаблицаToCsv,
//   downloadExcel,
//   exportVтаблицаToExcel,
// } от "@visactor/vтаблица-export";
// When umd is introduced, the export tool will be mounted к Vтаблица.export

let таблицаInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Город',
          заголовок: 'Город',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Количество',
          заголовок: 'Количество',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат '#000000';
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат '#000000';
              возврат 'red';
            }
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            возврат '$' + число(rec).toFixed(2);
          },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              if (args.данныеValue >= 0) возврат '#000000';
              возврат 'red';
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      данныеConfig: {
        сортировкаRules: [
          {
            сортировкаполе: 'Категория',
            сортировкаBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ]
      },
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    window['таблицаInstance'] = таблицаInstance;

    bindExport();
  });

функция bindExport() {
  let exportContainer = document.getElementById('export-buttom');
  if (exportContainer) {
    exportContainer.parentElement.removeChild(exportContainer);
  }

  exportContainer = document.createElement('div');
  exportContainer.id = 'export-buttom';
  exportContainer.style.позиция = 'absolute';
  exportContainer.style.низ = '0';
  exportContainer.style.право = '0';

  window['таблицаInstance'].getContainer().appendChild(exportContainer);

  const exportCsvКнопка = document.createElement('Кнопка');
  const exportExcelКнопка = document.createElement('Кнопка');
  exportContainer.appendChild(exportCsvКнопка);
  exportContainer.appendChild(exportExcelКнопка);

  exportCsvКнопка.addсобытиесписокener('Нажать', async () => {
    if (window.таблицаInstance) {
      await downloadCsv(exportVтаблицаToCsv(window.таблицаInstance), 'export');
    }
  });

  exportExcelКнопка.addсобытиесписокener('Нажать', async () => {
    if (window.таблицаInstance) {
      await downloadExcel(await exportVтаблицаToExcel(window.таблицаInstance), 'export');
    }
  });
}
```
