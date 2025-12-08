/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
import { LinearScale } from '@visactor/vscale';

window.LinearScale = LinearScale;
const CONTAINER_ID = 'vTable';

VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const rows: (VTable.IDimension | string)[] = [
    {
      dimensionKey: 'Country',
      title: 'Country'
    },
    {
      dimensionKey: 'Region',
      title: 'Region'
    }
    // '230417170554008'
  ];
  const columns = [
    {
      dimensionKey: 'Category',
      title: 'Category'
    }
  ];
  const indicators: VTable.TYPES.IChartIndicator[] = [
    {
      indicatorKey: 'y5',
      title: '利润',
      cellType: 'chart',
      chartModule: 'vchart',
      style: {
        padding: 1
      },
      chartSpec: {
        type: 'boxPlot',
        data: {
          id: 'dataId'
        },
        xField: 'Sub-Category',
        minField: 'y1',
        q1Field: 'y2',
        medianField: 'y3',
        q3Field: 'y4',
        maxField: 'y5',
        outliersField: 'y6',
        direction: 'vertical',
        // axes: [
        //   { orient: 'left', min:0 ,max:50},
        // ],
        boxPlot: {
          style: {
            // boxWidth: 50, // 不指定则自适应宽度
            // shaftWidth: 60,
            shaftShape: 'line',
            lineWidth: 2
          }
        }
      }
    }
  ];
  const records = [
    {
      Region: 'South',
      Category: 'Electronics',
      'Sub-Category': 'Televisions',
      Country: 'China',
      y1: 4.72,
      y2: 9.73,
      y3: 10.17,
      y4: 10.51,
      y5: 11.64,
      y6: [12.01, 12.02, 14.03]
    },
    {
      Region: 'North',
      Category: 'Electronics',
      'Sub-Category': 'Televisions',
      Country: 'China',
      y1: 9.4,
      y2: 10.06,
      y3: 10.75,
      y4: 11.56,
      y5: 12.5
    },
    {
      Region: 'Middle',
      Category: 'Electronics',
      'Sub-Category': 'Televisions',
      Country: 'China',
      y1: 9.54,
      y2: 10.6,
      y3: 11.05,
      y4: 11.5,
      y5: 11.92
    },
    {
      Region: 'West',
      Category: 'Electronics',
      'Sub-Category': 'Televisions',
      Country: 'China',
      y1: 8.74,
      y2: 9.46,
      y3: 10.35,
      y4: 10.94,
      y5: 12.21
    },
    {
      Region: 'East',
      Category: 'Electronics',
      'Sub-Category': 'Televisions',
      Country: 'China',
      y1: 7.8,
      y2: 8.95,
      y3: 10.18,
      y4: 11.57,
      y5: 13.25
    },
    {
      Region: 'North',
      Category: 'Electronics',
      'Sub-Category': 'Laptops',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    },
    {
      Region: 'West',
      Category: 'Electronics',
      'Sub-Category': 'Laptops',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    },
    {
      Region: 'East',
      Category: 'Electronics',
      'Sub-Category': 'Laptops',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    },
    {
      Region: 'South',
      Category: 'Electronics',
      'Sub-Category': 'Laptops',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    },
    {
      Region: 'South',
      Category: 'Office Supplies',
      'Sub-Category': 'Furniture',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    },
    {
      Region: 'North',
      Category: 'Office Supplies',
      'Sub-Category': 'Furniture',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    },
    {
      Region: 'Middle',
      Category: 'Office Supplies',
      'Sub-Category': 'Furniture',
      Country: 'China',
      y1: 9.52,
      y2: 10.39,
      y3: 10.93,
      y4: 11.69,
      y5: 12.63
    }
  ];

  const option: VTable.PivotChartConstructorOptions = {
    chartDimensionLinkage: {
      showTooltip: true,
      heightLimitToShowTooltipForEdgeRow: 60,
      widthLimitToShowTooltipForEdgeColumn: 90,
      labelHoverOnAxis: {
        bottom: {
          visible: true,
          background: {
            visible: true,
            style: {
              fill: '#364159'
            }
          },
          textStyle: {
            fill: '#ffffff'
          }
        }
      }
    },
    // columnTree,
    emptyTip: true,
    // rowTree,
    rows,
    columns,
    indicators,
    indicatorsAsCol: false,
    container: document.getElementById(CONTAINER_ID),
    records,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 'auto', 'auto'],

    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        autoWrapText: true,
        padding: 0
      }
    }

    // select: {
    //   disableSelect: true
    // }
  };

  const tableInstance = new VTable.PivotChart(option);
  tableInstance.on('before_cache_chart_image', args => {
    console.log('before_cache_chart_image', args);
  });
  tableInstance.onVChartEvent('click', args => {
    console.log('onVChartEvent click', args);
  });
  tableInstance.onVChartEvent('mouseover', args => {
    console.log('onVChartEvent mouseover', args);
  });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

  window.update = () => {
    theme.cornerLeftBottomCellStyle.borderColor = 'red';
    tableInstance.updateTheme(theme);
  };
}
