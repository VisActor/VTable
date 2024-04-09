import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        title: 'parent',
        columns: [
          {
            field: 'percent',
            title: 'percent',
            width: 120,
            sort: true
          },
          {
            field: 'percent',
            title: 'percent',
            width: 120,
            sort: true
          }
        ]
      },
      {
        field: 'percent',
        title: 'percent',
        width: 120,
        sort: true
      },
      {
        field: 'percent',
        title: 'column radio',
        width: 120,
        // width: 'auto',
        cellType: 'radio'
        // disable: true,
        // checked: true
      },
      {
        field: 'check',
        title: 'cell radio',
        // width: 'auto',
        width: 200,
        cellType: 'radio',
        radioCheckType: 'cell',
        radioDirectionInCell: 'vertical',
        style: {
          spaceBetweenRadio: 10
          // size: 40,
          // spaceBetweenTextAndIcon: 15
        }
        // checked: false
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    heightMode: 'autoHeight',
    // transpose: true
    theme: VTable.themes.DEFAULT.extends({
      checkboxStyle: {
        defaultFill: 'red'
      }
    })
  };

  const instance = new ListTable(option);

  let records = [];
  const data = [
    { percent: '100%', value: 20, check: { text: 'unchecked', checked: false, disable: false } },
    { percent: '80%', value: 18, check: { text: 'checked', checked: true, disable: false } },
    { percent: '20%', value: 12, check: { text: 'checked', checked: false, disable: false } },
    { percent: '0%', value: 10, check: { text: 'checked', checked: false, disable: false } },
    { percent: '60%', value: 16, check: { text: 'disable', checked: true, disable: true } },
    { percent: '40%', value: 14, check: { text: 'disable', checked: false, disable: true } },
    { percent: '0%', value: -10, check: true },
    { percent: '0%', value: -10, check: ['选中', '选中'] }
  ];
  for (let i = 0; i < 200; i++) {
    records = records.concat(data);
  }
  //设置表格数据
  instance.setRecords(records);

  bindDebugTool(instance.scenegraph.stage as any, {
    // customGrapicKeys: ['role', '_updateTag'],
  });

  const { RADIO_STATE_CHANGE } = VTable.ListTable.EVENT_TYPE;
  instance.on(RADIO_STATE_CHANGE, e => {
    console.log(e.col, e.row, e.radioIndexInCell);
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
