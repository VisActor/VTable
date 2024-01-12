/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option: VTable.PivotChartConstructorOptions = {
    records: [
      {
        Category: 'Technology',
        PieCategory2: 'Technology1',
        Sales: '650.5600051879883',
        City: 'Amarillo'
      },
      {
        Category: 'Technology',
        PieCategory: 'Technology1',
        Sales: '440.5600051879883',
        City: 'Amarillo'
      },
      {
        Category: 'Technology',
        Profit: '94.46999931335449',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        Quantity: '14',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        Sales: '3048.5829124450684',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        Profit: '-507.70899391174316',
        City: 'Amarillo'
      },
      {
        Category: 'Office Supplies',
        Quantity: '60',
        City: 'Anaheim'
      }
    ],
    columns: ['Category'],
    rows: ['City'],
    indicators: [
      {
        indicatorKey: 'Sales',
        title: 'Sales',
        cellType: 'chart',
        chartModule: 'vchart',
        style: {
          padding: 1
        },
        chartSpec: {
          type: 'pie',
          data: { id: 'data1' },
          categoryField: 'PieCategory2',
          valueField: 'Sales'
        }
      }
    ],
    container: document.getElementById(CONTAINER_ID),
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 50],
    theme: VTable.themes.ARCO,
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        autoWrapText: true
      }
    }
  };

  const tableInstance = new VTable.PivotChart(option);
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
