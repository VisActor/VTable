# 自定义表头维度树

在某些业务场景中，面临巨量的数据库数据，以及复杂的筛选或者排序规则，VTable 的数据分析能力将无法满足业务需求，此时可以通过自定义行列表头维度树 `rowTree` 和 `columnTree` 的方式来实现。

   <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/custom-tree.png" />
    <p>custom rowTree columnTree</p>
  </div>

# 示例

自定义树的配置：

```javascript
const option = {
  rowTree: [
    {
      dimensionKey: 'region',
      value: '中南',
      children: [
        {
          dimensionKey: 'province',
          value: '广东'
        },
        {
          dimensionKey: 'province',
          value: '广西'
        }
      ]
    },
    {
      dimensionKey: 'region',
      value: '华东',
      children: [
        {
          dimensionKey: 'province',
          value: '上海'
        },
        {
          dimensionKey: 'province',
          value: '山东'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: 'year',
      value: '2016',
      children: [
        {
          dimensionKey: 'quarter',
          value: '2016-Q1',
          children: [
            {
              indicatorKey: 'sales',
              value: 'sales'
            },
            {
              indicatorKey: 'profit',
              value: 'profit'
            }
          ]
        },
        {
          dimensionKey: 'quarter',
          value: '2016-Q2',
          children: [
            {
              indicatorKey: 'sales',
              value: 'sales'
            },
            {
              indicatorKey: 'profit',
              value: 'profit'
            }
          ]
        }
      ]
    }
  ],
  indicators: ['sales', 'profit'],

  corner: {
    titleOnDimension: 'none'
  },
  records: [
    {
      region: '中南',
      province: '广东',
      year: '2016',
      quarter: '2016-Q1',
      sales: 1243,
      profit: 546
    },
    {
      region: '中南',
      province: '广东',
      year: '2016',
      quarter: '2016-Q2',
      sales: 2243,
      profit: 169
    },
    {
      region: '中南',
      province: '广西',
      year: '2016',
      quarter: '2016-Q1',
      sales: 3043,
      profit: 1546
    },
    {
      region: '中南',
      province: '广西',
      year: '2016',
      quarter: '2016-Q2',
      sales: 1463,
      profit: 609
    },
    {
      region: '华东',
      province: '上海',
      year: '2016',
      quarter: '2016-Q1',
      sales: 4003,
      profit: 1045
    },
    {
      region: '华东',
      province: '上海',
      year: '2016',
      quarter: '2016-Q2',
      sales: 5243,
      profit: 3169
    },
    {
      region: '华东',
      province: '山东',
      year: '2016',
      quarter: '2016-Q1',
      sales: 4543,
      profit: 3456
    },
    {
      region: '华东',
      province: '山东',
      year: '2016',
      quarter: '2016-Q2',
      sales: 6563,
      profit: 3409
    }
  ]
};
```

VTable 官网示例：https://visactor.io/vtable/demo/table-type/pivot-table.

自定义树的复杂在于组建行列维度树，可酌情根据业务场景来选择使用，如果具有复杂的排序、汇总或分页规则可选择使用自定义方式。

如果 rowHierarchyType 设置为 tree，并且期望点击展开节点时懒加载，那么也需要使用自定义表头的透视表，具体 demo 可参考： https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load 。

# 虚拟表头节点

在数据透视分析的一些场景中，并不是需要展示的表格结构和数据能完美匹配，例如：有可能透视表只有行维度和指标值，当指标值的字段又非常多的时候，希望通过自定义列头的形式对指标进行分组。那么分组的表头节点都是虚拟的，数据 records 并没有对应的维度字段来关联。

基于此场景下 VTable 提供了虚拟表头节点的功能，通过虚拟表头节点可以实现对列上的表头进行分组，[具体示例可参考](../../../demo/table-type/pivot-table-virtual-header)。

只需要将 rowTree columnTree 中的节点配置时添加 `virtual: true` 即可。

如：

```
        rowTree: [
          {
            dimensionKey: 'Segment-1',
            value: 'Segment-1 (virtual-node)',
            virtual: true,
            children: [
              {
                indicatorKey: 'Quantity',
                value: 'Quantity'
              },
              {
                indicatorKey: 'Sales',
                value: 'Sales'
              },
              {
                indicatorKey: 'Profit',
                value: 'Profit'
              }
            ]
          }
        ],
```

具体 demo：https://visactor.io/vtable/demo/table-type/pivot-table-virtual-header

# 自定义表头跨列合并

在 rowTree 或者 columnTree 的节点中配置 levelSpan ，默认是 1，这个配置可以指定表头单元格合并的范围。如果表头层数最大是 3，一共三层维度，中间维度设置了 levelSpan 为 2，那么最末级剩下多大就合并多大层数的单元格，也就没有空间了。如下例子的效果：

   <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/levelSpan-effect.jpeg" />
    <p>levelSpan</p>
  </div>

# 自定义树补全指标节点

默认情况下，VTable 会自动补全指标节点，如用户可以传入一个维度树，但是不带又指标节点：

```
        rowTree: [
          {
            dimensionKey: 'Region',
            value: 'North',
          }
        ],
```

同时用户在 indicators 中配置了指标信息：

```
indicators: ['Sales', 'Profit'],
indicatorsAsCol:false,
```

VTable 会自动补全指标节点到行维度表头树中：

```
      rowTree: [
          {
            dimensionKey: 'Region',
            value: 'North',
            children: [
              {
                indicatorKey: 'Sales',
                value: 'Sales'
              },
              {
                indicatorKey: 'Profit',
                value: 'Profit'
              }
            ]
          }
        ],
```

如果不需要自动补全指标节点，可通过设置 `supplementIndicatorNodes: false` 来关闭自动补全。

# 自定义树不规则情况

如果配置了 rowTree 或者 columnTree 且是非规则的树结构，为了去匹配对应的数据 record，需要开启配置 parseCustomTreeToMatchRecords。

规则的树结构指的是：同一层的节点它们的维度 key 是相同的。

非规则的树结构即树的同一层存在不同维度的维度值时。

# 隐藏某个指标节点

在 rowTree 或者 columnTree 的节点中配置 hide: true ，可以隐藏某个指标节点。

也可以用 `indicators` 中 `hide` 配置项 来隐藏。
