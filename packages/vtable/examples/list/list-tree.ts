import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const data = [
    {
      类别: '办公用品',
      销售额: '129.696',
      数量: '2',
      利润: '60.704',
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
          利润: '34.56'
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
  const option: VTable.ListTableConstructorOptions = {
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
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    // autoFillHeight: true,
    // heightMode: 'adaptive',
    allowFrozenColCount: 2,
    records: data,

    hierarchyIndent: 20,
    hierarchyExpandLevel: 2,

    // sortState: {
    //   field: '销售额',
    //   order: 'desc'
    // },
    theme: VTable.themes.BRIGHT,
    defaultRowHeight: 32,
    select: {
      disableDragSelect: true
    }
  };

  const instance = new ListTable(option);
  window.tableInstance = instance;
  bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

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

  window.tableInstance = instance;
}
