---
category: examples
group: table-type
title: Pivot Table Tree
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/pivot-tree.png
link: table_type/Pivot_table/pivot_table_tree
option: PivotTable#rowHierarchyType('grid'%20%7C%20'tree')
---

# Pivot Table Tree Hierarchy(custom header tree)

Pivot table tree display, this example passes in the custom header tree structure rowTree and columnTree, and sets rowHierarchyType to tree.

It should be noted that indicatorsAsCol cannot be set to false, because it is currently not supported that indicators are placed on the row header when displayed as the header of a tree structure.

## Key Configurations

- `PivotTable`
- `rowHierarchyType` Set the hierarchical presentation to`tree`, defaults to tiling mode`grid`.
- `columnTree`
- `rowTree`
- `columns` Optional Configure, dimension styles, etc.
- `rows`Optional Configure, dimension styles, etc.
- `indicators`

## Code demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot2_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      rowTree: [
        {
          dimensionKey: 'Category',
          value: 'Furniture',
          hierarchyState: 'expand',
          children: [
            {
              dimensionKey: 'Sub-Category',
              value: 'Bookcases',
              hierarchyState: 'collapse'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Chairs',
              hierarchyState: 'collapse'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Furnishings'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Tables'
            }
          ]
        },
        {
          dimensionKey: 'Category',
          value: 'Office Supplies',
          children: [
            {
              dimensionKey: 'Sub-Category',
              value: 'Appliances'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Art'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Binders'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Envelopes'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Fasteners'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Labels'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Paper'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Storage'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Supplies'
            }
          ]
        },
        {
          dimensionKey: 'Category',
          value: 'Technology',
          children: [
            {
              dimensionKey: 'Sub-Category',
              value: 'Accessories'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Copiers'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Machines'
            },
            {
              dimensionKey: 'Sub-Category',
              value: 'Phones'
            }
          ]
        }
      ],
      columnTree: [
        {
          dimensionKey: 'Region',
          value: 'West',
          children: [
            {
              value: 'Sales',
              indicatorKey: 'Sales'
            },
            {
              value: 'Profit',
              indicatorKey: 'Profit'
            }
          ]
        },
        {
          dimensionKey: 'Region',
          value: 'South',
          children: [
            {
              value: 'Sales',
              indicatorKey: 'Sales'
            },
            {
              value: 'Profit',
              indicatorKey: 'Profit'
            }
          ]
        },
        {
          dimensionKey: 'Region',
          value: 'Central',
          children: [
            {
              value: 'Sales',
              indicatorKey: 'Sales'
            },
            {
              value: 'Profit',
              indicatorKey: 'Profit'
            }
          ]
        },
        {
          dimensionKey: 'Region',
          value: 'East',
          children: [
            {
              value: 'Sales',
              indicatorKey: 'Sales'
            },
            {
              value: 'Profit',
              indicatorKey: 'Profit'
            }
          ]
        }
      ],
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Catogery',
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          width: 'auto'
        }
      ],
      columns: [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            return '';
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: value => {
            if (value) return '$' + Number(value).toFixed(2);
            return '';
          },
          style: {
            padding: [16, 28, 16, 28],
            color(args) {
              if (args.dataValue >= 0) return 'black';
              return 'red';
            }
          }
        }
      ],
      corner: {
        titleOnDimension: 'row',
        headerStyle: {
          textStick: true
        }
      },
      rowHierarchyType: 'tree',
      widthMode: 'standard',
      rowHierarchyIndent: 20,
      rowExpandLevel: 1,
      rowHierarchyTextStartAlignment: true,
      dragHeaderMode: 'all'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window['tableInstance'] = tableInstance;
  });
```
