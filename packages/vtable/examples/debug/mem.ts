/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  const option = {
    columns: [
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄', width: 80 },
      { field: 'city', title: '城市', width: 120 }
    ],
    records: Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `张三${i}`,
      age: i,
      city: `城市${i}`
    }))
  };
  // document.getElementById(CONTAINER_ID).parentElement.style.display = 'none';
  let tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  // window.tableInstance = instance;

  // tableInstance.onVChartEvent('mouseover', args => {
  //   console.log('listenChart mouseover', args);
  // });

  // bindDebugTool(tableInstance.scenegraph.stage, {
  //   customGrapicKeys: ['col', 'row']
  // });

  const update = async () => {
    // 执行20次release / new
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      // // tableInstance.release();
      // // instance.scenegraph.component.vScrollBar.release();
      // // instance.scenegraph.component.hScrollBar.release();
      // // instance.scenegraph.stage.removeAllChild();
      // // delete instance.scenegraph.stage.table;
      // // instance.scenegraph.clearCells();
      // tableInstance.scenegraph.component.vScrollBar.release();
      // tableInstance.scenegraph.component.hScrollBar.release();
      // tableInstance.animationManager.clear();
      // tableInstance.animationManager.ticker.release();
      // // instance.animationManager.ticker = null;
      // // instance.animationManager = null;
      // tableInstance.scenegraph.stage.ticker.release();
      tableInstance.release();
      tableInstance = null;
      await new Promise(resolve => setTimeout(resolve, 200));
      tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
      console.log(`第${i}次new完成`);
    }
  };

  window.update = update;
  // update();
}
