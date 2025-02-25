---
category: examples
group: table-type
title: Basic table tree display (lazy loading of child node data)
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-tree-lazy-load-en.gif
link: table_type/List_table/tree_list
option: ListTable-columns-text#tree
---

# Basic table tree display (lazy loading of child node data)

Basic table tree display, turn on the tree mode of a certain column, if the children of the corresponding data is set to true instead of a specific data collection, then when clicked, you can listen to the `TREE_HIERARCHY_STATE_CHANGE` event to request the children data and return it to the table component.

## Key Configurations

- tree:true Set to enable tree display on a certain column
- children: true Set to enable tree display on a certain row of data and lazily load child node data
- setRecordChildren(children: any[], col: number, row: number) Call this method after lazily loading child node data in a row of data and return it to the table component
- TREE_HIERARCHY_STATE_CHANGE tree display state change events

## Code Demo

```javascript livedemo template=vtable
// Register the loading icon
VTable.register.icon('loading', {
  type: 'image',
  width: 16,
  height: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  name: 'loading', // Define the name of the icon, which will be used as the key value for caching in the internal cache
  positionType: VTable.TYPES.IconPosition.absoluteRight, // Specify the position, which can be before or after the text, or left or right of the cell
  marginLeft: 0, // The left content interval in the specific position
  marginRight: 4, // The right content interval in the specific position
  visibleTime: 'always', // The display time, 'always' | 'mouseover_cell' | 'click_cell'
  hover: {
    // The size of the hot area
    width: 22,
    height: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});

let tableInstance;
const data = [
  {
    category: 'Office Supplies',
    sales: '129.696',
    quantity: '2',
    profit: '-60.704',
    children: [
      {
        category: 'envelope', // 对应原子category
        sales: '125.44',
        quantity: '2',
        profit: '42.56',
        children: [
          {
            category: 'yellow envelope',
            sales: '125.44',
            quantity: '2',
            profit: '42.56'
          },
          {
            category: 'white envelope',
            sales: '1375.92',
            quantity: '3',
            profit: '550.2'
          }
        ]
      },
      {
        category: 'utensil', // 对应原子category
        sales: '1375.92',
        quantity: '3',
        profit: '550.2',
        children: [
          {
            category: 'stapler',
            sales: '125.44',
            quantity: '2',
            profit: '42.56'
          },
          {
            category: 'calculator',
            sales: '1375.92',
            quantity: '3',
            profit: '550.2'
          }
        ]
      }
    ]
  },
  {
    category: 'technology',
    sales: '229.696',
    quantity: '20',
    profit: '90.704',
    children: [
      {
        category: 'equipment', // 对应原子category
        sales: '225.44',
        quantity: '5',
        profit: '462.56'
      },
      {
        category: 'Accessories', // 对应原子category
        sales: '375.92',
        quantity: '8',
        profit: '550.2'
      },
      {
        category: 'copier', // 对应原子category
        sales: '425.44',
        quantity: '7',
        profit: '342.56'
      },
      {
        category: 'telephone', // 对应原子category
        sales: '175.92',
        quantity: '6',
        profit: '750.2'
      }
    ]
  },
  {
    category: 'furniture',
    sales: '129.696',
    quantity: '2',
    profit: '-60.704',
    children: [
      {
        category: 'desk', // 对应原子category
        sales: '125.44',
        quantity: '2',
        profit: '42.56',
        children: [
          {
            category: 'yellow desk',
            sales: '125.44',
            quantity: '2',
            profit: '42.56'
          },
          {
            category: 'white desk',
            sales: '1375.92',
            quantity: '3',
            profit: '550.2'
          }
        ]
      },
      {
        category: 'chair', // 对应原子category
        sales: '1375.92',
        quantity: '3',
        profit: '550.2',
        children: [
          {
            category: 'boss chairs',
            sales: '125.44',
            quantity: '2',
            profit: '42.56'
          },
          {
            category: 'sofa chair',
            sales: '1375.92',
            quantity: '3',
            profit: '550.2'
          }
        ]
      }
    ]
  },
  {
    category: 'Home appliances(lazy load)',
    sales: '229.696',
    quantity: '20',
    profit: '90.704',
    children: true
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      field: 'category',
      tree: true,
      title: 'category',
      width: 'auto',
      sort: true
    },
    {
      field: 'sales',
      title: 'sales',
      width: 'auto',
      sort: true
      // tree: true,
    },
    {
      field: 'profit',
      title: 'profit',
      width: 'auto',
      sort: true
    }
  ],
  showPin: true, //显示VTable内置冻结列图标
  widthMode: 'standard',
  allowFrozenColCount: 2,
  records: data,

  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,
  hierarchyTextStartAlignment: true,
  sortState: {
    field: 'sales',
    order: 'asc'
  },
  theme: VTable.themes.BRIGHT,
  defaultRowHeight: 32
};

const instance = new VTable.ListTable(option);

const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
instance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
  // TODO 调用接口插入设置子节点的数据
  if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && !Array.isArray(args.originData.children)) {
    const record = args.originData;
    instance.setLoadingHierarchyState(args.col, args.row);
    setTimeout(() => {
      const children = [
        {
          category: record['category'] + ' - category 1',
          sales: 2,
          quantity: 5,
          profit: 4
        },
        {
          category: record['category'] + ' - category 2',
          sales: 3,
          quantity: 8,
          profit: 5
        },
        {
          category: record['category'] + ' - category 3(lazy load)',
          sales: 4,
          quantity: 20,
          profit: 90.704,
          children: true
        },
        {
          category: record['category'] + ' - category 4',
          sales: 5,
          quantity: 6,
          profit: 7
        }
      ];
      instance.setRecordChildren(children, args.col, args.row);
    }, 2000);
  }
});
window['tableInstance'] = tableInstance;
```
