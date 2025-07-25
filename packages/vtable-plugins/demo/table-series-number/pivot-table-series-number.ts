import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import * as VTable_editors from '@visactor/vtable-editors';

import { TableSeriesNumber } from '../../src';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing',
    image:
      '<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M34 10V4H8V38L14 35" stroke="#f5a623" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 44V10H40V44L27 37.7273L14 44Z" fill="#f5a623" stroke="#f5a623" stroke-width="1" stroke-linejoin="round"/></svg>'
  }));
};
const tableSeriesNumberPlugin = new TableSeriesNumber({
  rowCount: 1000,
  colCount: 1000,
  rowHeight: 30,
  colWidth: 30
});
export function createTable() {
  window.createTableInstance = function () {
    // window.tableInstance?.release();
    const option: VTable.PivotTableConstructorOptions = {
      rows: ['province', 'city'],
      columns: ['category', 'sub_category'],
      indicators: ['sales', 'number'],
      plugins: [tableSeriesNumberPlugin],
      editor: 'input',
      editCellTrigger: ['api', 'keydown', 'doubleclick'],
      indicatorTitle: '指标名称',
      indicatorsAsCol: false,
      autoWrapText: true,
      heightMode: 'autoHeight',
      dataConfig: {
        totals: {
          row: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['province'],
            grandTotalLabel: '行总计',
            subTotalLabel: '小计'
          },
          column: {
            showGrandTotals: true,
            showSubTotals: true,
            subTotalsDimensions: ['category'],
            grandTotalLabel: '列总计',
            subTotalLabel: '小计'
          }
        }
      },
      columnResizeMode: 'header',
      corner: { titleOnDimension: 'row' },
      theme: VTable.themes.DEFAULT.extends({
        columnResize: {
          visibleOnHover: true
        }
      }),
      records: [
        {
          sales: 891,
          number: 7789,
          province: '浙江省',
          city: '杭州市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 792,
          number: 2367,
          province: '浙江省',
          city: '绍兴市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 893,
          number: 3877,
          province: '浙江省',
          city: '宁波市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 1094,
          number: 4342,
          province: '浙江省',
          city: '舟山市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 1295,
          number: 5343,
          province: '浙江省',
          city: '杭州市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 496,
          number: 632,
          province: '浙江省',
          city: '绍兴市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 1097,
          number: 7234,
          province: '浙江省',
          city: '宁波市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 998,
          number: 834,
          province: '浙江省',
          city: '舟山市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 766,
          number: 945,
          province: '浙江省',
          city: '杭州市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 990,
          number: 1304,
          province: '浙江省',
          city: '绍兴市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 891,
          number: 1145,
          province: '浙江省',
          city: '宁波市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 792,
          number: 1432,
          province: '浙江省',
          city: '舟山市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 745,
          number: 1343,
          province: '浙江省',
          city: '杭州市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 843,
          number: 1354,
          province: '浙江省',
          city: '绍兴市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 895,
          number: 1523,
          province: '浙江省',
          city: '宁波市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 965,
          number: 1634,
          province: '浙江省',
          city: '舟山市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 776,
          number: 1723,
          province: '四川省',
          city: '成都市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 634,
          number: 1822,
          province: '四川省',
          city: '绵阳市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 909,
          number: 1943,
          province: '四川省',
          city: '南充市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 399,
          number: 2330,
          province: '四川省',
          city: '乐山市',
          category: '家具',
          sub_category: '桌子'
        },
        {
          sales: 700,
          number: 2451,
          province: '四川省',
          city: '成都市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 689,
          number: 2244,
          province: '四川省',
          city: '绵阳市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 500,
          number: 2333,
          province: '四川省',
          city: '南充市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 800,
          number: 2445,
          province: '四川省',
          city: '乐山市',
          category: '家具',
          sub_category: '沙发'
        },
        {
          sales: 1044,
          number: 2335,
          province: '四川省',
          city: '成都市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 689,
          number: 245,
          province: '四川省',
          city: '绵阳市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 794,
          number: 2457,
          province: '四川省',
          city: '南充市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 566,
          number: 2458,
          province: '四川省',
          city: '乐山市',
          category: '办公用品',
          sub_category: '笔'
        },
        {
          sales: 865,
          number: 4004,
          province: '四川省',
          city: '成都市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 999,
          number: 3077,
          province: '四川省',
          city: '绵阳市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 999,
          number: 3551,
          province: '四川省',
          city: '南充市',
          category: '办公用品',
          sub_category: '纸张'
        },
        {
          sales: 999,
          number: 352,
          province: '四川省',
          city: '乐山市',
          category: '办公用品',
          sub_category: '纸张'
        }
      ],
      widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
    };
    const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID)!, option);
    window.tableInstance = tableInstance;
    tableInstance.on('click_cell', e => {
      console.log('click_cell');
    });
  };
  /** @ts-ignore */
  window.createTableInstance();
  /** @ts-ignore */
  bindDebugTool(window.tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
  /** @ts-ignore */
  // window.updateOption = function () {
  //   const records = generatePersons(40);
  //   const option: VTable.ListTableConstructorOptions = {
  //     records: records.sort((a, b) => b.id - a.id),
  //     columns,
  //     rowSeriesNumber: {},
  //     select: {
  //       outsideClickDeselect: true,
  //       headerSelectMode: 'body'
  //     },
  //     autoWrapText: true,
  //     editor: 'input-editor',
  //     overscrollBehavior: 'none',
  //     menu: {
  //       contextMenuItems: ['copy', 'paste', 'delete', '...']
  //     },
  //     plugins: [tableSeriesNumberPlugin]
  //   };
  // window.tableInstance.updateOption(option);
}

// tableInstance.scenegraph.temporarilyUpdateSelectRectStyle({stroke: false})
// }
