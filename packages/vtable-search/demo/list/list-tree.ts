import * as VTable from '@visactor/vtable';
import { SearchComponent } from '../../src';

const CONTAINER_ID = 'vTable';
const demoWindow = window as typeof window & {
  tableInstance?: VTable.ListTable;
  search?: SearchComponent;
};

const records = [
  {
    类别: '办公用品',
    销售额: '129.696',
    利润: '60.704',
    children: [
      {
        类别: '信封',
        销售额: '125.44',
        利润: '42.56',
        children: [
          {
            类别: '黄色信封',
            销售额: '125.44',
            利润: '42.56'
          },
          {
            类别: '白色信封',
            销售额: '1375.92',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '器具',
        销售额: '1375.92',
        利润: '550.2',
        children: [
          {
            类别: '订书机',
            销售额: '125.44',
            利润: '42.56'
          },
          {
            类别: '计算器',
            销售额: '1375.92',
            利润: '550.2'
          }
        ]
      }
    ]
  },
  {
    类别: '技术',
    销售额: '229.696',
    利润: '90.704',
    children: [
      {
        类别: '设备',
        销售额: '225.44',
        利润: '462.56'
      },
      {
        类别: '配件',
        销售额: '375.92',
        利润: '550.2'
      }
    ]
  },
  {
    类别: '办公用品',
    销售额: '129.696',
    利润: '60.704',
    children: [
      {
        类别: '信封',
        销售额: '125.44',
        利润: '42.56',
        children: [
          {
            类别: '黄色信封',
            销售额: '125.44',
            利润: '42.56'
          },
          {
            类别: '白色信封',
            销售额: '1375.92',
            利润: '550.2'
          }
        ]
      },
      {
        类别: '器具',
        销售额: '1375.92',
        利润: '550.2',
        children: [
          {
            类别: '订书机',
            销售额: '125.44',
            利润: '42.56'
          },
          {
            类别: '计算器',
            销售额: '1375.92',
            利润: '550.2'
          }
        ]
      }
    ]
  },
  {
    类别: '技术',
    销售额: '229.696',
    利润: '90.704',
    children: [
      {
        类别: '设备',
        销售额: '225.44',
        利润: '462.56'
      },
      {
        类别: '配件',
        销售额: '375.92',
        利润: '550.2'
      }
    ]
  }
];

export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    return;
  }
  const option: VTable.ListTableConstructorOptions = {
    container,
    records,
    columns: [
      {
        field: '类别',
        tree: true,
        title: '类别',
        width: 220
      },
      {
        field: '销售额',
        title: '销售额',
        width: 140
      },
      {
        field: '利润',
        title: '利润',
        width: 140
      }
    ],
    hierarchyIndent: 20,
    hierarchyExpandLevel: 2,
    defaultRowHeight: 32
  };

  const tableInstance = new VTable.ListTable(option);
  demoWindow.tableInstance = tableInstance;

  const search = new SearchComponent({
    table: tableInstance,
    autoJump: true
  });

  demoWindow.search = search;
}
