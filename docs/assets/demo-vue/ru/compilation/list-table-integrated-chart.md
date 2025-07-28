---
категория: примеры
группа: compilation
заголовок: базовый таблица Integrated с графикs
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/список-график.png
порядок: 1-1
ссылка: cell_type/график
опция: списоктаблица-columns-график#cellType
---

# базовый таблица Integrated с графикs

Integrate the vграфик library into the таблица к enrich visualization forms и enhance multi-график rendering Производительность. This пример references the bar progress график от vграфик.

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
      <списоктаблица :options="таблицаOptions" ref="сводныйграфикRef"/>
   `,
  setup() {
    const сводныйграфикRef = ref(null);
    const таблицаOptions = ref({});

    const records = [
      {
        projectимя: 'Project No.1',
        startTime: '2023/5/1',
        endTime: '2023/5/10',
        estimateDays: 10,
        goal: 0.6,
        progress: [
          {
            значение: 0.5,
            label: '50%',
            goal: 0.6
          }
        ],
        master: 'Julin'
      },
      {
        projectимя: 'Project No.2',
        startTime: '2023/5/1',
        endTime: '2023/5/5',
        estimateDays: 5,
        goal: 0.5,
        progress: [
          {
            значение: 0.5,
            label: '50%',
            goal: 0.5
          }
        ],
        master: 'Jack'
      },
      {
        projectимя: 'Project No.3',
        startTime: '2023/5/7',
        endTime: '2023/5/8',
        estimateDays: 3,
        goal: 0.2,
        progress: [
          {
            значение: 0.3,
            label: '30%',
            goal: 0.2
          }
        ],
        master: 'Mary'
      },
      {
        projectимя: 'Project No.4',
        startTime: '2023/5/11',
        endTime: '2023/5/12',
        estimateDays: 2,
        goal: 0.8,
        progress: [
          {
            значение: 0.9,
            label: '90%',
            goal: 0.8
          }
        ],
        master: 'Porry'
      },
      {
        projectимя: 'Project No.5',
        startTime: '2023/5/0',
        endTime: '2023/5/10',
        estimateDays: 2,
        goal: 1,
        progress: [
          {
            значение: 0.8,
            label: '80%',
            goal: 1
          }
        ],
        master: 'Sheery'
      }
    ];

    const columns = [
      {
        поле: 'projectимя',
        заголовок: 'Project имя',
        ширина: 'авто',
        style: {
          цвет: '#ff689d',
          fontWeight: 'bold'
        }
      },
      {
        поле: 'progress',
        заголовок: 'Schedule',
        ширина: 300,
        cellType: 'график',
        графикModule: 'vграфик',
        style: {
          заполнение: 1
        },
        графикSpec: {
          тип: 'linearProgress',
          progress: {
            style: {
              fill: '#32a645',
              lineCap: ''
            }
          },
          данные: {
            id: 'id0'
          },
          direction: 'horizontal',
          xполе: 'значение',
          yполе: 'label',
          seriesполе: 'тип',
          cornerRadius: 20,
          bandширина: 12,
          заполнение: 10,
          axes: [
            {
              orient: 'право',
              тип: 'band',
              domainLine: { видимый: false },
              tick: { видимый: false },
              label: {
                formatMethod: val => val,
                style: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  fill: '#32a645'
                }
              },
              maxширина: '60%' // Configure the maximum space для the axis
            },
            {
              orient: 'низ',
              label: { видимый: true, inside: true },
              тип: 'linear',
              видимый: false,
              grid: {
                видимый: false
              }
            }
          ],
          extensionMark: [
            {
              тип: 'rule',
              данныеId: 'id0',
              видимый: true,
              style: {
                x: (datum, ctx, elements, данныеView) => {
                  возврат ctx.valueToX([datum.goal]);
                },
                y: (datum, ctx, elements, данныеView) => {
                  возврат ctx.valueToY([datum.label]) - 5;
                },
                x1: (datum, ctx, elements, данныеView) => {
                  возврат ctx.valueToX([datum.goal]);
                },
                y1: (datum, ctx, elements, данныеView) => {
                  возврат ctx.valueToY([datum.label]) + 5;
                },
                strхорошоe: 'red',
                lineширина: 2
              }
            },
            {
              тип: 'symbol',
              данныеId: 'id0',
              видимый: true,
              style: {
                symbolType: 'triangleDown',
                x: (datum, ctx, elements, данныеView) => {
                  возврат ctx.valueToX([datum.goal]);
                },
                y: (datum, ctx, elements, данныеView) => {
                  возврат ctx.valueToY([datum.label]) - 10;
                },
                размер: 15,
                scaleY: 0.5,
                fill: 'red'
              }
            }
          ]
        }
      },
      {
        поле: 'goal',
        заголовок: 'Target',
        ширина: 'авто',
        полеFormat(rec) {
          возврат rec.goal * 100 + '%';
        },
        style: {
          цвет: 'red',
          fontWeight: 'bold'
        }
      },
      {
        поле: 'startTime',
        заголовок: 'начало Time',
        ширина: 'авто'
      },
      {
        поле: 'endTime',
        заголовок: 'конец Time',
        ширина: 'авто'
      },
      {
        поле: 'master',
        заголовок: 'Master',
        ширина: 'авто',
        style: {
          цвет: 'purple',
          fontWeight: 'bold'
        }
      }
    ];

    таблицаOptions.значение = {
      records,
      columns
    };

    возврат {
      сводныйграфикRef,
      таблицаOptions
    };
  }
});

VueVтаблица.регистрацияграфикModule('vграфик', Vграфик);

app.компонент('списоктаблица', VueVтаблица.списоктаблица);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
