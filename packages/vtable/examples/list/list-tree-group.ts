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
      vtableMerge: true,
      vtableMergeName: '办公用品办公用品办公用品类',
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
      vtableMerge: true,
      vtableMergeName: '技术技术技术技术类',
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
      vtableMerge: true,
      vtableMergeName: '家具类',
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
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: '类别',
        tree: true,
        title: '类别',
        width: 'auto'
        // sort: true
      },
      {
        field: '销售额',
        title: '销售额',
        width: 'auto'
        // sort: true
        // tree: true,
      },
      {
        field: '利润',
        title: '利润',
        width: 'auto'
        // sort: true
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
    enableTreeNodeMerge: true
  };

  const instance = new ListTable(option);
  window.tableInstance = instance;
  bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
