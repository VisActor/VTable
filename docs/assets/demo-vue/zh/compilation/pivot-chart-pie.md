---
category: examples
group: compilation
title: 透视组合图
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-chart-pie.png
order: 1-1
link: table_type/pivot_chart
option: PivotChart-indicators-chart#cellType
---

# 透视组合图(饼图)

透视组合图将 vchart 图表库结合渲染到表格中，丰富可视化展示形式，提升渲染性能。

## 关键配置

- `PivotChart` 初始化表格类型使用 PivotChart。
- `VTable.register.chartModule('vchart', VChart)` 注册绘制图表的图表库 目前支持 VChart
- `cellType: 'chart'` 指定类型 chart
- `chartModule: 'vchart'` 指定注册的图表库名称
- `chartSpec: {}` 图表 spec

## 代码演示

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
    <vue-pivot-chart :options="tableOptions" ref="pivotChartRef" @onLegendItemClick="handleLegendItemClick" :height="800">
      <PivotRowDimension
        v-for="row in rows"
        :key="row.dimensionKey"
        :dimensionKey="row.dimensionKey"
        :title="row.title"
        :headerStyle="row.headerStyle"
        :objectHandler="row"
      />
      <PivotColumnDimension
        v-for="column in columns"
        :key="column.dimensionKey"
        :dimensionKey="column.dimensionKey"
        :title="column.title"
        :headerStyle="column.headerStyle"
        :objectHandler="column"
      />
      <PivotIndicator
        v-for="indicator in indicators"
        :key="indicator.indicatorKey"
        :indicatorKey="indicator.indicatorKey"
        :title="indicator.title"
        :cellType="indicator.cellType"
        :chartModule="indicator.chartModule"
        :chartSpec="indicator.chartSpec"
        :style="indicator.style"
      />
      <PivotCorner
        :titleOnDimension="corner.titleOnDimension"
        :headerStyle="corner.headerStyle"
      />
    </vue-pivot-chart>
  `,
  data() {
    return {
      pivotChartRef: ref(null),
      tableOptions: ref({}),
      rows: [{ dimensionKey: 'Order Year', title: 'Order Year', headerStyle: { textStick: true } }, 'Ship Mode'],
      columns: [{ dimensionKey: 'Region', title: 'Region', headerStyle: { textStick: true } }, 'Category'],
      indicators: [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'common',
            stack: true,
            type: 'pie',
            data: {
              id: 'data',
              fields: {
                'Segment-Indicator': {
                  sortIndex: 1,
                  domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity']
                }
              }
            },
            categoryField: 'Segment-Indicator',
            valueField: 'Quantity',
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity'],
                range: ['#2E62F1', '#4DC36A', '#FF8406']
              }
            ]
          },
          style: { padding: 1 }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: { autoWrapText: true }
      }
    };
  },
  methods: {
    handleLegendItemClick(args) {
      this.pivotChartRef.vTableInstance.updateFilterRules([
        { filterKey: 'Segment-Indicator', filteredValues: args.value }
      ]);
    }
  },
  mounted() {
    fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
      .then(res => res.json())
      .then(data => {
        this.tableOptions = {
          hideIndicatorName: true,
          rows: this.rows,
          columns: this.columns,
          indicators: this.indicators,
          records: data,
          defaultRowHeight: 200,
          defaultHeaderRowHeight: 50,
          defaultColWidth: 280,
          defaultHeaderColWidth: 100,
          indicatorTitle: '指标',
          autoWrapText: true,
          widthMode: 'adaptive',
          heightMode: 'adaptive',
          legends: {
            orient: 'bottom',
            type: 'discrete',
            data: [
              { label: 'Consumer-Quantity', shape: { fill: '#2E62F1', symbolType: 'circle' } },
              { label: 'Corporate-Quantity', shape: { fill: '#4DC36A', symbolType: 'square' } },
              { label: 'Home Office-Quantity', shape: { fill: '#FF8406', symbolType: 'square' } }
            ]
          },
          pagination: { currentPage: 0, perPageCount: 8 }
        };
      });
  }
});

VueVTable.registerChartModule('vchart', VChart);

app.component('vue-pivot-chart', VueVTable.PivotChart);
app.component('PivotRowDimension', VueVTable.PivotRowDimension);
app.component('PivotColumnDimension', VueVTable.PivotColumnDimension);
app.component('PivotIndicator', VueVTable.PivotIndicator);
app.component('PivotCorner', VueVTable.PivotCorner);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
