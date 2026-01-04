import * as VTable from '../../src';
const CONTAINER_ID = 'vTable';
import data from './1.json';

export function createTable() {
  const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), data);
  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = tableInstance;
}
