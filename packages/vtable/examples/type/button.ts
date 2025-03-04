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
        width: 120
      },
      {
        field: 'button',
        title: 'button',
        width: 'auto',
        cellType: 'button',
        disable: false,
        text: 'button',
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
    { percent: '20%', value: 12 },
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

  instance.on(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e => {
    console.log(VTable.ListTable.EVENT_TYPE.BUTTON_CLICK, e.col, e.row, e.event);
  });

  // 只为了方便控制太调试用，不要拷贝
  (window as any).tableInstance = instance;
}
