/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);

function createColumn(col: number) {
  const arr: any[] = [];
  for (let i = 0; i < col; i++) {
    const obj = {
      title: i,
      field: i
      // width: "auto",
    };
    arr.push(obj);
  }
  return arr;
}

function createRecords(col: number, row: number) {
  const arr: any[] = [];
  for (let i = 0; i < row; i++) {
    const obj = {};
    for (let j = 0; j < col; j++) {
      obj[j] = `c${j}r${i}`;
    }
    arr.push(obj);
  }
  return arr;
}

export function createTable() {
  const records = createRecords(500, 500);
  const columns = createColumn(500);

  const option = {
    records,
    columns,
    // 表格列宽度的计算模式，可以是 'standard'（标准模式）、'adaptive'（自适应容器宽度模式）或 'autoWidth'（自动宽度模式），默认为 'standard'。
    widthMode: 'autoWidth',
    heightMode: 'autoHeight',
    defaultColWidth: 120,
    // 冻结列数
    // frozenColCount: 3,
    theme: {
      scrollStyle: {
        visible: 'always',
        width: 20,
        verticalPadding: [0, 2, 0, 2],
        horizontalPadding: [5, 0, 5, 0]
      }
    }
  };

  // document.getElementById(CONTAINER_ID).parentElement.style.display = 'none';
  const instance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = instance;

  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });

  window.update = () => {
    (option.rowTree = [
      {
        dimensionKey: '20001',
        value: '销售额'
      }
    ]),
      (option.rows = [
        {
          dimensionKey: '20001',
          title: '销售额',
          headerStyle: {
            color: 'red',
            cursor: 'pointer'
          }
        }
      ]),
      tableInstance.updateOption(option);
  };
}
