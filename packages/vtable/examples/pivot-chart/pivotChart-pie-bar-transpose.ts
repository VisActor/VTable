/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option: VTable.PivotChartConstructorOptions = {
    indicatorsAsCol: true,
    records: [
      {
        Category: 'Technology',
        SubCategory: 'Technology1',
        Sales: '650.5600051879883',
        City: 'Amarillo'
      },
      {
        Category: 'Technology',
        SubCategory: 'Technology1',
        Sales: '4400.5600051879883',
        City: 'Amarillo'
      },
      {
        Category: 'Technology',
        SubCategory: 'Technology1',
        Profit: '2949.46999931335449',
        City: 'Amarillo'
      },
      {
        Category: 'Technology',
        SubCategory: 'Technology2',
        Profit: '2094.46999931335449',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        SubCategory: 'Technology1',
        Quantity: '14',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        Sales: '2048.5829124450684',
        SubCategory: 'Technology1',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        Sales: '3048.5829124450684',
        SubCategory: 'Technology2',
        City: 'Amarillo'
      },
      {
        Category: 'Furniture',
        Profit: '4507.70899391174316',
        SubCategory: 'Technology2',
        City: 'Amarillo'
      },
      {
        Category: 'Office Supplies',
        Profit: '600',
        SubCategory: 'Technology3',
        City: 'Anaheim'
      },
      {
        Category: 'Furniture',
        Profit: '4507.70899391174316',
        SubCategory: 'Technology2',
        City: 'Anaheim'
      },
      {
        Category: 'Office Supplies',
        Profit: '4507.70899391174316',
        SubCategory: 'Technology2',
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
          categoryField: 'SubCategory',
          valueField: 'Sales'
        }
      },
      {
        indicatorKey: 'Profit',
        title: 'profit',
        cellType: 'chart',
        chartModule: 'vchart',
        style: {
          padding: 1
        },
        chartSpec: {
          type: 'bar',
          direction: 'horizontal',
          data: {
            id: 'sales'
          },
          yField: 'SubCategory',
          xField: 'Profit',
          axes: [
            {
              zero: true,
              nice: true,
              id: 'sub-0',
              type: 'linear',

              orient: 'bottom',
              visible: true
            }
          ]
        }
      }
    ],
    container: document.getElementById(CONTAINER_ID),
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 30,
    defaultColWidth: 280,
    defaultHeaderColWidth: [80, 'auto'],
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
