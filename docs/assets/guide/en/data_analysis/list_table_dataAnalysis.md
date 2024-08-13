# Basic table data analysis

Currently supported capabilities include sorting, filtering, and data aggregation calculations.

# Data sorting

For details, please refer to the tutorial: https://visactor.io/vtable/guide/basic_function/sort/list_sort

# Data filtering

The basic table component sets data filtering rules through the interface `updateFilterRules`, supporting value filtering and function filtering. Here is a usage example of filtering data:

```javascript
tableInstance.updateFilterRules([
  {
    filterKey: 'sex',
    filteredValues: ['boy']
  },
  {
    filterFunc: (record: Record<string, any>) => {
      return record.age > 30;
    }
  }
]);
```

In the above example, we set up value filtering through `filterKey` and `filteredValues` to only display data with a gender of "boy"; at the same time, we used function filtering to customize the filtering logic through `filterFunc` and only displayed `age The `field is the data whose age is greater than 30.

Specific example: https://visactor.io/vtable/demo/list-table-data-analysis/list-table-data-filter

To clear the data filtering rules, pass the function arguments blank`tableInstance.updateFilterRules()`.

# Data aggregation

The basic table supports aggregation calculation of data, and different aggregation methods can be set for each column, including sum, average, maximum value, minimum value, and custom function summary logic. Multiple aggregation methods can be set for the same column, and the aggregation results will be displayed in multiple rows.

## Aggregation calculation type

- To sum, set `aggregationType` to `AggregationType.SUM`
- Average, set `aggregationType` to `AggregationType.AVG`
- Maximum value, set `aggregationType` to `AggregationType.MAX`
- Minimum value, set `aggregationType` to `AggregationType.MIN`
- Count, set `aggregationType` to `AggregationType.COUNT`
- Custom function, set `aggregationType` to `AggregationType.CUSTOM`, and set custom aggregation logic through `aggregationFun`

## Aggregate value formatting function

Use `formatFun` to set the formatting function of the aggregate value, and you can customize the display format of the aggregate value.

## Aggregated result placement

Use `showOnTop` to control the display position of the aggregation results. The default is `false`, that is, the aggregation results are displayed at the bottom of the body. If set to `true`, the aggregation results are displayed at the top of the body.

Note: Currently, the aggregate value does not have the ability to customize freezing. It needs to be combined with bottomFrozonRowCount to achieve fixed display. In addition, the embarrassing thing is that topFrozonRowCount has not been added yet, so it is recommended to display the aggregation result at the bottom of the body first. Comprehensive freezing capabilities will be supported in the future.

## Aggregation configuration

Aggregation configuration can be set in the `columns` column definition or configured in the table global `option`.

### Configure aggregation method in column definition

In the column definition, the aggregation method can be configured through the `aggregation` attribute. Here is an example of an aggregation configuration:

```javascript
columns: [
  {
    field: 'salary',
    title: 'salary',
    width: 100,
    aggregation: [
      {
        aggregationType: AggregationType.MAX,
        formatFun(value) {
          return 'Maximum salary:' + Math.round(value) + 'yuan';
        }
      },
      {
        aggregationType: AggregationType.MIN,
        formatFun(value) {
          return 'Minimum salary:' + Math.round(value) + 'yuan';
        }
      },
      {
        aggregationType: AggregationType.AVG,
        showOnTop: false,
        formatFun(value, col, row, table) {
          return 'Average:' + Math.round(value) + 'Yuan (total' + table.recordsCount + 'data)';
        }
      }
    ]
  }
];
```

In the above example, we set three aggregation methods for the `salary` column: maximum value, minimum value and average value. Use `aggregationType` to specify the aggregation method, and then use `formatFun` to customize the display format of the aggregation results, and use `showOnTop` to control whether the aggregation results are displayed at the top or bottom of the body.

### Table global configuration aggregation method

In addition to configuring the aggregation method in the column definition, you can also set it in the table global configuration. Here is an example of global configuration:

```javascript
aggregation(args) {
  if (args.col === 1) {
    return [
      {
        aggregationType: AggregationType.MAX,
        formatFun(value) {
          return 'Maximum ID:' + Math.round(value) + 'number';
        }
      },
      {
        aggregationType: AggregationType.MIN,
        showOnTop: false,
        formatFun(value, col, row, table) {
          return 'Minimum ID:' + Math.round(value) + 'number';
        }
      }
    ];
  }
  if (args.field === 'salary') {
    return [
      {
        aggregationType: AggregationType.MIN,
        formatFun(value) {
          return 'Minimum salary:' + Math.round(value) + 'yuan';
        }
      },
      {
        aggregationType: AggregationType.AVG,
        showOnTop: false,
        formatFun(value, col, row, table) {
          return 'Average salary:' + Math.round(value) + 'Yuan (total' + table.recordsCount + 'data)';
        }
      }
    ];
  }
  return null;
}
```

In the above example, we set the aggregation method through the `aggregation` function of global configuration, and return different aggregation configurations according to different conditions. For example, when `args.col === 1`, we set the aggregation method of the maximum and minimum values; when `args.field === 'salary'`, we set the aggregation of the minimum and average values Way.

For specific examples, please refer to: https://visactor.io/vtable/demo/list-table-data-analysis/list-table-aggregation-multiple

The above is the tutorial document for basic table data analysis capabilities, covering the configuration and usage of data filtering and data aggregation. Hope this document can be helpful to you! If you have any questions, please feel free to ask.
