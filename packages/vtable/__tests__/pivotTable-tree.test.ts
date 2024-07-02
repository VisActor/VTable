/* eslint-disable prettier/prettier */
// @ts-nocheck
// 有问题可对照demo unitTestPivotTable
import records from './data/North_American_Superstore_pivot_extension_rows.json';
import { PivotTable } from '../src';
import { createDiv } from './dom';
global.__VERSION__ = 'none';
describe('pivotTableTree init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '700px';
  containerDom.style.height = '500px';

  const option = {
    records,
    rowTree: [
      {
        dimensionKey: 'Category',
        value: 'Furniture',
        hierarchyState: 'expand',
        children: [
          {
            dimensionKey: 'Sub-Category',
            value: 'Bookcases',
            hierarchyState: 'collapse'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Chairs',
            hierarchyState: 'collapse'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Furnishings'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Tables'
          }
        ]
      },
      {
        dimensionKey: 'Category',
        value: 'Office Supplies',
        children: [
          {
            dimensionKey: 'Sub-Category',
            value: 'Appliances'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Art'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Binders'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Envelopes'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Fasteners'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Labels'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Paper'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Storage'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Supplies'
          }
        ]
      },
      {
        dimensionKey: 'Category',
        value: 'Technology',
        children: [
          {
            dimensionKey: 'Sub-Category',
            value: 'Accessories'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Copiers'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Machines'
          },
          {
            dimensionKey: 'Sub-Category',
            value: 'Phones'
          }
        ]
      }
    ],
    columnTree: [
      {
        value: 'Sales',
        indicatorKey: 'Sales'
      },
      {
        value: 'Profit',
        indicatorKey: 'Profit'
      }
    ],
    extensionRows: [
      {
        rows: [{ dimensionKey: 'Region', title: 'Region', width: 'auto' }, 'State'],
        rowTree: [
          {
            dimensionKey: 'Region',
            value: 'East',
            hierarchyState: 'expand',
            children: [
              {
                dimensionKey: 'State',
                value: 'Connecticut'
              },
              {
                dimensionKey: 'State',
                value: 'Delaware'
              },
              {
                dimensionKey: 'State',
                value: 'District of Columbia'
              },
              {
                dimensionKey: 'State',
                value: 'Maine'
              },
              {
                dimensionKey: 'State',
                value: 'Maryland'
              },
              {
                dimensionKey: 'State',
                value: 'Massachusetts'
              },
              {
                dimensionKey: 'State',
                value: 'New Hampshire'
              },
              {
                dimensionKey: 'State',
                value: 'New Jersey'
              },
              {
                dimensionKey: 'State',
                value: 'New York'
              },
              {
                dimensionKey: 'State',
                value: 'Ohio'
              },
              {
                dimensionKey: 'State',
                value: 'Pennsylvania'
              },
              {
                dimensionKey: 'State',
                value: 'Rhode Island'
              },
              {
                dimensionKey: 'State',
                value: 'Vermont'
              },
              {
                dimensionKey: 'State',
                value: 'West Virginia'
              }
            ]
          },
          {
            dimensionKey: 'Region',
            value: 'Central',
            children: [
              {
                dimensionKey: 'State',
                value: 'Illinois'
              },
              {
                dimensionKey: 'State',
                value: 'Indiana'
              },
              {
                dimensionKey: 'State',
                value: 'Iowa'
              },
              {
                dimensionKey: 'State',
                value: 'Kansas'
              },
              {
                dimensionKey: 'State',
                value: 'Michigan'
              },
              {
                dimensionKey: 'State',
                value: 'Minnesota'
              },
              {
                dimensionKey: 'State',
                value: 'Missouri'
              },
              {
                dimensionKey: 'State',
                value: 'Nebraska'
              },
              {
                dimensionKey: 'State',
                value: 'North Dakota'
              },
              {
                dimensionKey: 'State',
                value: 'Oklahoma'
              },
              {
                dimensionKey: 'State',
                value: 'South Dakota'
              },
              {
                dimensionKey: 'State',
                value: 'Texas'
              },
              {
                dimensionKey: 'State',
                value: 'Wisconsin'
              }
            ]
          },
          {
            dimensionKey: 'Region',
            value: 'West',
            children: [
              {
                dimensionKey: 'State',
                value: 'Arizona'
              },
              {
                dimensionKey: 'State',
                value: 'California'
              },
              {
                dimensionKey: 'State',
                value: 'Colorado'
              },
              {
                dimensionKey: 'State',
                value: 'Idaho'
              },
              {
                dimensionKey: 'State',
                value: 'Montana'
              },
              {
                dimensionKey: 'State',
                value: 'Nevada'
              },
              {
                dimensionKey: 'State',
                value: 'New Mexico'
              },
              {
                dimensionKey: 'State',
                value: 'Oregon'
              },
              {
                dimensionKey: 'State',
                value: 'Utah'
              },
              {
                dimensionKey: 'State',
                value: 'Washington'
              },
              {
                dimensionKey: 'State',
                value: 'Wyoming'
              }
            ]
          },
          {
            dimensionKey: 'Region',
            value: 'South',
            children: [
              {
                dimensionKey: 'State',
                value: 'Alabama'
              },
              {
                dimensionKey: 'State',
                value: 'Arkansas'
              },
              {
                dimensionKey: 'State',
                value: 'Florida'
              },
              {
                dimensionKey: 'State',
                value: 'Georgia'
              },
              {
                dimensionKey: 'State',
                value: 'Kentucky'
              },
              {
                dimensionKey: 'State',
                value: 'Louisiana'
              },
              {
                dimensionKey: 'State',
                value: 'Mississippi'
              },
              {
                dimensionKey: 'State',
                value: 'North Carolina'
              },
              {
                dimensionKey: 'State',
                value: 'South Carolina'
              },
              {
                dimensionKey: 'State',
                value: 'Tennessee'
              },
              {
                dimensionKey: 'State',
                value: 'Virginia'
              }
            ]
          }
        ]
      }
    ],
    rows: [
      {
        dimensionKey: 'Category',
        title: 'Catogery',
        width: 'auto'
      },
      {
        dimensionKey: 'Sub-Category',
        title: 'Sub-Catogery',
        width: 'auto'
      }
    ],
    columns: [
      {
        dimensionKey: 'Region',
        title: 'Region',
        headerStyle: {
          textStick: true
        },
        width: 'auto'
      }
    ],
    indicators: [
      {
        indicatorKey: 'Sales',
        caption: 'Sales',
        width: 'auto',
        showSort: false,
        headerStyle: {
          fontWeight: 'normal'
        },
        format: rec => {
          if (rec) {
            return '$' + Number(rec.Sales).toFixed(2);
          }
          return '';
        },
        style: {
          padding: [16, 28, 16, 28],
          color(args) {
            if (args.dataValue >= 0) {
              return 'black';
            }
            return 'red';
          }
        }
      },
      {
        indicatorKey: 'Profit',
        caption: 'Profit',
        width: 'auto',
        showSort: false,
        headerStyle: {
          fontWeight: 'normal'
        },
        format: rec => {
          if (rec) {
            return '$' + Number(rec.Profit).toFixed(2);
          }
          return '';
        },
        style: {
          padding: [16, 28, 16, 28],
          color(args) {
            if (args.dataValue >= 0) {
              return 'black';
            }
            return 'red';
          }
        }
      }
    ],
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true
      }
    },
    rowHierarchyType: 'tree',
    widthMode: 'standard',
    rowHierarchyIndent: 20,
    rowExpandLevel: 2,
    dragHeaderMode: 'all'
  };
  option.container = containerDom;
  option.records = records;
  const pivotTableTree = new PivotTable(option);

  test('pivotTableTree init', () => {
    expect(pivotTableTree.frozenColCount).toBe(2);
  });
  test('pivotTableTree rowHeaderLevelCount', () => {
    expect(pivotTableTree.rowHeaderLevelCount).toBe(2);
  });
  test('pivotTableTree getCellValue', () => {
    expect(pivotTableTree.getCellValue(1, 0)).toBe('Region');
  });
  test('pivotTableTree getCellRange', () => {
    expect(pivotTableTree.getCellRange(0, 6)).toEqual({
      end: { col: 0, row: 18 },
      start: { col: 0, row: 1 }
    });
  });

  test('pivotTableTree API getCellHeaderPaths', () => {
    expect(pivotTableTree.getCellHeaderPaths(2, 4)).toEqual({
      colHeaderPaths: [
        {
          indicatorKey: 'Sales',
          value: 'Sales'
        }
      ],
      rowHeaderPaths: [
        {
          dimensionKey: 'Category',
          value: 'Furniture'
        },
        {
          dimensionKey: 'Region',
          value: 'East'
        },
        {
          dimensionKey: 'State',
          value: 'District of Columbia'
        }
      ],
      cellLocation: 'body'
    });
  });

  test('pivotTableTree API getCellAddressByHeaderPaths', () => {
    expect(
      pivotTableTree.getCellAddressByHeaderPaths({
        colHeaderPaths: [
          {
            indicatorKey: 'Sales',
            value: 'Sales'
          }
        ],
        rowHeaderPaths: [
          {
            dimensionKey: 'Category',
            value: 'Furniture'
          },
          {
            dimensionKey: 'Region',
            value: 'East'
          },
          {
            dimensionKey: 'State',
            value: 'District of Columbia'
          }
        ]
      })
    ).toEqual({ col: 2, row: 4 });

    expect(
      pivotTableTree.getCellAddressByHeaderPaths([
        {
          indicatorKey: 'Sales',
          value: 'Sales'
        }
      ])
    ).toEqual({ col: 2, row: 0 });
    pivotTableTree.release();
  });
});
