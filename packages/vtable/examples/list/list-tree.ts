import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
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
          类别: '设备1', // 对应原子类别
          销售额: '425.44',
          数量: '7',
          利润: '342.56'
        },
        {
          类别: '配件1', // 对应原子类别
          销售额: '175.92',
          数量: '6',
          利润: '750.2'
        }
      ]
    },
    {
      类别: '办公用品11',
      销售额: '129.696',
      数量: '2',
      利润: '-60.704',
      children: [
        {
          类别: '信封11', // 对应原子类别
          销售额: '125.44',
          数量: '2',
          利润: '42.56',
          children: [
            {
              类别: '黄色信封11',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '白色信封11',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        },
        {
          类别: '器具11', // 对应原子类别
          销售额: '1375.92',
          数量: '3',
          利润: '550.2',
          children: [
            {
              类别: '订书机11',
              销售额: '125.44',
              数量: '2',
              利润: '42.56'
            },
            {
              类别: '计算器11',
              销售额: '1375.92',
              数量: '3',
              利润: '550.2'
            }
          ]
        }
      ]
    },
    {
      类别: '技术11',
      销售额: '229.696',
      数量: '20',
      利润: '90.704'
      // children: [
      //   {
      //     类别: '设备11', // 对应原子类别
      //     销售额: '225.44',
      //     数量: '5',
      //     利润: '462.56',
      //   },
      //   {
      //     类别: '配件11', // 对应原子类别
      //     销售额: '375.92',
      //     数量: '8',
      //     利润: '550.2',
      //   },
      //   {
      //     类别: '设备11', // 对应原子类别
      //     销售额: '425.44',
      //     数量: '7',
      //     利润: '342.56',
      //   },
      //   {
      //     类别: '配件11', // 对应原子类别
      //     销售额: '175.92',
      //     数量: '6',
      //     利润: '750.2',
      //   },
      // ],
    },
    {
      类别: '技术22',
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
        caption: '类别',
        width: 'auto',
        sort: true
      },
      {
        field: '销售额',
        caption: '销售额',
        width: 'auto',
        sort: true
        // tree: true,
      },
      {
        field: '利润',
        caption: '利润',
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

    sortState: {
      field: '销售额',
      order: 'asc'
    },
    theme: VTable.themes.BRIGHT,
    defaultRowHeight: 32
  };

  const instance = new ListTable(option);

  const { TREE_HIERARCHY_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  instance.on(TREE_HIERARCHY_STATE_CHANGE, args => {
    console.log(TREE_HIERARCHY_STATE_CHANGE, args);
    // TODO 调用接口插入设置子节点的数据
    if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && !Array.isArray(args.originData.children)) {
      instance.setRecord(
        {
          类别: '技术22',
          销售额: '229.696',
          数量: '20',
          利润: '90.704',
          children: [
            {
              类别: '设备22', // 对应原子类别
              销售额: 2,
              数量: 5,
              利润: 4
            },
            {
              类别: '配件22', // 对应原子类别
              销售额: 3,
              数量: 8,
              利润: 5
            },
            {
              类别: '技术22',
              销售额: 229.696,
              数量: 20,
              利润: 90.704,
              children: true
            },
            {
              类别: '配件33', // 对应原子类别
              销售额: 1,
              数量: 6,
              利润: 7
            }
          ]
        },
        args.col,
        args.row
      );
    }
  });

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // 只为了方便控制太调试用，不要拷贝
  (window as any).tableInstance = instance;
}
