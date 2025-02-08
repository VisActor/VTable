# 透视表树形结构

透视表支持在行表头和列表头展示树形结构，提供了多种展示模式以满足不同的数据展示需求。

## 树形展示模式

### 行表头树形展示模式 (rowHierarchyType)

行表头支持以下三种展示模式：

1. `grid` - 默认模式，以网格形式展示所有层级
2. `tree` - 传统树形结构，在单列中通过缩进展示父子层级关系
3. `grid-tree` - 网格树形结构，结合网格和树形特点，每个维度占据一列并支持展开/收起操作

具体相关配置项：

- indicatorsAsCol：指标是否作为列表头展示，默认为 true；注意：rowHierarchyType为`tree`时指标必须显示在列表头上；
- rowHierarchyType：设置行表头层级维度结构的显示形式，将其设置为 'tree' 来实现树形展示；
- rowExpandLevel：设置默认展开层数；
- rowHierarchyIndent：设置子层级维度值相比父级维度值在单元格中位置的缩进距离。
- rowHierarchyTextStartAlignment:同层级的结点是否按文字对齐 如没有收起展开图标的节点和有图标的节点文字对齐 默认 false。
- hierarchyState：设置节点的折叠状态，该项在 rowTree 或者 columnTree 的节点中进行配置。
- extensionRows：特殊的树形结构展示，需要展示多列树形结构的情况下设置该树形。需要注意的是：
  - rowExpandLevel 只对外层主树 rowTree 起作用，对 extensionRows 中的树不生效。
  - 针对这种多列的树形结构，拖拽移动表头能力不支持。
  - updateOption 调用后，非 rowTree 节点收起展开的状态的维护不支持。

### 列表头树形展示模式 (columnHierarchyType)

列表头支持以下两种展示模式：

1. `grid` - 默认模式，以网格形式展示所有层级
2. `grid-tree` - 网格树形结构，每个维度占据一行并支持展开/收起操作

具体相关配置项：

- indicatorsAsCol：指标是否作为列表头展示，默认为 true；
- columnHierarchyType：设置行表头层级维度结构的显示形式，将其设置为 'tree' 来实现树形展示；
- columnExpandLevel：设置默认展开层数；

## 用法示例

然后，以下是完整的配置示例代码及效果：

```javascript livedemo   template=vtable
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then((res) => res.json())
    .then((data) => {
const option = {
    rows: ['Order Year','Region', 'Segment','Ship Mode'],
    columns: ['Category', 'Sub-Category'],
    indicators: ['Sales', 'Profit'],
    enableDataAnalysis: true,
    indicatorTitle: '指标名称',
    //indicatorsAsCol: false,
    rowHierarchyType:'tree',
    columnHierarchyType:'grid-tree',
    corner: { titleOnDimension: 'row' },
    dataConfig: {
      totals: {
        row: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Order Year','Region', 'Segment'],
          grandTotalLabel: '行总计',
          subTotalLabel: '小计'
        },
        column: {
          showGrandTotals: true,
          showSubTotals: true,
          subTotalsDimensions: ['Category'],
          grandTotalLabel: '列总计',
          subTotalLabel: '小计'
        }
      }
    },
    records:data,
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };


const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);

    })
```

可以看到，示例中透视表的行表头树形展示模式设置为`tree`，列表头树形展示模式设置为`grid-tree`。

## 指定表头某个节点的收起或者展开状态

上述示例中可以设置数据节点的 `hierarchyState` 来指定节点的收起或者展开状态，其值为 `expand` 或者 `collapse`。

例如指定 rowTree 某个节点为展开状态：`hierarchyState: 'expand'`。

```javascript
const option = {
  rowTree: [
    {
      dimensionKey: '230627170530016',
      value: 'Furniture',
      hierarchyState: 'expand',
      children: [
        // ...
      ]
    }
  ]
};
```

## 子节点数据懒加载用法

如果不期望把所有数据在初始化时都提供到，而是在节点展开时再去加载数据，则可以按如下用法。

**限制：懒加载用法目前仅支持自定义表头结构的情况。自定义表头结构可参考：https://visactor.io/vtable/guide/table_type/Pivot_table/custom_header**

实现懒加载重要的两个工作点有：

1. 组织好`rowTree`和`columnTree`, 如果需要懒加载，则`children`属性值为`true`，否则为数组子节点。

如下：

```javascript
rowTree: [
  {
    dimensionKey: 'region',
    value: '中南',
    children: true
  },
  {
    dimensionKey: 'region',
    value: '华东',
    children: true
  }
];
```

2. 在`tree_hierarchy_state_change`事件回调中，根据当前展开节点，请求数据，并通过接口`setTreeNodeChildren`设置到当前的`rowTree`中对应节点的的`children`属性上, 以及把指标数据 records 增加到 table 中。

```javascript
tableInstance.on(tree_hierarchy_state_change, args => {
  if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && args.originData.children === true) {
    tableInstance.setTreeNodeChildren(newChildren, newData, args.col, args.row);
  }
});
```

具体 demo 可参考： https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load

## 行表头多层树结构配置代码示例

透视表常见需求是一层树形结构就可以搞定，但某些特殊业务想要多层级结构来展示数据，如期望可以看到不同类别下不同区域的销售情况。

关键配置项：

```
    extensionRows: [
      //扩展的行表头维度组，因为可能扩展多个所以这里是个数组形式
      {
        rows: [
          {
            dimensionKey: 'region',
            title: 'region',
            headerStyle: { color: 'red', textStick: true },
            width: '200'
          },
          { dimensionKey: 'province', title: 'province', headerStyle: { color: 'purple' }, width: 300 }
        ],
        rowTree: [
          {
            dimensionKey: 'region',
            value: '东北',
            children: [
              { dimensionKey: 'province', value: '黑龙江' },
              { dimensionKey: 'province', value: '吉林' }
            ]
          },
          {
            dimensionKey: 'region',
            value: '华北',
            children: [{ dimensionKey: 'province', value: '河北' }]
          }
        ]
      },
      {
        rows: [
          { dimensionKey: 'year', title: 'year', headerStyle: { color: 'pink' }, width: 'auto' },
          'quarter'
        ],
        rowTree(args) {
          if (args[1]?.value === '黑龙江') {
            return [
              {
                dimensionKey: 'year',
                value: '2019',
                children: [
                  { dimensionKey: 'quarter', value: '2019Q2' },
                  { dimensionKey: 'quarter', value: '2019Q3' }
                ]
              }
            ];
          }
          return [
            {
              dimensionKey: 'year',
              value: '2018',
              children: [
                { dimensionKey: 'quarter', value: '2018Q1' },
                { dimensionKey: 'quarter', value: '2018Q2' }
              ]
            }
          ];
        }
      }
    ],
```

呈现结果如下图：

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/multi-tree.jpeg)

本教程到此结束，希望能帮助您更好地掌握透视表树形结构展功能的使用方法！
