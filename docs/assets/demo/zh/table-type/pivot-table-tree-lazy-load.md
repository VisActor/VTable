---
category: examples
group: table-type
title: 透视表格树形节点懒加载
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-table-tree-lazy-load.gif
link: table_type/Pivot_table/pivot_table_tree
option: PivotTable#rowHierarchyType('grid'%20%7C%20'tree')
---

# 透视表格树形节点懒加载

透视表格树形展示支持展开节点时懒加载子节点数据，如果将对应 `rowTree` 中的 children 设置为 true 而非具体的数据集合，点击时可以监听`TREE_HIERARCHY_STATE_CHANGE`事件来请求 `children` 数据，数据需包括子节点对应指标数据 records 和行表头的树形结构 tree，通过接口 `setTreeNodeChildren` 设置到表格组件中。

## 关键配置

- `PivotTable` 表格类型
- `rowHierarchyType` 将层级展示设置为`tree`，默认为平铺模式`grid`。
- `columnTree` 自定义表头树结构
- `rowTree` 自定义表头树结构
- `columns` 可选 配置维度的样式等
- `rows`可选 配置维度的样式等
- `indicators` 指标配置

## 代码演示

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/pivot-tree-lazy-load-en.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: '220524114340021',
          value: 'office supplies',
          children: true
        },
        {
          dimensionKey: '220524114340021',
          value: 'Furniture',
          children: [
            {
              dimensionKey: '220524114340022',
              value: 'Company'
            },
            {
              dimensionKey: '220524114340022',
              value: 'Consumer'
            },
            {
              dimensionKey: '220524114340022',
              value: 'Small business'
            }
          ]
        },
        {
          dimensionKey: '220524114340021',
          value: 'Catering',
          children: [
            {
              dimensionKey: '220524114340022',
              value: 'Company'
            },
            {
              dimensionKey: '220524114340022',
              value: 'Consumer'
            },
            {
              dimensionKey: '220524114340022',
              value: 'Small business'
            }
          ]
        },
        {
          dimensionKey: '220524114340021',
          value: 'technology',
          children: [
            {
              dimensionKey: '220524114340022',
              value: 'Company'
            },
            {
              dimensionKey: '220524114340022',
              value: 'Consumer'
            },
            {
              dimensionKey: '220524114340022',
              value: 'Small business'
            }
          ]
        }
      ],
      columnTree: [
        {
          dimensionKey: '220524114340020',
          value: 'northeast',
          children: [
            {
              dimensionKey: '220524114340031',
              value: 'heilongjiang',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            },
            {
              dimensionKey: '220524114340031',
              value: 'jilin',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            },
            {
              dimensionKey: '220524114340031',
              value: 'liaoning',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            }
          ]
        },
        {
          dimensionKey: '220524114340020',
          value: 'North China',
          children: [
            {
              dimensionKey: '220524114340031',
              value: 'Inner Mongolia',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            },
            {
              dimensionKey: '220524114340031',
              value: 'Beijing',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            },
            {
              dimensionKey: '220524114340031',
              value: 'tianjin',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            }
          ]
        },
        {
          dimensionKey: '220524114340020',
          value: 'Middle-of-south',
          children: [
            {
              dimensionKey: '220524114340031',
              value: 'Guangdong',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            },
            {
              dimensionKey: '220524114340031',
              value: 'Guangxi',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            },
            {
              dimensionKey: '220524114340031',
              value: 'Hunan',
              children: [
                {
                  indicatorKey: '220524114340013',
                  value: 'Sales'
                },
                {
                  indicatorKey: '220524114340014',
                  value: 'Profit'
                }
              ]
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: '220524114340021',
          title: 'Category / Subdivision / Mailing method',
          headerFormat(value) {
            return `${value}`;
          },
          width: 200,
          headerStyle: {
            cursor: 'help',
            textAlign: 'center',
            borderColor: 'blue',
            color: 'purple',
            textStick: true,
            bgColor: '#6cd26f'
          }
        },
        {
          dimensionKey: '220524114340022',
          title: 'Sub-Category',
          headerStyle: {
            textAlign: 'left',
            color: 'blue',
            bgColor: '#45b89f'
          }
        },
        {
          dimensionKey: '220524114340023',
          title: 'Mailing method',
          headerStyle: {
            textAlign: 'left',
            color: 'white',
            bgColor: '#6699ff'
          }
        },
        {
          dimensionKey: '2205241143400232',
          title: 'Mailing method-1'
        }
      ],
      columns: [
        {
          dimensionKey: '220524114340020',
          title: 'Region',
          headerStyle: {
            textAlign: 'right',
            borderColor: 'blue',
            color: 'yellow',
            textStick: true,
            bgColor(arg) {
              if (
                arg.cellHeaderPaths.colHeaderPaths &&
                'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                arg.cellHeaderPaths.colHeaderPaths[0].value === 'northeast'
              ) {
                return '#bd422a';
              }
              if (
                arg.cellHeaderPaths.colHeaderPaths &&
                'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                arg.cellHeaderPaths.colHeaderPaths[0].value === 'North China'
              ) {
                return '#ff9900';
              }
              return 'gray';
            }
          }
        },
        {
          dimensionKey: '220524114340031',
          title: 'Province'
        }
      ],
      indicators: [
        {
          indicatorKey: '220524114340013',
          title: 'Sales',
          width: 'auto',
          format(value, col, row, table) {
            if (!value) {
              return '--';
            }
            return Math.floor(parseFloat(value));
          },
          headerStyle: {
            color: 'red',
            bgColor(arg) {
              if (
                arg.cellHeaderPaths.colHeaderPaths &&
                'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                arg.cellHeaderPaths.colHeaderPaths[0].value === 'northeast'
              ) {
                return '#bd422a';
              }
              if (
                arg.cellHeaderPaths.colHeaderPaths &&
                'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                arg.cellHeaderPaths.colHeaderPaths[0].value === 'North China'
              ) {
                return '#ff9900';
              }
              return 'gray';
            }
          }
        },
        {
          indicatorKey: '220524114340014',
          title: 'Profit',
          format(value) {
            if (!value) {
              return '--';
            }
            return Math.floor(parseFloat(value));
          },
          width: 'auto',
          headerStyle: {
            bgColor(arg) {
              if (
                arg.cellHeaderPaths.colHeaderPaths &&
                'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                arg.cellHeaderPaths.colHeaderPaths[0].value === 'northeast'
              ) {
                return '#bd422a';
              }
              if (
                arg.cellHeaderPaths.colHeaderPaths &&
                'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
                arg.cellHeaderPaths.colHeaderPaths[0].value === 'North China'
              ) {
                return '#ff9900';
              }
              return 'gray';
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textAlign: 'center',
          borderColor: 'red',
          color: 'red',
          fontSize: 16,
          fontWeight: 'bold',
          lineHeight: 20,
          fontFamily: 'Arial'
        }
      },
      heightMode: 'autoHeight',
      autoWrapText: true,
      widthMode: 'standard',
      rowHierarchyType: 'tree',
      rowHierarchyIndent: 20,
      theme: VTable.themes.ARCO,
      dragHeaderMode: 'all'
    };

    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
    tableInstance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
      // TODO 调用接口插入设置子节点的数据
      if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && args.originData.children === true) {
        console.log(args.originData);
        setTimeout(() => {
          let children;
          let newData;
          if (args.originData.dimensionKey === '220524114340021' && args.originData.value === 'office supplies') {
            fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/pivot-tree-lazy-load-add-1-en.json')
              .then(res => res.json())
              .then(newData => {
                children = [
                  {
                    dimensionKey: '220524114340022',
                    value: 'Company',
                    children: [
                      {
                        dimensionKey: '220524114340023',
                        value: 'Level 1',
                        children: [
                          {
                            dimensionKey: '2205241143400232',
                            value: 'Level 1'
                          },
                          {
                            dimensionKey: '2205241143400232',
                            value: 'Level 2'
                          },
                          {
                            dimensionKey: '2205241143400232',
                            value: 'Level 3'
                          }
                        ]
                      },
                      {
                        dimensionKey: '220524114340023',
                        value: 'Level 2',
                        children: [
                          {
                            dimensionKey: '2205241143400232',
                            value: 'Level 1'
                          },
                          {
                            dimensionKey: '2205241143400232',
                            value: 'Level 2'
                          },
                          {
                            dimensionKey: '2205241143400232',
                            value: 'Level 3'
                          }
                        ]
                      },
                      {
                        dimensionKey: '220524114340023',
                        value: 'Level 3'
                      }
                    ]
                  },
                  {
                    dimensionKey: '220524114340022',
                    value: 'Consumer',
                    children: true
                  },
                  {
                    dimensionKey: '220524114340022',
                    value: 'Small business'
                  }
                ];

                tableInstance.setTreeNodeChildren(children, newData, args.col, args.row);
              });
          } else if (args.originData.dimensionKey === '220524114340022' && args.originData.value === 'Consumer') {
            fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/pivot-tree-lazy-load-add-2-en.json')
              .then(res => res.json())
              .then(newData => {
                children = [
                  {
                    dimensionKey: '220524114340023',
                    value: 'Level 1'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: 'Level 1'
                  },
                  {
                    dimensionKey: '220524114340023',
                    value: 'Level 3'
                  }
                ];
                tableInstance.setTreeNodeChildren(children, newData, args.col, args.row);
              });
          }
        }, 10);
      }
    });
  });
```
