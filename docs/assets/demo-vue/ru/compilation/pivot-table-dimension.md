---
категория: примеры
группа: compilation
заголовок: Display Dimension имяs в сводный таблица Corner
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-таблица-corner-title.png
ссылка: таблица_type/сводный_таблица/сводный_таблица_useвозраст
опция: сводныйтаблица#corner
---

# Display Dimension имяs в сводный таблица Corner

Set the corner title display content basis к `'все'`, и the corner cell content will be a concatenation из row dimension имяs и column dimension имяs.

`titleOnDimension` corner title display content basis:

- `'column'` Column dimension имя as corner cell content
- `'row'` Row dimension имя as corner cell content
- `'никто'` Corner cell content is empty
- `'все'` Corner cell content is a concatenation из row dimension имяs и column dimension имяs

## Key Configuration

- `сводныйтаблица`
- `columns`
- `rows`
- `indicators`
- `corner.titleOnDimension` Corner title display content basis

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
    <сводныйтаблица :options="таблицаOptions" />
  `,
  данные() {
    возврат {
      таблицаOptions: {}
    };
  },
  mounted() {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
      .then(res => res.json())
      .then(данные => {
        this.таблицаOptions = {
          records: данные,
          rows: [
            {
              dimensionKey: 'Категория',
              заголовок: 'Категория',
              headerStyle: {
                textStick: true,
                bgColor(arg) {
                  if (arg.данныеValue === 'Row Totals') {
                    возврат '#ff9900';
                  }
                  возврат '#ECF1F5';
                }
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
              сортировка: true,
              headerStyle: {
                fontWeight: 'normal'
              },
              style: {
                заполнение: [16, 28, 16, 28],
                цвет(args) {
                  if (args.данныеValue >= 0) возврат 'black';
                  возврат 'red';
                },
                bgColor(arg) {
                  const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                  if (rowHeaderPaths?.[1]?.значение === 'Sub Totals') {
                    возврат '#ba54ba';
                  } else if (rowHeaderPaths?.[0]?.значение === 'Row Totals') {
                    возврат '#ff9900';
                  }
                  возврат undefined;
                }
              }
            },
            {
              indicatorKey: 'Продажи',
              заголовок: 'Продажи',
              ширина: 'авто',
              сортировка: true,
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
                },
                bgColor(arg) {
                  const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                  if (rowHeaderPaths?.[1]?.значение === 'Sub Totals') {
                    возврат '#ba54ba';
                  } else if (rowHeaderPaths?.[0]?.значение === 'Row Totals') {
                    возврат '#ff9900';
                  }
                  возврат undefined;
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
                },
                bgColor(arg) {
                  const rowHeaderPaths = arg.cellHeaderPaths.rowHeaderPaths;
                  if (rowHeaderPaths?.[1]?.значение === 'Sub Totals') {
                    возврат '#ba54ba';
                  } else if (rowHeaderPaths?.[0]?.значение === 'Row Totals') {
                    возврат '#ff9900';
                  }
                  возврат undefined;
                }
              }
            }
          ],
          corner: {
            titleOnDimension: 'все'
          },
          ширинаMode: 'standard'
        };
      });
  }
});

app.компонент('сводныйтаблица', VueVтаблица.сводныйтаблица);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
