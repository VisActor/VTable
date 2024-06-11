// @ts-nocheck
// 有问题可对照demo unitTestListTable
import records from '../data/North_American_Superstore_data.json';
import * as VTable from '../../src/index';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('PivotTable-size-legend init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const option = {
    records,
    rowTree: [
      {
        dimensionKey: 'City',
        value: 'Aberdeen'
      },
      {
        dimensionKey: 'City',
        value: 'Abilene'
      },
      {
        dimensionKey: 'City',
        value: 'Akron'
      },
      {
        dimensionKey: 'City',
        value: 'Albuquerque'
      },
      {
        dimensionKey: 'City',
        value: 'Alexandria'
      },
      {
        dimensionKey: 'City',
        value: 'Allen'
      },
      {
        dimensionKey: 'City',
        value: 'Allentown'
      },
      {
        dimensionKey: 'City',
        value: 'Altoona'
      },
      {
        dimensionKey: 'City',
        value: 'Amarillo'
      },
      {
        dimensionKey: 'City',
        value: 'Anaheim'
      },
      {
        dimensionKey: 'City',
        value: 'Andover'
      },
      {
        dimensionKey: 'City',
        value: 'Ann Arbor'
      },
      {
        dimensionKey: 'City',
        value: 'Antioch'
      },
      {
        dimensionKey: 'City',
        value: 'Apopka'
      },
      {
        dimensionKey: 'City',
        value: 'Apple Valley'
      },
      {
        dimensionKey: 'City',
        value: 'Appleton'
      },
      {
        dimensionKey: 'City',
        value: 'Arlington'
      },
      {
        dimensionKey: 'City',
        value: 'Arlington Heights'
      },
      {
        dimensionKey: 'City',
        value: 'Arvada'
      },
      {
        dimensionKey: 'City',
        value: 'Asheville'
      },
      {
        dimensionKey: 'City',
        value: 'Athens'
      },
      {
        dimensionKey: 'City',
        value: 'Atlanta'
      },
      {
        dimensionKey: 'City',
        value: 'Atlantic City'
      },
      {
        dimensionKey: 'City',
        value: 'Auburn'
      },
      {
        dimensionKey: 'City',
        value: 'Aurora'
      },
      {
        dimensionKey: 'City',
        value: 'Austin'
      },
      {
        dimensionKey: 'City',
        value: 'Avondale'
      },
      {
        dimensionKey: 'City',
        value: 'Bakersfield'
      },
      {
        dimensionKey: 'City',
        value: 'Baltimore'
      },
      {
        dimensionKey: 'City',
        value: 'Bangor'
      },
      {
        dimensionKey: 'City',
        value: 'Bartlett'
      },
      {
        dimensionKey: 'City',
        value: 'Bayonne'
      },
      {
        dimensionKey: 'City',
        value: 'Baytown'
      },
      {
        dimensionKey: 'City',
        value: 'Beaumont'
      },
      {
        dimensionKey: 'City',
        value: 'Bedford'
      },
      {
        dimensionKey: 'City',
        value: 'Belleville'
      },
      {
        dimensionKey: 'City',
        value: 'Bellevue'
      },
      {
        dimensionKey: 'City',
        value: 'Bellingham'
      },
      {
        dimensionKey: 'City',
        value: 'Bethlehem'
      },
      {
        dimensionKey: 'City',
        value: 'Beverly'
      },
      {
        dimensionKey: 'City',
        value: 'Billings'
      },
      {
        dimensionKey: 'City',
        value: 'Bloomington'
      },
      {
        dimensionKey: 'City',
        value: 'Boca Raton'
      },
      {
        dimensionKey: 'City',
        value: 'Boise'
      },
      {
        dimensionKey: 'City',
        value: 'Bolingbrook'
      },
      {
        dimensionKey: 'City',
        value: 'Bossier City'
      },
      {
        dimensionKey: 'City',
        value: 'Bowling Green'
      },
      {
        dimensionKey: 'City',
        value: 'Boynton Beach'
      },
      {
        dimensionKey: 'City',
        value: 'Bozeman'
      },
      {
        dimensionKey: 'City',
        value: 'Brentwood'
      }
    ],
    columnTree: [
      {
        dimensionKey: 'Category',
        value: 'Office Supplies',
        children: [
          {
            indicatorKey: 'Sales'
          }
        ]
      },
      {
        dimensionKey: 'Category',
        value: 'Technology',
        children: [
          {
            indicatorKey: 'Sales'
          }
        ]
      },
      {
        dimensionKey: 'Category',
        value: 'Furniture',
        children: [
          {
            indicatorKey: 'Sales'
          }
        ]
      }
    ],
    rows: [
      {
        dimensionKey: 'City',
        title: 'City',
        headerStyle: {
          textStick: true
        },
        width: 'auto'
      }
    ],
    columns: [
      {
        dimensionKey: 'Category',
        title: 'Category',
        headerStyle: {
          textStick: true
        },
        width: 'auto'
      }
    ],
    indicators: [
      {
        indicatorKey: 'Sales',
        title: 'Sales',
        width: 'auto',
        showSort: false,
        headerStyle: {
          fontWeight: 'normal'
        },
        format: value => {
          return '$' + Number(value).toFixed(2);
        },
        style: {
          padding: [16, 28, 16, 28]
        }
      }
    ],
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true
      }
    },
    widthMode: 'standard',
    hideIndicatorName: true,
    legends: {
      orient: 'top',
      position: 'start',
      type: 'size',
      sizeRange: [10, 50],
      value: [0, 10000],
      max: 10000,
      min: 0
    },
    theme: VTable.themes.DEFAULT.extends({
      defaultStyle: {
        // borderLineWidth: 0,
        fontFamily: 'Arial'
      },
      bodyStyle: {
        // color: 'white',
        fontFamily: 'Arial'
      },
      headerStyle: { fontFamily: 'Arial' },
      rowHeaderStyle: { fontFamily: 'Arial' }
    })
  };
  const pivotTable = new VTable.PivotTable(containerDom, option);

  test('PivotTable-size-legend getDrawRange', () => {
    const drawRange = pivotTable.getDrawRange();
    expect(drawRange.left).toBe(1);
    expect(drawRange.right).toBe(566);
    expect(drawRange.top).toBe(58);
    expect(drawRange.bottom).toBe(799);
  });
  test('PivotTable-size-legend node', () => {
    //TODO 这个对应的例子pivotTable-size-legend 没有问题
    // const layerChild = pivotTable.scenegraph.stage.children[0].children;
    // expect(layerChild[layerChild.length - 1].name).toBe('legend');
    pivotTable.release();
  });
});
