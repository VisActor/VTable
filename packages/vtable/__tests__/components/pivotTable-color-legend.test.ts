// @ts-nocheck
// 有问题可对照demo unitTestListTable
import * as VTable from '../../src/index';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-color-legend init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  function getColor(min, max, n) {
    if (max === min) {
      if (n > 0) {
        return 'rgb(255,0,0)';
      }
      return 'rgb(255,255,255)';
    }
    if (n === '') {
      return 'rgb(255,255,255)';
    }
    const c = (n - min) / (max - min) + 0.1;
    const red = (1 - c) * 200 + 55;
    const green = (1 - c) * 200 + 55;
    return `rgb(${red},${green},255)`;
  }
  const option = {
    resize: {
      columnResizeType: 'all'
    },
    records: [
      {
        220922103859011: '936196.0161590576',
        220922103859014: 'North East',
        220922103859015: 'Technology'
      },
      {
        220922103859011: '824673.0542612076',
        220922103859014: 'North East',
        220922103859015: 'Office Supplies'
      },
      {
        220922103859011: '920698.4041175842',
        220922103859014: 'North East',
        220922103859015: 'Furniture'
      },
      {
        220922103859011: '1466575.628829956',
        220922103859014: 'Central South',
        220922103859015: 'Technology'
      },
      {
        220922103859011: '1270911.2654294968',
        220922103859014: 'Central South',
        220922103859015: 'Office Supplies'
      },
      {
        220922103859011: '1399928.2008514404',
        220922103859014: 'Central South',
        220922103859015: 'Furniture'
      },
      {
        220922103859011: '1599653.7198867798',
        220922103859014: 'East China',
        220922103859015: 'Technology'
      },
      {
        220922103859011: '1408628.5947360992',
        220922103859014: 'East China',
        220922103859015: 'Office Supplies'
      },
      {
        220922103859011: '1676224.1276245117',
        220922103859014: 'East China',
        220922103859015: 'Furniture'
      },
      {
        220922103859011: '781743.5634155273',
        220922103859014: 'North China',
        220922103859015: 'Technology'
      },
      {
        220922103859011: '745813.5155878067',
        220922103859014: 'North China',
        220922103859015: 'Office Supplies'
      },
      {
        220922103859011: '919743.9351348877',
        220922103859014: 'North China',
        220922103859015: 'Furniture'
      },
      {
        220922103859011: '230956.3768310547',
        220922103859014: 'North West',
        220922103859015: 'Technology'
      },
      {
        220922103859011: '267870.7928543091',
        220922103859014: 'North West',
        220922103859015: 'Office Supplies'
      },
      {
        220922103859011: '316212.42824935913',
        220922103859014: 'North West',
        220922103859015: 'Furniture'
      },
      {
        220922103859011: '453898.2000274658',
        220922103859014: 'South West',
        220922103859015: 'Technology'
      },
      {
        220922103859011: '347692.57691955566',
        220922103859014: 'South West',
        220922103859015: 'Office Supplies'
      },
      {
        220922103859011: '501533.7320175171',
        220922103859014: 'South West',
        220922103859015: 'Furniture'
      }
    ],
    rowTree: [
      {
        dimensionKey: '220922103859014',
        value: 'North East'
      },
      {
        dimensionKey: '220922103859014',
        value: 'Central South'
      },
      {
        dimensionKey: '220922103859014',
        value: 'East China'
      },
      {
        dimensionKey: '220922103859014',
        value: 'North China'
      },
      {
        dimensionKey: '220922103859014',
        value: 'North West'
      },
      {
        dimensionKey: '220922103859014',
        value: 'South West'
      }
    ],
    columnTree: [
      {
        dimensionKey: '220922103859015',
        value: 'Technology',
        children: [
          {
            indicatorKey: '220922103859011'
          }
        ]
      },
      {
        dimensionKey: '220922103859015',
        value: 'Office Supplies',
        children: [
          {
            indicatorKey: '220922103859011'
          }
        ]
      },
      {
        dimensionKey: '220922103859015',
        value: 'Furniture',
        children: [
          {
            indicatorKey: '220922103859011'
          }
        ]
      }
    ],
    rows: [
      {
        dimensionKey: '220922103859014',
        title: 'Area',
        width: 'auto',
        showSort: false,
        headerType: 'link',
        linkDetect: true,
        linkJump: false
      }
    ],
    columns: [
      {
        dimensionKey: '220922103859015',
        title: 'Category',
        headerStyle: {
          textAlign: 'right'
        },
        showSort: false,
        headerType: 'link',
        linkDetect: true,
        linkJump: false
      }
    ],
    indicators: [
      {
        indicatorKey: '220922103859011',
        width: 200,
        showSort: false,
        format(rec) {
          return Math.round(rec['220922103859011']);
        },
        style: {
          bgColor: args => {
            return getColor(100000, 2000000, args.dataValue);
          }
        }
      }
    ],
    corner: {
      titleOnDimension: 'none',
      headerStyle: {
        textStick: true
      }
    },
    hideIndicatorName: true,
    theme: {
      defaultStyle: {
        borderLineWidth: 0,
        fontFamily: 'Arial'
      },
      bodyStyle: {
        color: 'white',
        fontFamily: 'Arial'
      },
      headerStyle: { fontFamily: 'Arial' }
    },
    legends: {
      orient: 'top',
      position: 'start',
      type: 'color',
      colors: ['rgb(235,235,255)', 'rgb(35,35,255)'],
      value: [100000, 2000000],
      max: 2000000,
      min: 100000
    }
  };
  const pivotTable = new VTable.PivotTable(containerDom, option);

  test('listTable-color-legend getDrawRange', async () => {
    // await new Promise(resolve => setTimeout(resolve, 1000));
    const drawRange = pivotTable.getDrawRange();
    expect(drawRange.left).toBe(0);
    expect(drawRange.right).toBe(734);
    expect(drawRange.top).toBe(53);
    expect(drawRange.bottom).toBe(333);
  });
  test('listTable-color-legend node', () => {
    const layerChild = pivotTable.scenegraph.stage.children[0].children;
    expect(layerChild[layerChild.length - 1].name).toBe('legend');
  });
  // setTimeout(() => {
  //   pivotTable.release();
  // }, 1000);
});
