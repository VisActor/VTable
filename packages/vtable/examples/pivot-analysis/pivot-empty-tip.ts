import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    rows: ['province', 'city'],
    columns: ['category', 'sub_category'],
    indicators: ['sales', 'number'],

    indicatorTitle: '指标名称',
    indicatorsAsCol: false,
    corner: { titleOnDimension: 'column' },
    resize: {
      columnResizeType: 'all'
    },
    // records: [
    //   {
    //     sales: 891,
    //     number: 7789,
    //     province: '浙江省',
    //     city: '杭州市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   }
    // ],
    emptyTip: true,
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = instance;

  instance.on('empty_tip_dblclick', args => {
    console.log('empty_tip_dblclick', args);
  });

  // setTimeout(() => {
  //   instance.updateOption({
  //     rows: ['province', 'city'],
  //     columns: ['category', 'sub_category'],
  //     indicators: ['sales', 'number'],

  //     indicatorTitle: '指标名称',
  //     indicatorsAsCol: false,
  //     corner: { titleOnDimension: 'column' },
  //     resize: {
  //      columnResizeType: 'all'
  //     },
  //     records: [
  //       // {
  //       //   sales: 891,
  //       //   number: 7789,
  //       //   province: '浙江省',
  //       //   city: '杭州市',
  //       //   category: '家具',
  //       //   sub_category: '桌子'
  //       // }
  //     ],
  //     emptyTip: true,
  //     widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  //   });
  // }, 1000);
}
