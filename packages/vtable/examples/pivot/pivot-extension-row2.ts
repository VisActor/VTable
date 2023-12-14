import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch(
    'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_pivot_extension_rows.json'
  )
    .then(res => res.json())
    .then(data => {
      const option = {
        records: data,
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
            format: value => {
              if (value) {
                return '$' + Number(value).toFixed(2);
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
            format: value => {
              if (value) {
                return '$' + Number(value).toFixed(2);
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
      const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
      window.tableInstance = instance;

      bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
    });
}
