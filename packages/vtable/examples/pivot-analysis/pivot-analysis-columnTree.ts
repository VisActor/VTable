import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
  .then(res => res.json())
  .then(data => {
    const option = {
      records: data,
      columnTree: [
        {
          dimensionKey: 'Segment',
          value: 'Consumer',
          children: [
            {
              indicatorKey: 'Quantity',
              value: 'Quantity',
              virtual: false
            },
            {
              indicatorKey: 'Sales',
              value: 'Sales',
              virtual: false
            },
            {
              indicatorKey: 'Profit',
              value: 'Profit',
              virtual: false
            }
          ],
          virtual: false
        },
        {
          dimensionKey: 'Region',
          value: 'Central',
          children: [
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Corporate',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Home Office',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            }
          ],
          virtual: false
        },
        {
          dimensionKey: 'Region',
          value: 'East',
          children: [
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Home Office',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Corporate',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            }
          ],
          virtual: false
        },
        {
          dimensionKey: 'Region',
          value: 'South',
          children: [
            {
              dimensionKey: 'Segment',
              value: 'Corporate',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Home Office',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            }
          ],
          virtual: false
        },
        {
          dimensionKey: 'Region',
          value: 'West',
          children: [
            {
              dimensionKey: 'Segment',
              value: 'Consumer',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Corporate',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            },
            {
              dimensionKey: 'Segment',
              value: 'Home Office',
              children: [
                {
                  indicatorKey: 'Quantity',
                  value: 'Quantity',
                  virtual: false
                },
                {
                  indicatorKey: 'Sales',
                  value: 'Sales',
                  virtual: false
                },
                {
                  indicatorKey: 'Profit',
                  value: 'Profit',
                  virtual: false
                }
              ],
              virtual: false
            }
          ],
          virtual: false
        }
      ],
      rows: [
        {
          dimensionKey: 'Category',
          title: 'Category',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        },
        {
          dimensionKey: 'Sub-Category',
          title: 'Sub-Catogery',
          headerStyle: {
            textStick: true
          },
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
        },
        {
          dimensionKey: 'Segment',
          title: 'Segment',
          headerStyle: {
            textStick: true
          },
          width: 'auto'
        }
      ],
      indicators: [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
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
          indicatorKey: 'Sales',
          title: 'Sales',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
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
          title: 'Profit',
          width: 'auto',
          showSort: false,
          headerStyle: {
            fontWeight: 'normal'
          },
          format: rec => {
            return '$' + Number(rec).toFixed(2);
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
      dataConfig: {
        sortRules: [
          {
            sortField: 'Category',
            sortBy: ['Office Supplies', 'Technology', 'Furniture']
          }
        ],
        totals: {
          row: {
            showSubTotals: true,
            subTotalsDimensions: ['Category'],
            subTotalLabel: 'subtotal'
          }
        }
      },
      // rowHierarchyType: 'tree',
      widthMode: 'standard'
    };
    tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
    window.tableInstance = tableInstance;

    bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
  })
  .catch(e => {
    console.error(e);
  });
