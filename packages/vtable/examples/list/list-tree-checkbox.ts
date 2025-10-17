/* eslint-disable max-len */
import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);

const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];

export function createTable() {
  // let tableInstance;
  // fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  //   .then(res => res.json())
  //   .then(data => {
  //     const columns = [
  //       {
  //         field: 'Order ID',
  //         title: 'Order ID',
  //         width: 'auto',
  //         sort: true
  //       },
  //       {
  //         field: 'Customer ID',
  //         title: 'Customer ID',
  //         width: 'auto'
  //         // cellType: 'checkbox'
  //       },
  //       {
  //         field: 'Product Name',
  //         title: 'Product Name',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Category',
  //         title: 'Category',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Sub-Category',
  //         title: 'Sub-Category',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Region',
  //         title: 'Region',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'City',
  //         title: 'City',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Order Date',
  //         title: 'Order Date',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Quantity',
  //         title: 'Quantity',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Sales',
  //         title: 'Sales',
  //         width: 'auto'
  //       },
  //       {
  //         field: 'Profit',
  //         title: 'Profit',
  //         width: 'auto'
  //       }
  //     ];

  //     const option: VTable.ListTableConstructorOptions = {
  //       records: data.slice(0, 100),
  //       columns,
  //       widthMode: 'standard',
  //       groupBy: ['Category', 'Sub-Category', 'Region'],
  //       // hierarchyExpandLevel: 2,
  //       // theme: VTable.themes.DEFAULT.extends({
  //       //   groupTitleStyle: {
  //       //     fontWeight: 'bold',
  //       //     // bgColor: '#3370ff'
  //       //     bgColor: args => {
  //       //       const { col, row, table } = args;
  //       //       const index = table.getGroupTitleLevel(col, row);
  //       //       if (col > 0 && index !== undefined) {
  //       //         return titleColorPool[index % titleColorPool.length];
  //       //       }
  //       //     }
  //       //   }
  //       // }),
  //       enableTreeStickCell: true,
  //       rowSeriesNumber: {
  //         // dragOrder: true,
  //         // title: '序号',
  //         width: 'auto',
  //         headerStyle: {
  //           color: 'black',
  //           bgColor: 'pink'
  //         },
  //         format: () => {
  //           return '';
  //         },
  //         style: {
  //           color: 'red'
  //         },
  //         cellType: 'checkbox',
  //         enableTreeCheckbox: true
  //       }
  //     };
  //     tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  //     window.tableInstance = tableInstance;
  //     bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
  //   })
  //   .catch(e => {
  //     console.error(e);
  //   });

  const data = [
    {
      // _vtable_rowSeries_number:{text: 'checked', checked: true,  disable: true },
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
    },

    rowSeriesNumber: {
      // dragOrder: true,
      // title: '序号',
      width: 'auto',
      headerStyle: {
        color: 'black',
        bgColor: 'pink'
      },
      format: () => {
        return '';
      },
      style: {
        color: 'red'
      },
      cellType: 'checkbox',
      enableTreeCheckbox: true
    }
  };

  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
  setTimeout(() => {
    tableInstance.updateOption({
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
      },
      enableHeaderCheckboxCascade: false,
      enableCheckboxCascade: false,
      rowSeriesNumber: {
        // dragOrder: true,
        // title: '序号',
        width: 'auto',
        headerStyle: {
          color: 'black',
          bgColor: 'pink'
        },
        format: () => {
          return '';
        },
        style: {
          color: 'red'
        },
        cellType: 'checkbox',
        enableTreeCheckbox: true
      }
    });
  }, 3000);

  setTimeout(() => {
    tableInstance.updateOption({
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
      },
      enableHeaderCheckboxCascade: true,
      enableCheckboxCascade: true,
      rowSeriesNumber: {
        // dragOrder: true,
        // title: '序号',
        width: 'auto',
        headerStyle: {
          color: 'black',
          bgColor: 'pink'
        },
        format: () => {
          return '';
        },
        style: {
          color: 'red'
        },
        cellType: 'checkbox',
        enableTreeCheckbox: true
      }
    });
  }, 6000);
  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
