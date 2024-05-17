/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          dimensionKey: 'Region',
          title: 'Region',
          headerStyle: {
            textStick: true
          }
        },
        'Category'
      ];
      const rows = [
        {
          dimensionKey: 'Order Year',
          title: 'Order Year',
          headerStyle: {
            textStick: true
          }
        },
        'Ship Mode'
      ];
      const indicators = [
        {
          indicatorKey: 'Quantity',
          title: 'Quantity',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            // type: 'common',
            stack: true,
            type: 'pie',
            data: {
              id: 'data',
              fields: {
                'Segment-Indicator': {
                  sortIndex: 1,
                  domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity']
                }
              }
            },
            categoryField: 'Segment-Indicator',
            valueField: 'Quantity',
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['Consumer-Quantity', 'Corporate-Quantity', 'Home Office-Quantity'],
                range: ['#2E62F1', '#4DC36A', '#FF8406']
              }
            ]
          },
          style: {
            padding: 1
          }
        }
      ];
      const option = {
        hideIndicatorName: true,
        rows,
        columns,
        indicators,
        records: data,
        defaultRowHeight: 200,
        defaultHeaderRowHeight: 50,
        defaultColWidth: 280,
        defaultHeaderColWidth: 100,
        indicatorTitle: '指标',
        autoWrapText: true,
        // widthMode: 'adaptive',
        // heightMode: 'adaptive',
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            autoWrapText: true
          }
        },
        legends: {
          orient: 'bottom',
          type: 'discrete',
          data: [
            {
              label: 'Consumer-Quantity',
              shape: {
                fill: '#2E62F1',
                symbolType: 'circle'
              }
            },
            {
              label: 'Corporate-Quantity',
              shape: {
                fill: '#4DC36A',
                symbolType: 'square'
              }
            },
            {
              label: 'Home Office-Quantity',
              shape: {
                fill: '#FF8406',
                symbolType: 'square'
              }
            }
          ]
        },
        pagination: {
          currentPage: 0,
          perPageCount: 8
        }
      };

      const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
      const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
      tableInstance.on(LEGEND_ITEM_CLICK, args => {
        console.log('LEGEND_ITEM_CLICK', args);
        tableInstance.updateFilterRules([
          {
            filterKey: 'Segment-Indicator',
            filteredValues: args.value
          }
        ]);
      });
    });
}
