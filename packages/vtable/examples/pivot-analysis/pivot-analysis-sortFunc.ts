import * as VTable from '../../src';
function getColor(min: number, max: number, n: any) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(255,0,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') {
    return 'rgb(255,255,255)';
  }
  const c = Math.max(0.1, (n - min) / (max - min));
  const red = 255;
  const green = (1 - c) * 255;
  return `rgb(${red},${green},${green})`;
}

function getColor2(min: number, max: number, n: any) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(0,255,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') {
    return 'rgb(255,255,255)';
  }
  const c = Math.max(0.1, (n - min) / (max - min));
  const green = 255;
  const red = (1 - c) * 255;
  return `rgb(${red},${green},${green})`;
}
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.PivotTableConstructorOptions = {
    rows: [
      { dimensionKey: 'province', title: 'province', sort: true },
      { dimensionKey: 'city', title: 'city', sort: true }
    ],
    columns: ['category', 'sub_category'],
    indicators: ['sales', 'number'],

    indicatorTitle: '指标名称',
    indicatorsAsCol: false,
    dataConfig: {
      sortRules: [
        {
          sortField: 'province',
          sortType: VTable.TYPES.SortType.ASC,
          sortFunc: (a, b, sortType) => {
            if (sortType === VTable.TYPES.SortType.DESC || sortType === VTable.TYPES.SortType.desc) {
              return b.toString().localeCompare(a.toString(), 'zh');
            } else if (sortType === VTable.TYPES.SortType.ASC || sortType === VTable.TYPES.SortType.asc) {
              return a.toString().localeCompare(b.toString(), 'zh');
            }
            const indexs = ['天津市', '四川省', '浙江省'];
            return indexs.indexOf(a) - indexs.indexOf(b);
          }
        },
        {
          sortField: 'city',
          sortByIndicator: 'sales',
          sortType: VTable.TYPES.SortType.DESC,
          query: ['办公用品', '笔']
        } as VTable.TYPES.SortByIndicatorRule
      ],
      mappingRules: [
        {
          bgColor: {
            indicatorKey: 'sales',
            mapping({ table, value }) {
              const max: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('sales')].max.value();
              const min: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('sales')].min.value();
              return getColor(min, max, value);
            }
          }
        },
        {
          bgColor: {
            indicatorKey: 'number',
            mapping({ table, value }) {
              const max: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('number')].max.value();
              const min: number =
                table.dataset.indicatorStatistics[table.dataset.indicatorKeys.indexOf('number')].min.value();
              return getColor2(min, max, value);
            }
          }
        }
      ]
    },
    corner: { titleOnDimension: 'row' },
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
      },
      {
        sales: 893,
        number: 3877,
        province: '天津市',
        city: '天津市',
        category: '家具',
        sub_category: '桌子'
      },
      {
        sales: 9893,
        number: 3877,
        province: '天津市',
        city: '天津市',
        category: '家具',
        sub_category: '沙发'
      }
    ],
    widthMode: 'autoWidth' // 宽度模式：standard 标准模式； adaptive 自动填满容器
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = instance;

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
