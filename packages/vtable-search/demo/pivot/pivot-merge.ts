import * as VTable from '@visactor/vtable';
import { SearchComponent } from '../../src';
// import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then(res => res.json())
    .then(data => {
      const option = {
        records: data,
        rows: [
          {
            dimensionKey: 'City',
            title: 'City',
            headerStyle: {
              textStick: true
            }
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
            indicatorKey: 'Quantity',
            title: 'Quantity',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal',
              color: 'purple'
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
              fontWeight: 'normal',
              color: 'red'
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
              fontWeight: 'normal',
              color: 'green'
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
        indicatorTitle: 'indicators title',
        indicatorsAsCol: false,
        dataConfig: {
          sortRules: [
            {
              sortField: 'Category',
              sortBy: ['Office Supplies', 'Technology', 'Furniture']
            }
          ]
        },
        defaultHeaderColWidth: [120, 'auto'],
        widthMode: 'standard'
      };
      const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;

      const search = new SearchComponent({
        table: tableInstance,
        autoJump: true
      });
      window.search = search;
    })
    .catch(console.warn);
}
