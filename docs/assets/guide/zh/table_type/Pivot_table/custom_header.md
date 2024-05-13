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

**注意：如果选择自定义树的配置方式将不开启 VTable 内部的数据聚合能力，即匹配到的数据条目中的某一条作为单元格指标值。**
