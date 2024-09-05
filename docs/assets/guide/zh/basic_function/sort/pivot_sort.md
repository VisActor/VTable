# 透视表排序功能

透视表的排序能力以下几种实现方式：

1. 透视表自定义表头的树形结构，rowTree 和 columnTree 都自行传入即可按照这个结构进行展示。这个时候即便配置了 sortRule 也不会起作用。此方式对于表头有默认顺序或者结构比较特殊，或者排序规则比较复杂的情况下使用，可以参考教程：https://visactor.io/vtable/guide/table_type/Pivot_table/pivot_table_tree。
2. 在维度或者指标配置中添加`sort:true`来开启排序，此时会显示排序按钮，点击按钮会触发排序。通过接口的方式进行排序：自行调用接口`updateSortRules`来排序。
3. 其他特殊需求：仅显示排序状态，不使用 VTable 的排序逻辑

**注意三种排序方式不要混用**

接下来主要介绍后面的几种实现方式和注意事项。

## 配置 sort 开启排序

### 按维度值排序

sort 的配置可以在 rows 或者 columns 中配置，此时显示维度名称的角头单元格会显示排序按钮，点击按钮会触发排序。具体触发的排序规则会对应 dataConfig.sortRule 中的配置。如果sortRule中没有匹配的排序规则，则会按照默认规则即按照拼音字母顺序进行排序。

以下是一个在 rows 中配置 sort 开启排序功能的例子：

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

在上述代码中，`sort` 为 `true`，表示行表头对应维度值支持排序，角头的单元格会显示排序图标。

### 按指标值排序

sort 的配置可以在 indicators 中配置，此时显示指标名称的行表头或者列表头单元格会显示排序按钮，点击按钮会触发排序。具体排序规则按照指标的大小进行排序。

以下是一个在 indicators 中配置 sort 开启排序功能的例子：

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

在上述代码中，`sort` 为 `true`，表示可以按指标值支持排序，行表头或者列表头的单元格会显示排序图标。

### 初始化排序状态

请配置数据分析 dataConfig.sortRule，可以设置初始排序状态。如果在相应的指标或者维度上配置了 sort ，则会出现对应的排序图标状态。

如下示例：

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

该示例配置了初始排序规则，会按照列表头维度路径为`['Central', 'Corporate', 'Sales']` 指标值进行降序排序，同时相应的表头单元格中的排序图标变为了降序状态图标。

### 通过接口更新排序

透视表的更新排序接口为`updateSortRules`，通过调用该接口可以更新排序状态。如果在相应的指标或者维度上配置了 sort ，则会出现对应的排序图标状态。

以下是一个通过接口更新排序的例子：

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

### 监听排序图标点击事件

监听排序图标点击事件为`pivot_sort_click`。


## 仅显示排序图标

如果业务场景中有专门的设置面板，有专门的排序选项提供给用户进行操作，但是需要在表格中显示对应的排序状态，那么可以配置`showSort: true` 及 `showSortInCorner: true`来显示对应的排序状态。如果有监听图标点击需求，可以监听事件`pivot_sort_click`。

同时，可以设置 option 上的 pivotSortState 来设置初始排序图标的状态。

下面看用法示例：

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

上述示例中 pivotSortState 配置了两个排序规则，会在行表头维度路径为`['Furniture']`的单元格上显示降序图标，同时会在列表头维度路径为`['Central', 'Consumer', 'Sales']`的单元格上显示升序图标。

## 其他

这里再强调一下：**教程开头提到的这三种种排序方式不要混用**，例如：sortRule 的方式不要在自定义表头树结构的情况或者配置 showSort 的情况下使用；pivotSortState 的配置也不要在配置 sort 的情况下使用。
