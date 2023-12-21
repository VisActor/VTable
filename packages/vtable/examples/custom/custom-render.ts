/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
const padding = [10, 20, 10, 20];

export function createTable() {
  const option = {
    columns: [
      {
        field: 'type',
        title: '',
        width: 170,
        headerStyle: {
          bgColor: '#4991e3'
        },
        style: {
          fontFamily: 'Arial',
          fontWeight: 600,
          bgColor: '#4991e3',
          fontSize: 26,
          padding: 20,
          lineHeight: 32,
          color: 'white'
        }
      },
      {
        field: 'urgency',
        title: 'urgency',
        width: 400,
        headerStyle: {
          lineHeight: 50,
          fontSize: 26,
          fontWeight: 600,
          bgColor: '#4991e3',
          color: 'white',
          textAlign: 'center'
        },
        customLayout(args) {
          const { width, height } = args.rect;
          const { dataValue, table, row } = args;
          const elements = [];
          let top = 30;
          const left = 15;

          const container = new VTable.CustomLayout.Group({
            height,
            width,
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'space-around'
          });

          const text = new VTable.CustomLayout.Text({
            fill: '#000',
            fontSize: 20,
            fontWeight: 500,
            textBaseline: 'top',
            text: row === 1 ? 'important but not urgency' : 'not important and not urgency',

            maxLineWidth: 200,
            pickable: true
          });

          container.add(text);

          return {
            rootContainer: container
          };
        }
      },
      {
        field: 'not_urgency',
        title: 'not urgency',
        width: 400,
        headerStyle: {
          lineHeight: 50,
          bgColor: '#4991e3',
          color: 'white',
          textAlign: 'center',
          fontSize: 26,
          fontWeight: 600
        },
        style: {
          fontFamily: 'Arial',
          fontSize: 12,
          fontWeight: 'bold'
        },
        customRender(args) {
          console.log(args);
          const { width, height } = args.rect;
          const { dataValue, table, row } = args;
          const elements = [];
          let top = 30;
          const left = 15;
          let maxWidth = 0;

          elements.push({
            type: 'text',
            fill: '#000',
            fontSize: 20,
            fontWeight: 500,
            textBaseline: 'middle',
            text: row === 1 ? 'important but not urgency' : 'not important and not urgency',
            x: left + 50,
            y: top - 5,

            maxLineWidth: 200,
            pickable: true
          });

          return {
            elements,
            expectedHeight: top + 20,
            expectedWidth: 100
          };
        }
      }
    ],
    records: [
      {
        type: 'important',
        urgency: ['crisis', 'urgent problem', 'tasks that must be completed within a limited time'],
        not_urgency: [
          'preventive measures',
          'development relationship',
          'identify new development opportunities',
          'establish long-term goals'
        ]
      },
      {
        type: 'Not\nimportant',
        urgency: ['Receive visitors', 'Certain calls, reports, letters, etc', 'Urgent matters', 'Public activities'],
        not_urgency: [
          'Trivial busy work',
          'Some letters',
          'Some phone calls',
          'Time-killing activities',
          'Some pleasant activities'
        ]
      }
    ],
    defaultRowHeight: 80,
    heightMode: 'autoHeight',
    widthMode: 'standard',
    autoWrapText: true,
    theme: VTable.themes.DEFAULT.extends({
      textPopTipStyle: {
        title: 'title'
      }
    })
  };

  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window['tableInstance'] = tableInstance;

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
