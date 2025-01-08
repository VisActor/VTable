// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-checkbox init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

  let records = [];
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      check: { text: 'unchecked', checked: false, disable: false }
    },
    {
      progress: 80,
      id: 2,
      name: 'b',
      check: { text: 'unchecked', checked: false, disable: true }
    },
    {
      progress: 1,
      id: 3,
      name: 'c',
      check: { text: 'checked', checked: true, disable: false }
    },
    {
      progress: 55,
      id: 4,
      name: 'd',
      check: { text: 'checked', checked: true, disable: true }
    },
    {
      progress: 28,
      id: 5,
      name: 'e',
      check: { text: 'unknown', disable: false }
    }
  ];
  for (let i = 0; i < 400; i++) {
    records = records.concat(personsDataSource);
  }
  const option = {
    columns: [
      {
        field: '',
        headerType: 'checkbox',
        cellType: 'checkbox',
        width: 60,
        checked: false
      },
      {
        field: 'check',
        headerType: 'checkbox',
        cellType: 'checkbox',
        width: 130,
        checked: true
      },
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        caption: 'progress ',
        description: '这是一个标题的详细描述',
        width: 150,
        headerType: 'checkbox',
        cellType: 'checkbox',
        checked: true
      },
      {
        field: 'id',
        caption: 'ID',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 100,
        headerType: 'checkbox',
        cellType: 'checkbox',
        checked: true,
        disable: true
      },
      {
        field: 'id',
        fieldFormat(rec) {
          return `这是第${rec.id}号`;
        },
        caption: 'ID说明',
        description: '这是一个ID详细描述',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 150
      },
      {
        caption: 'Name',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        field: 'name',
        width: 150
      }
    ],
    showPin: false, //显示xTable内置冻结列图标
    widthMode: 'standard',
    frozenColCount: 2,
    allowFrozenColCount: 2,
    records
  };

  const listTable = new ListTable(containerDom, option);
  test('listTable-checkbox getCheckboxState', () => {
    expect(listTable.stateManager?.checkedState.size).toEqual(100);
    expect(listTable.getCheckboxState().length).toEqual(2000);
    listTable.release();
  });
});
