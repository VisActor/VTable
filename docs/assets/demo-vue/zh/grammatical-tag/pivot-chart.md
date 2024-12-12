---
category: examples
group: grammatical-tag
title: 透视组合图
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/vue-pivot-chart.png
order: 1-1
link: Developer_Ecology/vue
---

# 透视组合图

PivotTable&PivotChart 接受的 props 属性与 option 一致，语义化子组件如下：

- PivotColumnDimension: 列上的维度配置，同 option 中的 columns 的定义一致 [api](../../option/PivotTable-columns-text#headerType)
- PivotRowDimension: 行上的维度配置，同 option 中的 rows 的定义一致 [api](../../option/PivotTable-rows-text#headerType)
- PivotIndicator: 指标配置，同 option 中的 indicators 的定义一致 [api](../../option/PivotTable-indicators-text#cellType)
- PivotColumnHeaderTitle: 列表头标题配置，同 option 中的 columnHeaderTitle 的定义一致 [api](../../option/PivotTable#rowHeaderTitle)
- PivotRowHeaderTitle: 行头标题配置，同 option 中的 rowHeaderTitle 的定义一致 [api](../../option/PivotTable#columnHeaderTitle)
- PivotCorner: 角头配置，同 option 中的 corner 的定义一致 [api](../../option/PivotTable#corner)

## 代码演示

```javascript livedemo template=vtable-vue
const app = createApp({
  template: `
      <PivotChart :options="tableOptions" ref="pivotChartRef" @onLegendItemClick="handleLegendItemClick" :height="800"/>
   `,
  setup() {
    const pivotChartRef = ref(null);
    const tableOptions = ref({});

    const handleLegendItemClick = args => {
      console.log('handleLegendItemClick', args);
      pivotChartRef.value.vTableInstance.updateFilterRules([
        {
          filterKey: 'Segment-Indicator',
          filteredValues: args.value
        }
      ]);
    };

    onMounted(() => {
      fetch(
        'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json'
      )
        .then(res => res.json())
        .then(data => {
          const columns = [
            {
              dimensionKey: 'Region',
              title: 'Region',
              headerStyle: {
                textStick: true
              }
            },
            'Category'
          ];
          const rows = [
            {
              dimensionKey: 'Order Year',
              title: 'Order Year',
              headerStyle: {
                textStick: true
              }
            },
            'Ship Mode'
          ];
          const indicators = [
            {
              indicatorKey: 'Quantity',
              title: 'Quantity',
              width: 'auto',
              cellType: 'chart',
              chartModule: 'vchart',
              chartSpec: {
                stack: true,
                type: 'bar',
                data: {
                  id: 'data',
                  fields: {
                    'Sub-Category': {
                      sortIndex: 0,
                      domain: [
                        'Chairs',
                        'Tables',
                        'Bookcases',
                        'Furnishings',
                        'Binders',
                        'Art',
                        'Storage',
                        'Appliances',
                        'Envelopes',
                        'Fasteners',
                        'Paper',
                        'Labels',
                        'Supplies',
                        'Accessories',
                        'Phones',
                        'Copiers',
                        'Machines'
                      ]
                    },
                    'Segment-Indicator': {
                      sortIndex: 1,
                      domain: [
                        'Consumer-Quantity',
                        'Corporate-Quantity',
                        'Home Office-Quantity',
                        'Consumer-Sales',
                        'Corporate-Sales',
                        'Home Office-Sales',
                        'Consumer-Profit',
                        'Corporate-Profit',
                        'Home Office-Profit'
                      ]
                    }
                  }
                },
                xField: ['Sub-Category'],
                yField: 'Quantity',
                seriesField: 'Segment-Indicator',
                axes: [
                  { orient: 'left', visible: true, label: { visible: true } },
                  { orient: 'bottom', visible: true }
                ],
                bar: {
                  state: {
                    selected: { fill: 'yellow' },
                    selected_reverse: { opacity: 0.2 }
                  }
                },
                scales: [
                  {
                    id: 'color',
                    type: 'ordinal',
                    domain: [
                      'Consumer-Quantity',
                      'Corporate-Quantity',
                      'Home Office-Quantity',
                      'Consumer-Sales',
                      'Corporate-Sales',
                      'Home Office-Sales',
                      'Consumer-Profit',
                      'Corporate-Profit',
                      'Home Office-Profit'
                    ],
                    range: [
                      '#2E62F1',
                      '#4DC36A',
                      '#FF8406',
                      '#FFCC00',
                      '#4F44CF',
                      '#5AC8FA',
                      '#003A8C',
                      '#B08AE2',
                      '#FF6341',
                      '#98DD62',
                      '#07A199',
                      '#87DBDD'
                    ]
                  }
                ]
              },
              style: { padding: 1 }
            },
            {
              indicatorKey: 'Sales',
              title: 'Sales & Profit',
              cellType: 'chart',
              chartModule: 'vchart',
              chartSpec: {
                type: 'common',
                series: [
                  {
                    type: 'bar',
                    data: {
                      id: 'data1',
                      fields: {
                        'Sub-Category': {
                          sortIndex: 0,
                          domain: [
                            'Chairs',
                            'Tables',
                            'Bookcases',
                            'Furnishings',
                            'Binders',
                            'Art',
                            'Storage',
                            'Appliances',
                            'Envelopes',
                            'Fasteners',
                            'Paper',
                            'Labels',
                            'Supplies',
                            'Accessories',
                            'Phones',
                            'Copiers',
                            'Machines'
                          ]
                        },
                        'Segment-Indicator': {
                          sortIndex: 1,
                          domain: [
                            'Consumer-Quantity',
                            'Corporate-Quantity',
                            'Home Office-Quantity',
                            'Consumer-Sales',
                            'Corporate-Sales',
                            'Home Office-Sales',
                            'Consumer-Profit',
                            'Corporate-Profit',
                            'Home Office-Profit'
                          ]
                        }
                      }
                    },
                    stack: true,
                    xField: ['Sub-Category'],
                    yField: 'Sales',
                    seriesField: 'Segment-Indicator',
                    bar: {
                      state: {
                        selected: { fill: 'yellow' },
                        selected_reverse: { opacity: 0.2 }
                      }
                    }
                  },
                  {
                    type: 'line',
                    data: {
                      id: 'data2',
                      fields: {
                        'Sub-Category': {
                          sortIndex: 0,
                          domain: [
                            'Chairs',
                            'Tables',
                            'Bookcases',
                            'Furnishings',
                            'Binders',
                            'Art',
                            'Storage',
                            'Appliances',
                            'Envelopes',
                            'Fasteners',
                            'Paper',
                            'Labels',
                            'Supplies',
                            'Phones',
                            'Accessories',
                            'Machines',
                            'Copiers'
                          ]
                        },
                        'Segment-Indicator': {
                          sortIndex: 1,
                          domain: [
                            'Consumer-Quantity',
                            'Corporate-Quantity',
                            'Home Office-Quantity',
                            'Consumer-Sales',
                            'Corporate-Sales',
                            'Home Office-Sales',
                            'Consumer-Profit',
                            'Corporate-Profit',
                            'Home Office-Profit'
                          ]
                        }
                      }
                    },
                    stack: false,
                    xField: ['Sub-Category'],
                    yField: 'Profit',
                    seriesField: 'Segment-Indicator',
                    line: {
                      state: {
                        selected: { lineWidth: 3 },
                        selected_reverse: { lineWidth: 1 }
                      }
                    },
                    point: {
                      state: {
                        selected: { fill: 'yellow' },
                        selected_reverse: { fill: '#ddd' }
                      }
                    }
                  }
                ],
                scales: [
                  {
                    id: 'color',
                    type: 'ordinal',
                    domain: [
                      'Consumer-Quantity',
                      'Corporate-Quantity',
                      'Home Office-Quantity',
                      'Consumer-Sales',
                      'Corporate-Sales',
                      'Home Office-Sales',
                      'Consumer-Profit',
                      'Corporate-Profit',
                      'Home Office-Profit'
                    ],
                    range: [
                      '#2E62F1',
                      '#4DC36A',
                      '#FF8406',
                      '#FFCC00',
                      '#4F44CF',
                      '#5AC8FA',
                      '#003A8C',
                      '#B08AE2',
                      '#FF6341',
                      '#98DD62',
                      '#07A199',
                      '#87DBDD'
                    ]
                  }
                ]
              },
              style: { padding: 1 }
            }
          ];
          const option = {
            rows,
            columns,
            indicators,
            indicatorsAsCol: false,
            records: data,
            defaultRowHeight: 200,
            defaultHeaderRowHeight: 50,
            defaultColWidth: 280,
            defaultHeaderColWidth: 100,
            indicatorTitle: '指标',
            autoWrapText: true,
            corner: {
              titleOnDimension: 'row',
              headerStyle: { autoWrapText: true }
            },
            legends: {
              orient: 'bottom',
              type: 'discrete',
              data: [
                { label: 'Consumer-Quantity', shape: { fill: '#2E62F1', symbolType: 'circle' } },
                { label: 'Consumer-Quantity', shape: { fill: '#4DC36A', symbolType: 'square' } },
                { label: 'Home Office-Quantity', shape: { fill: '#FF8406', symbolType: 'square' } },
                { label: 'Consumer-Sales', shape: { fill: '#FFCC00', symbolType: 'square' } },
                { label: 'Consumer-Sales', shape: { fill: '#4F44CF', symbolType: 'square' } },
                { label: 'Home Office-Sales', shape: { fill: '#5AC8FA', symbolType: 'square' } },
                { label: 'Consumer-Profit', shape: { fill: '#003A8C', symbolType: 'square' } },
                { label: 'Consumer-Profit', shape: { fill: '#B08AE2', symbolType: 'square' } },
                { label: 'Home Office-Profit', shape: { fill: '#FF6341', symbolType: 'square' } }
              ]
            },
            theme: {
              bodyStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 0, 1] },
              headerStyle: { borderColor: 'gray', borderLineWidth: [0, 0, 1, 1], hover: { cellBgColor: '#CCE0FF' } },
              rowHeaderStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 0], hover: { cellBgColor: '#CCE0FF' } },
              cornerHeaderStyle: { borderColor: 'gray', borderLineWidth: [0, 1, 1, 0], hover: { cellBgColor: '' } },
              cornerRightTopCellStyle: {
                borderColor: 'gray',
                borderLineWidth: [0, 0, 1, 1],
                hover: { cellBgColor: '' }
              },
              cornerLeftBottomCellStyle: {
                borderColor: 'gray',
                borderLineWidth: [1, 1, 0, 0],
                hover: { cellBgColor: '' }
              },
              cornerRightBottomCellStyle: {
                borderColor: 'gray',
                borderLineWidth: [1, 0, 0, 1],
                hover: { cellBgColor: '' }
              },
              rightFrozenStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 1, 1], hover: { cellBgColor: '' } },
              bottomFrozenStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 1], hover: { cellBgColor: '' } },
              selectionStyle: { cellBgColor: '', cellBorderColor: '' },
              frameStyle: { borderLineWidth: 0 }
            }
          };
          tableOptions.value = option;
        });
    });

    return { tableOptions, pivotChartRef, handleLegendItemClick };
  }
});

VueVTable.registerChartModule('vchart', VChart);

app.component('PivotChart', VueVTable.PivotChart);

app.mount(`#${CONTAINER_ID}`);

// release Vue instance, do not copy
window.customRelease = () => {
  app.unmount();
};
```
