# Pivot table sorting function

The sorting capability of a pivot table can be implemented in the following ways:

1. To customize the tree structure of the pivot table header, you can pass rowTree and columnTree in to display the table according to this structure. In this case, even if sortRule is configured, it will not work.
2. Add `sort:true` in the dimension or indicator configuration to enable sorting. The sort button will be displayed and clicking the button will trigger sorting.
3. Sort by interface: Call the interface `updateSortRules` to sort.
4. Other special requirements: only display the sorting status, do not use the VTable sorting logic

The first way to organize the table header tree structure by yourself has been mentioned when introducing the pivot table. You can refer to the tutorial: https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_tree.

**Note that several sorting methods should not be mixed**

Next, we will mainly introduce the following implementation methods and precautions.

## Configure sort to enable sorting

### Sort by dimension value

The sort configuration can be configured in rows or columns. In this case, the header cell displaying the dimension name will display a sort button, and clicking the button will trigger the sort.

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

The sort configuration can be configured in indicators. At this time, the row header or column header cell displaying the indicator name will display a sort button, and clicking the button will trigger sorting.

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

Please configure data analysis dataConfig.sortRule to set the initial sorting state.

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

The update sorting interface of the pivot table is `updateSortRules`, which can be called to update the sorting status.

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

If there is a special setting panel in the business scenario, and there are special sorting options for users to operate, but the corresponding sorting status needs to be displayed in the table, you can configure `showSort: true` to display the sorting status. If there is a need to monitor icon clicks, you can monitor the event `pivot_sort_click`.

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

Here I would like to emphasize again: **Do not mix several sorting methods**. For example, do not use the sortRule method when you customize the table header tree structure or configure showSort; do not use the pivotSortState configuration when you configure sort.

In addition, the current sorting method is not very perfect, for example

1. Configure the sorting method of `sort:true`. Sometimes you need to set a custom sorting function to execute the sorting logic
2. Missing `pivotSortState` configuration state update interface

We will add to these later.
