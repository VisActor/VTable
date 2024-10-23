# Pivot table sorting function

The sorting capability of a pivot table can be implemented in the following ways:

1. Pivot table customizes the tree structure of the table header. RowTree and columnTree can be passed in and displayed according to this structure. At this time, even if sortRule is configured, it will not work. This method is used when the table header has a default order or a special structure, or the sorting rules are complex. You can refer to the tutorial: https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_tree.
2. Add `sort:true` in the dimension or indicator configuration to enable sorting. The sort button will be displayed and clicking the button will trigger sorting. Sorting through the interface: Call the interface `updateSortRules` to sort.
3. Other special requirements: only display the sorting status, do not use the VTable sorting logic

**Note that the three sorting methods should not be mixed**

Next, we will mainly introduce the following implementation methods and precautions.

## Configure sort to enable sorting

### Sort by dimension value

The sort configuration can be set in rows or columns, at which point the corner cells displaying the dimension names will display sort buttons, and clicking the buttons will trigger sorting. The specific sorting rules triggered will correspond to the configurations in dataConfig.sortRule. If there is no matching sorting rule in sortRule, it will sort according to the default rule, which is alphabetical order.

The following is an example of configuring sort in rows to enable sorting:

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          sort: true
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          sort: true
        }
      ],
      columns: ['Region', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales'
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit'
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColWidth: 130
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```

In the above code, `sort` is `true`, which means that the dimension values corresponding to the row headers can be sorted, and the cells in the corner headers will display the sort icon.

### Sort by indicator value

The configuration of sort can be set in indicators, at which point the row header or column header cells displaying the indicator names will display sort buttons, and clicking the buttons will trigger sorting. The specific sorting rules are sorted by the size of the indicator.

Here is an example of configuring sort in indicators to enable sorting:

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: ['Category', 'Sub-Category'],
      columns: ['Region', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          sort: true
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          sort: true
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColWidth: 130
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```

In the above code, `sort` is `true`, which means that sorting is supported by indicator value, and the cells in the row header or column header will display the sort icon.

### Initialize sorting status

Please configure the data analysis dataConfig.sortRule to set the initial sorting state. If sort is configured on the corresponding indicator or dimension, the corresponding sorting icon state will appear.

The following example:

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: ['Category', 'Sub-Category'],
      columns: ['Region', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          sort: true
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          sort: true
        }
      ],
      dataConfig: {
        sortRules: [
          {
            sortField: 'Sub-Category',
            sortByIndicator: 'Sales',
            sortType: VTable.TYPES.SortType.DESC,
            query: ['Central', 'Corporate']
          }
        ]
      },
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColWidth: 130
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```

This example configures the initial sorting rule, which sorts the indicator values in descending order according to the column header dimension path of `['Central', 'Corporate', 'Sales']`. At the same time, the sorting icon in the corresponding header cell changes to the descending state icon.

### Update sorting through the interface

The update sorting interface of the pivot table is `updateSortRules`, which can be called to update the sorting status.If sort is configured on the corresponding indicator or dimension, the corresponding sorting icon state will appear.

Here is an example of updating the order through the interface:

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: ['Category', 'Sub-Category'],
      columns: ['Region', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          sort: true
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          sort: true
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      defaultColWidth: 130
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
    tableInstance.updateSortRules([
      {
        sortField: 'Sub-Category',
        sortByIndicator: 'Sales',
        sortType: VTable.TYPES.SortType.DESC,
        query: ['Central', 'Corporate']
      }
    ]);
  });
```

### Listen for sort icon click events

The sort icon click event is monitored as `pivot_sort_click`.

## Sorting by interface

If you need to sort through the interface, you can update the sorting status by calling the `updateSortRules` interface.

## Show only sort icons

If there is a special setting panel in the business scenario, and there are special sorting options for users to operate, but the corresponding sorting status needs to be displayed in the table, you can configure `showSort: true` or `showSortInCorner: true` to display the sorting status. If there is a need to monitor icon clicks, you can monitor the event `pivot_sort_click`.

At the same time, you can set pivotSortState on option to set the state of the initial sort icon.

Let’s look at the usage example:

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          showSort: true
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          showSort: true
        }
      ],
      columns: ['Region', 'Segment'],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          showSort: true
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          showSort: true
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      pivotSortState: [
        {
          dimensions: [
            {
              dimensionKey: 'Category',
              value: 'Furniture',
              isPivotCorner: false,
              indicatorKey: undefined
            }
          ],
          order: 'desc'
        },
        {
          dimensions: [
            {
              dimensionKey: 'Region',
              value: 'Central',
              isPivotCorner: false,
              indicatorKey: undefined
            },
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              isPivotCorner: false,
              indicatorKey: undefined
            },
            {
              indicatorKey: 'Sales',
              value: 'Sales',
              isPivotCorner: false
            }
          ],
          order: 'asc'
        }
      ],
      defaultColWidth: 130
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
    tableInstance.on('pivot_sort_click', e => {
      console.log(e);
      // 执行业务逻辑 ...
      // 如果执行业务逻辑后还需要更新排序状态，可以先调用updateOption来更新配置，目前还未提供专门更新的接口
    });
  });
```

In the above example, pivotSortState is configured with two sorting rules. It will display descending icons on cells with dimension path ['Furniture'] in the row header, and ascending icons on cells with dimension path ['Central', 'Consumer', 'Sales'] in the column header.

## other

Here's another emphasis: **the three sorting methods mentioned at the beginning of the tutorial should not be mixed**, for example: the sortRule method should not be used in cases where a custom table header tree structure is defined or showSort is configured; similarly, the pivotSortState configuration should not be used when sort is configured.