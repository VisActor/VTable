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
            ],
            pie: {
              state: {
                // hover 状态：悬浮扇区放大
                hover: {
                  outerRadius: 0.9, // 悬浮时外半径增大（如从 0.8 → 0.9）
                  innerRadius: 0, // 环形图内半径保持不变（或按需调整）
                  // 可选：添加边框和透明度增强视觉效果
                  stroke: '#00FFFF', // 边框颜色
                  lineWidth: 2, // 边框粗细
                  fillOpacity: 1 // 填充透明度
                },
                // （可选）hover_reverse：未悬浮扇区缩小
                hover_reverse: {
                  outerRadius: 0.7, // 未悬浮时外半径缩小
                  innerRadius: 0 // 内半径保持不变
                }
              }
            }
          },
          style: {
            padding: 1
          }
        }
      ];
      const option = {
        chartDimensionLinkage: {
          showTooltip: true,
          heightLimitToShowTooltipForEdgeRow: 180,
          widthLimitToShowTooltipForEdgeColumn: 180
        },
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
