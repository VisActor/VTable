---
category: examples
group: table-type
title: 基本表格树形展示(懒加载子节点数据)
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-tree-lazy-load.gif
link: table_type/List_table/tree_list
option: ListTable-columns-text#tree
---

# 基本表格树形展示(懒加载子节点数据)

基本表格树形展示，开启某一列的 tree 模式，如果将对应数据的 children 设置为 true 而非具体的数据集合，那么点击时可以监听`TREE_HIERARCHY_STATE_CHANGE`事件来请求 children 数据并回传到表格组件中。

## 关键配置

- tree:true 在某一列上设置开启树形展示
- children: true 在某一行数据上设置开启树形展示 并懒加载子节点数据
- setRecordChildren(children: any[], col: number, row: number) 在某一行数据懒加载子节点数据后调用此方法回传到表格组件中
- TREE_HIERARCHY_STATE_CHANGE 树形展示状态改变事件

## 代码演示

```javascript livedemo template=vtable
// 注册loading图标
VTable.register.icon('loading', {
  type: 'image',
  width: 16,
  height: 16,
  src: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif',
  name: 'loading', //定义图标的名称，在内部会作为缓存的key值
  positionType: VTable.TYPES.IconPosition.absoluteRight, // 指定位置，可以在文本的前后，或者在绝对定位在单元格的左侧右侧
  marginLeft: 0, // 左侧内容间隔 在特定位置position中起作用
  marginRight: 4, // 右侧内容间隔 在特定位置position中起作用
  visibleTime: 'always', // 显示时机， 'always' | 'mouseover_cell' | 'click_cell'
  hover: {
    // 热区大小
    width: 22,
    height: 22,
    bgColor: 'rgba(101,117,168,0.1)'
  },
  isGif: true
});

let tableInstance;
const data = [
  {
    类别: '办公用品',
    销售额: '129.696',
    数量: '2',
    利润: '-60.704',
    children: [
      {
        类别: '信封', // 对应原子类别
        销售额: '125.44',
        数量: '2',
        利润: '42.56',
        children: [
          {
            类别: '黄色信封',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '白色信封',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '器具', // 对应原子类别
        销售额: '1375.92',
        数量: '3',
        利润: '550.2',
        children: [
          {
            类别: '订书机',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '计算器',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      }
    ]
  },
  {
    类别: '技术',
    销售额: '229.696',
    数量: '20',
    利润: '90.704',
    children: [
      {
        类别: '设备', // 对应原子类别
        销售额: '225.44',
        数量: '5',
        利润: '462.56'
      },
      {
        类别: '配件', // 对应原子类别
        销售额: '375.92',
        数量: '8',
        利润: '550.2'
      },
      {
        类别: '复印机', // 对应原子类别
        销售额: '425.44',
        数量: '7',
        利润: '342.56'
      },
      {
        类别: '电话', // 对应原子类别
        销售额: '175.92',
        数量: '6',
        利润: '750.2'
      }
    ]
  },
  {
    类别: '家具',
    销售额: '129.696',
    数量: '2',
    利润: '-60.704',
    children: [
      {
        类别: '桌子', // 对应原子类别
        销售额: '125.44',
        数量: '2',
        利润: '42.56',
        children: [
          {
            类别: '黄色桌子',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '白色桌子',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '椅子', // 对应原子类别
        销售额: '1375.92',
        数量: '3',
        利润: '550.2',
        children: [
          {
            类别: '老板椅',
            销售额: '125.44',
            数量: '2',
            利润: '42.56'
          },
          {
            类别: '沙发椅',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2'
          }
        ]
      }
    ]
  },
  {
    类别: '生活家电（懒加载）',
    销售额: '229.696',
    数量: '20',
    利润: '90.704',
    children: true
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      field: '类别',
      tree: true,
      title: '类别',
      width: 'auto',
      sort: true
    },
    {
      field: '销售额',
      title: '销售额',
      width: 'auto',
      sort: true
      // tree: true,
    },
    {
      field: '利润',
      title: '利润',
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
    field: '销售额',
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
          类别: record['类别'] + ' - 分类1', // 对应原子类别
          销售额: 2,
          数量: 5,
          利润: 4
        },
        {
          类别: record['类别'] + ' - 分类2', // 对应原子类别
          销售额: 3,
          数量: 8,
          利润: 5
        },
        {
          类别: record['类别'] + ' - 分类3（懒加载）',
          销售额: 4,
          数量: 20,
          利润: 90.704,
          children: true
        },
        {
          类别: record['类别'] + ' - 分类4', // 对应原子类别
          销售额: 5,
          数量: 6,
          利润: 7
        }
      ];
      instance.setRecordChildren(children, args.col, args.row);
    }, 2000);
  }
});
window['tableInstance'] = tableInstance;
```
