/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
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
            indicatorKey: 'Quantity',
            title: 'Quantity',
            width: 'auto',
            showSort: false,
            headerStyle: {
              fontWeight: 'normal'
            },
            format: rec => {
              debugger;
              return '$' + Number(rec).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
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
              return '$' + Number(rec?.['Sales']).toFixed(2);
            },
            style: {
              padding: [16, 28, 16, 28],
              color(args) {
                if (args.dataValue >= 0) return 'black';
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
                if (args.dataValue >= 0) return 'black';
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
            } as VTable.TYPES.SortByIndicatorRule
          ]
        },
        enableDataAnalysis: true,
        widthMode: 'standard'
      };
      const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
      window['tableInstance'] = tableInstance;
    });
}
