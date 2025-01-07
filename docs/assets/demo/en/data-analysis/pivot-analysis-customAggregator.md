---
category: examples
group: data-analysis
title: Custom Aggregator Types for Pivot Tables
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-analysis-customAggregator.png
link: data_analysis/pivot_table_dataAnalysis
option: PivotTable#dataConfig.aggregationRules
---

# Pivot Analysis - Custom Aggregator Type

Pivot analysis tables can perform aggregation calculations on pivot table metrics through the aggregationRules configuration item in the dataConfig. In addition to the built-in aggregation types such as SUM, COUNT, AVERAGE, MAX, and MIN, custom aggregation types are also supported. To use custom aggregation types, you need to first define a custom aggregation class that inherits from the built-in Aggregator class, register it to VTable, and then implement the aggregation logic in the custom aggregation class.

## Key Configurations

- `PivotTable`
- `columns`
- `rows`
- `indicators`
- `dataConfig.aggregationRules` configures the aggregation fields

## Code Demonstration

```javascript livedemo template=vtable
let tableInstance;
class AvgPriceAggregator extends VTable.TYPES.Aggregator {
  sales_sum = 0;
  number_sum = 0;
  constructor(config) {
    super(config);
    this.key = config.key;
    this.formatFun = config.formatFun;
  }
  push(record) {
    if (record) {
      if (record.isAggregator) {
        this.records.push(...record.records);
      } else {
        this.records.push(record);
      }

      if (record.isAggregator) {
        this.sales_sum += record.sales_sum;
        this.number_sum += record.number_sum;
      } else {
        record.Sales && (this.sales_sum += parseFloat(record.Sales));
        record.Quantity && (this.number_sum += parseFloat(record.Quantity));
      }
    }
    this.clearCacheValue();
  }

  clearCacheValue() {
    this._formatedValue = undefined;
  }
  value() {
    return this.records?.length >= 1 ? this.sales_sum / this.number_sum : undefined;
  }
  reset() {
    super.reset();
    this.sales_sum = 0;
    this.number_sum = 0;
  }
}
VTable.register.aggregator('avgPrice', AvgPriceAggregator);
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.dataValue === 'Row Totals') {
                return '#ff9900';
              }
              return '#ECF1F5';
            }
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          headerStyle: {
            textStick: true,
            bgColor(arg) {
              if (arg.dataValue === 'Sub Totals') {
                return '#ba54ba';
              }
              return '#ECF1F5';
            }
          },
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'AvgPrice(CalculatedField)',
          title: 'AvgPrice',
          width: 'auto',
          format: rec => {
            return '$' + Number(rec).toFixed(2);
          }
        },
        { indicatorKey: 'AvgPrice(CustomAggregator)', title: 'AvgPrice CustomAggregator', width: 'auto' }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      dataConfig: {
        aggregationRules: [
          {
            indicatorKey: 'AvgPrice(CustomAggregator)',
            aggregationType: 'avgPrice',
            field: ['Sales', 'Quantity'] // Fields used for aggregation calculation logic
          }
        ],
        calculatedFieldRules: [
          {
            key: 'AvgPrice(CalculatedField)',
            dependIndicatorKeys: ['Quantity', 'Sales'],
            calculateFun: dependValue => {
              return dependValue.Sales / dependValue.Quantity;
            }
          }
        ],
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Category'],
            grandTotalLabel: 'Row Totals',
            subTotalLabel: 'Sub Totals'
          },
          column: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['Region'],
            grandTotalLabel: 'Column Totals',
            subTotalLabel: 'Sub Totals'
          }
        }
      },
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
