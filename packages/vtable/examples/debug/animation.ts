/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    columns: [
      {
        field: '0',
        caption: '名称'
      },
      {
        field: '1',
        caption: '年龄'
      },
      {
        field: '2',
        caption: '性别'
      },
      {
        field: '3',
        caption: '爱好'
      }
    ],
    records: new Array(10).fill(['张三', 18, '男', '🏀']),
    animationAppear: {
      duration: 1000,
      delay: 500,
      type: 'one-by-one', // all
      direction: 'row' // colunm
    }
  };

  // document.getElementById(CONTAINER_ID).parentElement.style.display = 'none';
  const instance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = instance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
