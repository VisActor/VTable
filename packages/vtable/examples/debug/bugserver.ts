import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const BUGSERVER_CONTAINER_ID = 'vTable';
window.BUGSERVER_SCREENSHOT = () => {
  // do nothing
};
window.BUGSERVER_RELEASE = () => {
  // do nothing
};

const VCHART_NPM_CDN = 'https://unpkg.com/@visactor/vchart@latest/build/index.min.js';

// your code here
import('https://unpkg.com/@visactor/vchart@latest/build/index.min.js')
  .then(async () => {
    VTable.register.chartModule('vchart', window.VChart.default);
    const dom = document.querySelector('#' + BUGSERVER_CONTAINER_ID);
    dom.style.width = '800px';
    dom.style.height = '400px';
    const option = {
      rows: ['province', 'city'],
      columns: ['category', 'sub_category'],
      indicators: ['sales', 'number'],
      indicatorTitle: '指标名称',
      indicatorsAsCol: false,
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
      corner: { titleOnDimension: 'row' },
      records: [
        {
          sales: 891,
          number: 77899999,
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
      widthMode: 'autoWidth', // 宽度模式：standard 标准模式； adaptive 自动填满容器
      bottomFrozenRowCount: 2,
      rightFrozenColCount: 1,
      dragHeaderMode: 'all'
    };

    option.container = dom;
    const instance = new VTable.PivotTable(option);
    bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

    window.BUGSERVER_SCREENSHOT();

    // do some unmount operation
    window.BUGSERVER_RELEASE(() => {
      instance.dispose();
    });
  })
  .catch(err => {
    console.error('Failed import CDN resource: ', err);
    window.BUGSERVER_SCREENSHOT && window.BUGSERVER_SCREENSHOT();
  });
