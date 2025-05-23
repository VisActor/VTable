import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    rows: [
      {
        dimensionKey: 'province',
        width: 'auto',
        title: 'province--gfdsh'
      },
      'city-gjfkdshjg fjgdshfd gfjkd'
    ],
    columns: ['category', 'sub_category'],
    indicators: ['sales', 'number'],

    indicatorTitle: '指标名称',
    indicatorsAsCol: true,
    corner: { titleOnDimension: 'all' }
    // resize: {
    // columnResizeType: 'all',
    // },
    // records: [
    //   {
    //     sales: 891,
    //     number: 7789,
    //     province: '浙江省',
    //     city: '杭州市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 792,
    //     number: 2367,
    //     province: '浙江省',
    //     city: '绍兴市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 893,
    //     number: 3877,
    //     province: '浙江省',
    //     city: '宁波市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 1094,
    //     number: 4342,
    //     province: '浙江省',
    //     city: '舟山市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 1295,
    //     number: 5343,
    //     province: '浙江省',
    //     city: '杭州市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 496,
    //     number: 632,
    //     province: '浙江省',
    //     city: '绍兴市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 1097,
    //     number: 7234,
    //     province: '浙江省',
    //     city: '宁波市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 998,
    //     number: 834,
    //     province: '浙江省',
    //     city: '舟山市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 766,
    //     number: 945,
    //     province: '浙江省',
    //     city: '杭州市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 990,
    //     number: 1304,
    //     province: '浙江省',
    //     city: '绍兴市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 891,
    //     number: 1145,
    //     province: '浙江省',
    //     city: '宁波市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 792,
    //     number: 1432,
    //     province: '浙江省',
    //     city: '舟山市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 745,
    //     number: 1343,
    //     province: '浙江省',
    //     city: '杭州市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 843,
    //     number: 1354,
    //     province: '浙江省',
    //     city: '绍兴市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 895,
    //     number: 1523,
    //     province: '浙江省',
    //     city: '宁波市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 965,
    //     number: 1634,
    //     province: '浙江省',
    //     city: '舟山市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 776,
    //     number: 1723,
    //     province: '四川省',
    //     city: '成都市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 634,
    //     number: 1822,
    //     province: '四川省',
    //     city: '绵阳市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 909,
    //     number: 1943,
    //     province: '四川省',
    //     city: '南充市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 399,
    //     number: 2330,
    //     province: '四川省',
    //     city: '乐山市',
    //     category: '家具',
    //     sub_category: '桌子'
    //   },
    //   {
    //     sales: 700,
    //     number: 2451,
    //     province: '四川省',
    //     city: '成都市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 689,
    //     number: 2244,
    //     province: '四川省',
    //     city: '绵阳市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 500,
    //     number: 2333,
    //     province: '四川省',
    //     city: '南充市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 800,
    //     number: 2445,
    //     province: '四川省',
    //     city: '乐山市',
    //     category: '家具',
    //     sub_category: '沙发'
    //   },
    //   {
    //     sales: 1044,
    //     number: 2335,
    //     province: '四川省',
    //     city: '成都市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 689,
    //     number: 245,
    //     province: '四川省',
    //     city: '绵阳市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 794,
    //     number: 2457,
    //     province: '四川省',
    //     city: '南充市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 566,
    //     number: 2458,
    //     province: '四川省',
    //     city: '乐山市',
    //     category: '办公用品',
    //     sub_category: '笔'
    //   },
    //   {
    //     sales: 865,
    //     number: 4004,
    //     province: '四川省',
    //     city: '成都市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 999,
    //     number: 3077,
    //     province: '四川省',
    //     city: '绵阳市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 999,
    //     number: 3551,
    //     province: '四川省',
    //     city: '南充市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   },
    //   {
    //     sales: 999,
    //     number: 352,
    //     province: '四川省',
    //     city: '乐山市',
    //     category: '办公用品',
    //     sub_category: '纸张'
    //   }
    // ],
    // widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = instance;

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
