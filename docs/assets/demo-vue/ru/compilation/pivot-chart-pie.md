---
категория: примеры
группа: compilation
заголовок: сводный Combination график
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/сводный-график-pie.png
порядок: 1-1
ссылка: таблица_type/сводный_график
опция: сводныйграфик-indicators-график#cellType
---

# сводный Combination график (Pie график)

The сводный combination график integrates the Vграфик library into the таблица, enriching visualization forms и enhancing rendering Производительность.

## Key Configuration

- `сводныйграфик` initializes the таблица тип using сводныйграфик.
- `Vтаблица.регистрация.графикModule('vграфик', Vграфик)` регистрацияs the график library для rendering графикs. Currently supports Vграфик.
- `cellType: 'график'` specifies the тип as график.
- `графикModule: 'vграфик'` specifies the регистрацияed график library имя.
- `графикSpec: {}` график specification.

## 代码演示

```javascript liveдемонстрация template=vтаблица-vue
const app = createApp({
  template: `
    <vue-сводный-график :options="таблицаOptions" ref="сводныйграфикRef" @onлегендаItemНажать="handleлегендаItemНажать" :высота="800">
      <сводныйRowDimension
        v-для="row в rows"
        :key="row.dimensionKey"
        :dimensionKey="row.dimensionKey"
        :title="row.title"
        :headerStyle="row.headerStyle"
        :objectHandler="row"
      />
      <сводныйColumnDimension
        v-для="column в columns"
        :key="column.dimensionKey"
        :dimensionKey="column.dimensionKey"
        :title="column.title"
        :headerStyle="column.headerStyle"
        :objectHandler="column"
      />
      <сводныйIndicator
        v-для="indicator в indicators"
        :key="indicator.indicatorKey"
        :indicatorKey="indicator.indicatorKey"
        :title="indicator.title"
        :cellType="indicator.cellType"
        :графикModule="indicator.графикModule"
        :графикSpec="indicator.графикSpec"
        :style="indicator.style"
      />
      <сводныйCorner
        :titleOnDimension="corner.titleOnDimension"
        :headerStyle="corner.headerStyle"
      />
    </vue-сводный-график>
  `,
  данные() {
    возврат {
      сводныйграфикRef: ref(null),
      таблицаOptions: ref({}),
      rows: [{ dimensionKey: 'Order Year', заголовок: 'Order Year', headerStyle: { textStick: true } }, 'Ship Mode'],
      columns: [{ dimensionKey: 'Регион', заголовок: 'Регион', headerStyle: { textStick: true } }, 'Категория'],
      indicators: [
        {
          indicatorKey: 'Количество',
          заголовок: 'Количество',
          cellType: 'график',
          графикModule: 'vграфик',
          графикSpec: {
            тип: 'common',
            stack: true,
            тип: 'pie',
            данные: {
              id: 'данные',
              полеs: {
                'Segment-Indicator': {
                  сортировкаIndex: 1,
                  domain: ['Consumer-Количество', 'Corporate-Количество', 'Home Office-Количество']
                }
              }
            },
            Категорияполе: 'Segment-Indicator',
            valueполе: 'Количество',
            scales: [
              {
                id: 'цвет',
                тип: 'ordinal',
                domain: ['Consumer-Количество', 'Corporate-Количество', 'Home Office-Количество'],
                range: ['#2E62F1', '#4DC36A', '#FF8406']
              }
            ]
          },
          style: { заполнение: 1 }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: { автоWrapText: true }
      }
    };
  },
  методы: {
    handleлегендаItemНажать(args) {
      this.сводныйграфикRef.vтаблицаInstance.updateFilterRules([
        { filterKey: 'Segment-Indicator', filteredValues: args.значение }
      ]);
    }
  },
  mounted() {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/North_American_Superstore_сводный_график_данные.json')
      .then(res => res.json())
      .then(данные => {
        this.таблицаOptions = {
          hideIndicatorимя: true,
          rows: this.rows,
          columns: this.columns,
          indicators: this.indicators,
          records: данные,
          defaultRowвысота: 200,
          defaultHeaderRowвысота: 50,
          defaultColширина: 280,
          defaultHeaderColширина: 100,
          indicatorзаголовок: '指标',
          автоWrapText: true,
          ширинаMode: 'adaptive',
          высотаMode: 'adaptive',
          легендаs: {
            orient: 'низ',
            тип: 'discrete',
            данные: [
              { label: 'Consumer-Количество', shape: { fill: '#2E62F1', symbolType: 'circle' } },
              { label: 'Corporate-Количество', shape: { fill: '#4DC36A', symbolType: 'square' } },
              { label: 'Home Office-Количество', shape: { fill: '#FF8406', symbolType: 'square' } }
            ]
          },
          pagination: { currentPвозраст: 0, perPвозрастCount: 8 }
        };
      });
  }
});

VueVтаблица.регистрацияграфикModule('vграфик', Vграфик);

app.компонент('vue-сводный-график', VueVтаблица.сводныйграфик);
app.компонент('сводныйRowDimension', VueVтаблица.сводныйRowDimension);
app.компонент('сводныйColumnDimension', VueVтаблица.сводныйColumnDimension);
app.компонент('сводныйIndicator', VueVтаблица.сводныйIndicator);
app.компонент('сводныйCorner', VueVтаблица.сводныйCorner);

app.mount(`#${CONTAINER_ID}`);

// Релиз Vue instance, do не copy
window.пользовательскийРелиз = () => {
  app.unmount();
};
```
