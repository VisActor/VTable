import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
export function createTable() {
  const records = [
    {
      '230517143221027': 'CA-2018-156720',
      '230517143221030': 'JM-15580',
      '230517143221032': 'Bagged Rubber Bands',
      '230517143221023': 'Office Supplies',
      '230517143221034': 'Fasteners',
      '230517143221037': 'West',
      '230517143221024': 'Loveland',
      '230517143221029': '2018-12-30',
      '230517143221042': '3',
      '230517143221040': '3.024',
      '230517143221041': '-0.605'
    }
  ];

  const columns = [
    {
      field: '230517143221027',
      title: 'Order ID',
      width: 'auto',
      sort: true
    },
    {
      field: '230517143221027',
      title: 'Order ID11 2',
      width: 'auto',
      sort: true
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    widthMode: 'standard',
    frozenColCount: 1,
    rightFrozenColCount: 2,
    bottomFrozenRowCount: 1
  };

  // 创建 VTable 实例
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
}
