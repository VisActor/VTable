# Customize header dimension tree

In some business scenarios, facing huge amounts of database data and complex filtering or sorting rules, VTable's data analytics capabilities will not be able to meet business requirements. At this time, it can be achieved by customizing the row and column header dimension trees'rowTree 'and'columnTree'.

   <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/custom-tree.png" />
    <p>custom rowTree columnTree</p>
  </div>

# Example

Custom tree configuration:

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

VTable official website example: https://visactor.io/vtable/demo/table-type/pivot-table.

The complexity of custom trees lies in the formation of row and column dimension trees, which can be selected according to business scenarios. If you have complex sorting, summarization or paging rules, you can choose to use custom methods.

If rowHierarchyType is set to tree and you expect to load lazily when you click to expand the node, you also need to use a pivot table with a custom header. For the specific demo, please refer to: https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load.

# Virtual header node

In some scenarios of pivot table analysis, the table structure and data to be displayed do not match perfectly. For example, the pivot table may only have row dimensions and indicator values. When there are many fields for indicator values, you want to group the indicators by customizing column headers. In fact, the column headers are virtual, and the data records are not associated with corresponding dimension fields, and the number of levels is uncertain.

Based on this scenario, VTable provides the function of virtual header node, through which the headers on the column can be grouped. [For a specific example](../../../demo/table-type/pivot-table-virtual-header)。

Just add `virtual: true` when configuring the nodes in rowTree columnTree.

like:

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

Specific demo: https://visactor.io/vtable/demo/table-type/pivot-table-virtual-header

# Custom Header Cross-column Merge

In the nodes of rowTree or columnTree, configure levelSpan, which is 1 by default. This configuration can specify the range of header cell merging. If the maximum number of header levels is 3, there are a total of three dimension levels, and the middle dimension sets levelSpan to 2, then the last level will be merged as large as the number of levels, and there will be no space. The effect of the following example:

   <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/levelSpan-effect.jpeg" />
    <p>levelSpan</p>
  </div>
  
# Custom tree completion indicator node

By default, VTable will automatically complete the indicator node. For example, the user can pass in a dimension tree without an indicator node:

```
rowTree: [
  {
    dimensionKey: 'Region',
    value: 'North',
  }
],
```

At the same time, the user configures indicator information in indicators:

```
indicators: ['Sales', 'Profit'],
indicatorsAsCol:false,
```

VTable will automatically complete the indicator nodes into the row dimension header tree:

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

If you don't need to automatically complete indicator nodes, you can turn off automatic completion by setting `supplementIndicatorNodes: false`.

# Custom tree irregular case

The `parseCustomTreeToMatchRecords` configuration needs to be turned on if you have configured rowTree or columnTree and it is a non-regular tree structure to match the corresponding data record.

The regular tree structure refers to: the nodes on the same layer have the same dimension keys.

The non-regular tree structure is the tree where nodes on the same layer exist with different dimension values.

# Hide indicator node

In the nodes of rowTree or columnTree, configure hide: true, you can hide the indicator node.

It can also be hidden using the `hide` configuration item in `indicators`.
