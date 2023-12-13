import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  let tableInstance;
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot2_data.json')
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
            dimensionKey: 'Region',
            value: 'West',
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
            title: 'Sales',
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
            title: 'Profit',
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
        widthMode: 'standard',
        rowHierarchyIndent: 20,
        rowExpandLevel: 1,
        dragHeaderMode: 'all'
      };
      tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID)!, option);
      window.tableInstance = tableInstance;
    });
}
