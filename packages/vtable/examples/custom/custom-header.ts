/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
const padding = [10, 20, 10, 20];

export function createTable() {
  const option = {
    autoRowHeight: true,
    widthMode: 'standard',
    heightMode: 'autoHeight',
    disableColumnResize: false,
    autoWrapText: false,
    enableColumnResizeOnAllRows: true,
    maxCharactersNumber: 256,
    keyboardOptions: {
      copySelected: false
    },
    columnResizerType: 'all',
    dropDownMenu: {
      renderMode: 'html'
    },
    records: [
      {
        '10001': '销售额',
        '10002': '16068954.125',
        '10003': '231211225612017-day-measureValue',
        '231211225612017': '16068954.125',
        '231211225612017-day-measureValue': '16068954.125',
        '231211225612024': '2147538.925',
        OKR_TABLE_COLUMN_KEY: 'day-measureValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612017'
      },
      {
        '10001': '销售额',
        '10002': '0',
        '10003': '231211225612017-day-period-lastweekRatio',
        '231211225612017': '16068954.125',
        '231211225612017-day-period-lastweekRatio': '0',
        '231211225612024': '2147538.925',
        OKR_TABLE_COLUMN_KEY: 'day-period-lastweekRatio',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612017'
      },
      {
        '10001': '销售额',
        '10002': '16068954.125',
        '10003': '231211225612017-week-measureValue',
        '231211225612017': '16068954.125',
        '231211225612017-week-measureValue': '16068954.125',
        '231211225612024': '2147538.925',
        OKR_TABLE_COLUMN_KEY: 'week-measureValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612017'
      },
      {
        '10001': '销售额',
        '10002': '1156964697',
        '10003': '231211225612017-quarter-measureValue',
        '231211225612017': '1156964697',
        '231211225612017-quarter-measureValue': '1156964697',
        '231211225612024': '154622802.60000002',
        OKR_TABLE_COLUMN_KEY: 'quarter-measureValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612017'
      },
      {
        '10001': '销售额',
        '10002': '1',
        '10003': '231211225612017-quarter-goalValue',
        '231211225612017': '1156964697',
        '231211225612017-quarter-goalValue': '1',
        '231211225612024': '154622802.60000002',
        OKR_TABLE_COLUMN_KEY: 'quarter-goalValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612017'
      },
      {
        '10001': '销售额',
        '10002': '482068623.75',
        '10003': '231211225612017-quarter-goalProgress',
        '231211225612017': '1156964697',
        '231211225612017-quarter-goalProgress': '482068623.75',
        '231211225612024': '154622802.60000002',
        OKR_TABLE_COLUMN_KEY: 'quarter-goalProgress',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612017'
      },
      {
        '10001': '利润',
        '10002': '2147538.925',
        '10003': '231211225612024-day-measureValue',
        '231211225612017': '16068954.125',
        '231211225612024': '2147538.925',
        '231211225612024-day-measureValue': '2147538.925',
        OKR_TABLE_COLUMN_KEY: 'day-measureValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612024'
      },
      {
        '10001': '利润',
        '10002': '-4.3366970618028645e-16',
        '10003': '231211225612024-day-period-lastweekRatio',
        '231211225612017': '16068954.125',
        '231211225612024': '2147538.925',
        '231211225612024-day-period-lastweekRatio': '-4.3366970618028645e-16',
        OKR_TABLE_COLUMN_KEY: 'day-period-lastweekRatio',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612024'
      },
      {
        '10001': '利润',
        '10002': '2147538.925',
        '10003': '231211225612024-week-measureValue',
        '231211225612017': '16068954.125',
        '231211225612024': '2147538.925',
        '231211225612024-week-measureValue': '2147538.925',
        OKR_TABLE_COLUMN_KEY: 'week-measureValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612024'
      },
      {
        '10001': '利润',
        '10002': '154622802.60000002',
        '10003': '231211225612024-quarter-measureValue',
        '231211225612017': '1156964697',
        '231211225612024': '154622802.60000002',
        '231211225612024-quarter-measureValue': '154622802.60000002',
        OKR_TABLE_COLUMN_KEY: 'quarter-measureValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612024'
      },
      {
        '10001': '利润',
        '10002': null,
        '10003': '231211225612024-quarter-goalValue',
        '231211225612017': '1156964697',
        '231211225612024': '154622802.60000002',
        '231211225612024-quarter-goalValue': null,
        OKR_TABLE_COLUMN_KEY: 'quarter-goalValue',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612024'
      },
      {
        '10001': '利润',
        '10002': null,
        '10003': '231211225612024-quarter-goalProgress',
        '231211225612017': '1156964697',
        '231211225612024': '154622802.60000002',
        '231211225612024-quarter-goalProgress': null,
        OKR_TABLE_COLUMN_KEY: 'quarter-goalProgress',
        OKR_TABLE_COLUMN_UNIQUE_ID: '231211225612024'
      }
    ],
    rows: [
      {
        dimensionKey: '10001',
        dimensionTitle: '',
        headerStyle: {
          textStick: true
        },
        showSort: false
      }
    ],
    columns: [
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY'
      }
    ],
    dimensions: [],
    rowHierarchyType: 'grid',
    rowHierarchyIndent: 30,
    rowExpandLevel: 1,
    showColumnHeader: true,
    showRowHeader: true,
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: true
      }
    },
    hideIndicatorName: true,
    rowTree: [
      {
        dimensionKey: '10001',
        value: '销售额'
      },
      {
        dimensionKey: '10001',
        value: '利润'
      }
    ],
    columnTree: [
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY',
        value: 'day-measureValue',
        children: [
          {
            indicatorKey: '10002'
          }
        ],
        headerCustomLayout: customHeader
      },
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY',
        value: 'day-period-lastweekRatio',
        children: [
          {
            indicatorKey: '10002'
          }
        ],
        headerCustomLayout: customHeader
      },
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY',
        value: 'week-measureValue',
        children: [
          {
            indicatorKey: '10002'
          }
        ],
        headerCustomLayout: customHeader
      },
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY',
        value: 'quarter-measureValue',
        children: [
          {
            indicatorKey: '10002'
          }
        ],
        headerCustomLayout: customHeader
      },
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY',
        value: 'quarter-goalValue',
        children: [
          {
            indicatorKey: '10002'
          }
        ],
        headerCustomLayout: customHeader
      },
      {
        dimensionKey: 'OKR_TABLE_COLUMN_KEY',
        value: 'quarter-goalProgress',
        children: [
          {
            indicatorKey: '10002'
          }
        ],
        headerCustomLayout: customHeader
      }
    ],
    indicators: [
      {
        indicatorKey: '10002',
        width: 'auto',
        showSort: false
      }
    ],
    theme: {
      headerStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: [1, 1, 3, 1],
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'center',
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        fontSize: 12,
        fontFamily:
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        fontWeight: 'bold',
        fontStyle: 'normal',
        lineHeight: 18
      },
      bodyStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: 1,
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'right',
        hover: {
          cellBgColor: 'rgba(186, 215, 255, 0.2)',
          inlineRowBgColor: 'rgba(186, 215, 255, 0.2)',
          inlineColumnBgColor: 'rgba(186, 215, 255, 0.2)'
        },
        fontSize: 12,
        fontFamily:
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        fontWeight: 'normal',
        fontStyle: 'normal',
        lineHeight: 18
      },
      rowHeaderStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: [1, 3, 1, 1],
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'left',
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        fontSize: 12,
        fontFamily:
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        fontWeight: 'bold',
        fontStyle: 'normal',
        lineHeight: 18
      },
      cornerHeaderStyle: {
        borderColor: ['rgb(224, 224, 224)', 'rgb(224, 224, 224)'],
        borderLineWidth: [1, 3, 3, 1],
        padding: [8.6, 19, 8.6, 19],
        textAlign: 'left',
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        fontSize: 12,
        fontFamily:
          '-apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        fontWeight: 'bold',
        fontStyle: 'normal',
        lineHeight: 18
      },
      menuStyle: {
        color: '#1B1F23',
        highlightColor: '#1E54C9',
        font: 'normal normal normal 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"',
        highlightFont:
          'normal normal bold 12px -apple-system,"Helvetica Neue","PingFang SC","Microsoft YaHei","Hiragino Sans GB",Helvetica,Arial,sans-serif,"apple color emoji","segoe ui emoji","segoe ui","segoe ui symbol"'
      },
      underlayBackgroundColor: 'rgba(255,255,255,0)',
      frameStyle: {
        borderColor: 'rgb(224, 224, 224)',
        borderLineWidth: 0
      },
      scrollStyle: {
        visible: 'focus',
        width: 7,
        hoverOn: true
      },
      selectionStyle: {
        cellBorderColor: '#3073F2',
        cellBorderLineWidth: [2, 2, 2, 2],
        cellBgColor: 'rgba(186, 215, 255, 0.2)'
      }
    },
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    hover: {
      enableColumnHighlight: true,
      enableRowHighlight: true,
      enableSingalCellHighlight: true
    },
    click: {
      enableColumnHighlight: false,
      enableRowHighlight: false,
      enableSingalCellHighlight: true
    },
    hash: '2a1cd4dd5dfb0692435bb365327a3cfa'
  };
  const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
  // tableInstance.onVChartEvent('click', args => {
  //   console.log('listenChart click', args);
  // });
  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}

const titles = [, '近1月指标值', '近1月目标值', '近1月环比', '近1月目标完成度', '近1月年同比', 'title'];
const dates = [, '04.01 - 04-15', '04', '03.01 - 03.15', '04', '2020.04.01 - 2020.04.15', 'date'];

function customHeader(args: any) {
  const { table, row, col, rect } = args;
  const { height, width } = rect ?? table.getCellRect(col, row);
  const record = table.getRecordByCell(col, row);

  const hasUnderline = true;
  const container = new VTable.CustomLayout.Group({
    height,
    width,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'space-around',
    // alignItems: 'flex-end',
    // alignItems: 'center',
    alignItems: 'flex-start'
  });

  const title = new VTable.CustomLayout.Text({
    text: titles[col],
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#000',
    underline: hasUnderline ? 1 : undefined
    // boundsPadding: [0, padding[1], 0, padding[3]],
  });

  const date = new VTable.CustomLayout.Text({
    text: dates[col],
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    fill: '#000'
    // boundsPadding: [0, padding[1], 0, padding[3]],
  });

  container.add(title);
  container.add(date);

  return {
    rootContainer: container,
    renderDefault: false,
    enableCellPadding: true
  };
}
