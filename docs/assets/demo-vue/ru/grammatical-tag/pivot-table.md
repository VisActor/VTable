---
категория: примеры
группа: grammatical-tag
заголовок: сводный Analysis таблица
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/vue-сводный-таблица.png
порядок: 1-1
ссылка: Developer_Ecology/vue
---

# сводный Analysis таблица

The props accepted по сводныйтаблица&сводныйграфик are consistent с the options, и the semantic subкомпонентs are as follows:

- сводныйColumnDimension: Configuration из dimensions на columns, consistent с the definition из columns в options [апи](../../option/сводныйтаблица-columns-текст#headerType)
- сводныйRowDimension: Configuration из dimensions на rows, consistent с the definition из rows в options [апи](../../option/сводныйтаблица-rows-текст#headerType)
- сводныйIndicator: Configuration из indicators, consistent с the definition из indicators в options [апи](../../option/сводныйтаблица-indicators-текст#cellType)
- сводныйColumnHeaderзаголовок: Configuration из column header titles, consistent с the definition из columnHeaderTitle в options [апи](../../option/сводныйтаблица#rowHeaderTitle)
- сводныйRowHeaderзаголовок: Configuration из row header titles, consistent с the definition из rowHeaderTitle в options [апи](../../option/сводныйтаблица#columnHeaderTitle)
- сводныйCorner: Configuration из corner headers, consistent с the definition из corner в options [апи](../../option/сводныйтаблица#corner)

## код демонстрацияnstration

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
  <сводныйтаблица :options="таблицаOptions" :records="данные" ref="сводныйтаблицаRef">
    <сводныйColumnDimension title="Категория" dimensionKey="Категория" :headerStyle="{ textStick: true }" ширина="авто" />

    <сводныйRowDimension
    v-для="(row, index) в rows"
    :key="index"
    :dimensionKey="row.dimensionKey"
    :title="row.title"
    :headerStyle="row.headerStyle"
    :ширина="row.ширина"
    />

    <сводныйIndicator
    v-для="(indicator, index) в indicators"
    :key="index"
    :indicatorKey="indicator.indicatorKey"
    :title="indicator.title"
    :ширина="indicator.ширина"
    :showсортировка="indicator.showсортировка"
    :headerStyle="indicator.headerStyle"
    :format="indicator.format"
    :style="indicator.style"
    />

    <сводныйCorner titleOnDimension="row" :headerStyle="{ textStick: true }" />

    <меню менюType="html" :contextменюItems="['copy', 'paste', 'delete', '...']" />
  </сводныйтаблица>
  `,
  данные() {
    возврат {
      сводныйтаблицаRef: ref(null),
      данные: ref([]),
      таблицаOptions: {
        Подсказка: {
          isShowOverflowTextПодсказка: true
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
      },
      indicators: [
        {
          indicatorKey: 'Количество',
          заголовок: 'Количество',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: { fontWeight: 'normal' },
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              возврат args.данныеValue >= 0 ? 'black' : 'red';
            }
          }
        },
        {
          indicatorKey: 'Продажи',
          заголовок: 'Продажи',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: { fontWeight: 'normal' },
          format: rec => '$' + число(rec).toFixed(2),
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              возврат args.данныеValue >= 0 ? 'black' : 'red';
            }
          }
        },
        {
          indicatorKey: 'Прибыль',
          заголовок: 'Прибыль',
          ширина: 'авто',
          showсортировка: false,
          headerStyle: { fontWeight: 'normal' },
          format: rec => '$' + число(rec).toFixed(2),
          style: {
            заполнение: [16, 28, 16, 28],
            цвет(args) {
              возврат args.данныеValue >= 0 ? 'black' : 'red';
            }
          }
        }
      ],
      rows: [
        {
          dimensionKey: 'Город',
          заголовок: 'Город',
          headerStyle: { textStick: true },
          ширина: 'авто'
        }
      ]
    };
  },
  mounted() {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_данные.json')
      .then(res => res.json())
      .then(jsonданные => {
        this.данные = jsonданные;
      });
  }
});

app.компонент('сводныйтаблица', VueVтаблица.сводныйтаблица);
app.компонент('сводныйColumnDimension', VueVтаблица.сводныйColumnDimension);
app.компонент('сводныйRowDimension', VueVтаблица.сводныйRowDimension);
app.компонент('сводныйIndicator', VueVтаблица.сводныйIndicator);
app.компонент('сводныйCorner', VueVтаблица.сводныйCorner);
app.компонент('меню', VueVтаблица.меню);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
