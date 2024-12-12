---
category: examples
group: grammatical-tag
title: Pivot Analysis Table
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-pivot-table.png
order: 1-1
link: Developer_Ecology/vue
---

# Pivot Analysis Table

The props accepted by PivotTable&PivotChart are consistent with the options, and the semantic subcomponents are as follows:

- PivotColumnDimension: Configuration of dimensions on columns, consistent with the definition of columns in options [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: Configuration of dimensions on rows, consistent with the definition of rows in options [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: Configuration of indicators, consistent with the definition of indicators in options [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: Configuration of column header titles, consistent with the definition of columnHeaderTitle in options [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: Configuration of row header titles, consistent with the definition of rowHeaderTitle in options [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: Configuration of corner headers, consistent with the definition of corner in options [api](../../option/PivotTable#corner)

## Code Demonstration

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
  <PivotTable :options="tableOptions" :records="data" ref="pivotTableRef">
    <PivotColumnDimension title="Category" dimensionKey="Category" :headerStyle="{ textStick: true }" width="auto" />

    <PivotRowDimension
    v-for="(row, index) in rows"
    :key="index"
    :dimensionKey="row.dimensionKey"
    :title="row.title"
    :headerStyle="row.headerStyle"
    :width="row.width"
    />

    <PivotIndicator
    v-for="(indicator, index) in indicators"
    :key="index"
    :indicatorKey="indicator.indicatorKey"
    :title="indicator.title"
    :width="indicator.width"
    :showSort="indicator.showSort"
    :headerStyle="indicator.headerStyle"
    :format="indicator.format"
    :style="indicator.style"
    />

    <PivotCorner titleOnDimension="row" :headerStyle="{ textStick: true }" />

    <Menu menuType="html" :contextMenuItems="['copy', 'paste', 'delete', '...']" />
  </PivotTable>
  `,
  data() {
    return {
      pivotTableRef: ref(null),
      data: ref([]),
      tableOptions: {
        tooltip: {
          isShowOverflowTextTooltip: true
        },
        dataConfig: {
          sortRules: [
            {
              sortField: 'Category',
              sortBy: ['Office Supplies', 'Technology', 'Furniture']
            }
          ]
        },
        widthMode: 'standard'
      },
      indicators: [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          width: 'auto',
          showSort: false,
          headerStyle: { fontWeight: 'normal' },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              return args.dataValue >= 0 ? 'black' : 'red';
            }
          }
        },
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          headerStyle: { fontWeight: 'normal' },
          format: rec => '$' + Number(rec).toFixed(2),
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              return args.dataValue >= 0 ? 'black' : 'red';
            }
          }
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          width: 'auto',
          showSort: false,
          headerStyle: { fontWeight: 'normal' },
          format: rec => '$' + Number(rec).toFixed(2),
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              return args.dataValue >= 0 ? 'black' : 'red';
            }
          }
        }
      ],
      rows: [
        {
          dimensionKey: 'City',
          title: 'City',
          headerStyle: { textStick: true },
          width: 'auto'
        }
      ]
    };
  },
  mounted() {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
      .then(res => res.json())
      .then(jsonData => {
        this.data = jsonData;
      });
  }
});

app.component('PivotTable', VueVTable.PivotTable);
app.component('PivotColumnDimension', VueVTable.PivotColumnDimension);
app.component('PivotRowDimension', VueVTable.PivotRowDimension);
app.component('PivotIndicator', VueVTable.PivotIndicator);
app.component('PivotCorner', VueVTable.PivotCorner);
app.component('Menu', VueVTable.Menu);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
