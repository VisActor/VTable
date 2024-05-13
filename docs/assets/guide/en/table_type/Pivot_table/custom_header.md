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

**Note: If you choose the configuration method of the custom tree, the data aggregation capability inside VTable will not be enabled, that is, one of the matched data entries will be used as the cell indicator value.**
