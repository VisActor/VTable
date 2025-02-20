import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'percent',
        title: 'percent',
        width: 120
      },
      {
        field: 'value',
        title: 'value',
        width: 120,
        sort: true
      },
      {
        field: 'switch',
        title: 'switch',
        width: 'auto',
        cellType: 'switch',
        disable: false,
        checkedText: 'on',
        uncheckedText: 'off',
        style: {
          color: '#FFF'
        }
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    defaultRowHeight: 80,
    heightMode: 'autoHeight'
  };

  const instance = new ListTable(option);

  const records = [
    { percent: '100%', value: 20 },
    { percent: '80%', value: 18 },
    {
      percent: '20%',
      value: 12,
      switch: {
        checked: true,
        disable: true
      }
    },
    { percent: '0%', value: 10 },
    { percent: '60%', value: 16 },
    { percent: '40%', value: 14 },
    { percent: '0%', value: -10 },
    { percent: '0%', value: -10 }
  ];

  //设置表格数据
  instance.setRecords(records);

  bindDebugTool(instance.scenegraph.stage as any, {
    // customGrapicKeys: ['role', '_updateTag'],
  });

  instance.on(VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE, e => {
    console.log(VTable.ListTable.EVENT_TYPE.SWITCH_STATE_CHANGE, e.col, e.row, e.checked);
  });

  // 只为了方便控制太调试用，不要拷贝
  (window as any).tableInstance = instance;
}
