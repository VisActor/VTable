// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
describe('listTable-cellType init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';

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

  const columns = [
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
  ];
  const option = {
    records,
    columns,
    widthMode: 'standard',
    defaultRowHeight: 80,
    heightMode: 'autoHeight'
  };
  const listTable = new ListTable(containerDom, option);
  test('cell-type switch getCellSwitchState', () => {
    expect(listTable.getCellSwitchState(2, 1)).toBe(undefined);
    expect(listTable.getCellSwitchState(2, 3)).toBe(true);
  });
  test('cell-type switch setCellSwitchState', () => {
    listTable.setCellSwitchState(2, 1, true);
    expect(listTable.getCellSwitchState(2, 1)).toBe(true);
    listTable.setCellSwitchState(2, 1, false);
    expect(listTable.getCellSwitchState(2, 1)).toBe(false);
  });
  test('cell-type switch getSwitchState', () => {
    expect(listTable.getSwitchState('switch')).toEqual([
      false,
      undefined,
      true,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    ]);
  });
});
