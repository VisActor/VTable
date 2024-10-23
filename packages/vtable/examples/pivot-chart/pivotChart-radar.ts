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
        }
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
            type: 'radar',
            categoryField: 'Segment',
            seriesField: 'Category',
            valueField: 'Quantity',
            data: {
              id: 'baseData'
            },
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['Furniture', 'Office Supplies', 'Technology'],
                range: ['#2E62F1', '#4DC36A', '#FF8406']
              }
            ]
          },
          style: {
            padding: 1
          }
        },
        {
          indicatorKey: 'Profit',
          title: 'Profit',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'radar',
            categoryField: 'Segment',
            seriesField: 'Category',
            valueField: 'Profit',
            data: {
              id: 'baseData'
            },
            scales: [
              {
                id: 'color',
                type: 'ordinal',
                domain: ['Furniture', 'Office Supplies', 'Technology'],
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
        hideIndicatorName: false,
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
              label: 'Furniture',
              shape: {
                fill: '#2E62F1',
                symbolType: 'circle'
              }
            },
            {
              label: 'Office Supplies',
              shape: {
                fill: '#4DC36A',
                symbolType: 'square'
              }
            },
            {
              label: 'Technology',
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
      const { LEGEND_ITEM_CLICK } = VTable.ListTable.EVENT_TYPE;
      tableInstance.on(LEGEND_ITEM_CLICK, args => {
        console.log('LEGEND_ITEM_CLICK', args);
        tableInstance.updateFilterRules([
          {
            filterKey: 'Category',
            filteredValues: args.value
          }
        ]);
      });
      window.tableInstance = tableInstance;

      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

      window.update = () => {
        theme.cornerLeftBottomCellStyle.borderColor = 'red';
        tableInstance.updateTheme(theme);
      };
    });
}
