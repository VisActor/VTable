---
категория: примеры
группа: edit
заголовок: сводный таблица edit данные
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-таблица-editor.gif
ссылка: edit/edit_cell
опция: сводныйтаблица#editor
---

# сводный таблица edit данные

сводный таблица editing данные, this пример enters editing mode when the mouse is Нажатьed.

## Ключевые Конфигурации

- `Vтаблица.регистрация.editor` registration editor
- `editor` sets the editor registration имя
- `editCellTrigger` sets the time к enter editing interaction

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// Need к introduce the plug-в packвозраст @visactor/vтаблица-editors when using it
// import * as Vтаблица_editors от '@visactor/vтаблица-editors';
//Normal usвозраст const input_editor = новый Vтаблица.editors.InputEditor();
//Vтаблица.editors is reимяd к Vтаблица_editors в the official website editor
let таблицаInstance;
const input_editor = новый Vтаблица_editors.InputEditor();
Vтаблица.регистрация.editor('ввод-editor', input_editor);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
  .then(res => res.json())
  .then(данные => {
    const option = {
      records: данные,
      rows: [
        {
          dimensionKey: 'Категория',
          заголовок: 'Категория',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Sub-Категория',
          заголовок: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        }
      ],
      columns: [
        {
          dimensionKey: 'Регион',
          заголовок: 'Регион',
          headerStyle: {
            textStick: true
          },
          ширина: 'авто'
        },
        {
          dimensionKey: 'Segment',
          заголовок: 'Segment',
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
              if (args.данныеValue >= 0) возврат 'black';
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
              if (args.данныеValue >= 0) возврат 'black';
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
              if (args.данныеValue >= 0) возврат 'black';
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
        ],
        totals: {
          row: {
            showSubTotals: true,
            subTotalsDimensions: ['Категория'],
            subTotalLabel: 'subtotal'
          }
        }
      },
      editor: 'ввод-editor',
      editCellTrigger: 'Нажать',
      ширинаMode: 'standard'
    };
    таблицаInstance = новый Vтаблица.сводныйтаблица(document.getElementById(CONTAINER_ID), option);
    таблицаInstance.на('change_cell_value', arg => {
      console.log(arg);
    });
    window['таблицаInstance'] = таблицаInstance;
  });
```
