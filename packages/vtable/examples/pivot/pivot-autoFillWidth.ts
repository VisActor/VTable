import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then(res => res.json())
    .then(data => {
      const option: VTable.PivotTableConstructorOptions = {
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
            }
            // width: 'auto'
          }
        ],
        indicators: [
          {
            indicatorKey: 'Sales',
            title: 'Sales',
            width: 'auto',
            // showSort: false,
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
          titleOnDimension: 'row'
        },
        // widthMode: 'standard',
        autoFillWidth: true,
        widthAdaptiveMode: 'all'
      };
      const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
      (window as any).tableInstance = instance;
      bindDebugTool(instance.scenegraph.stage, {});
    })
    .catch(err => {
      console.error(err);
    });
}
