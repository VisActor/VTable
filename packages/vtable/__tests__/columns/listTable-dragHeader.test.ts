// @ts-nocheck
// 有问题可对照demo unitTestListTable
import { ListTable } from '../../src';
import { createDiv } from '../dom';
global.__VERSION__ = 'none';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};
describe('listTable-cellType-function init test', () => {
  const containerDom: HTMLElement = createDiv();
  containerDom.style.position = 'relative';
  containerDom.style.width = '1000px';
  containerDom.style.height = '800px';
  const records = generatePersons(10);
  const columns = [
    {
      field: 'id',
      title: 'ID',
      sort: true,
      width: 'auto'
    },
    {
      field: 'email1',
      title: 'email',
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name'
        },
        {
          field: 'name',
          title: 'Last Name'
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday'
      // width: 200
    },
    {
      field: 'sex',
      title: 'sex'
    },
    {
      field: 'tel',
      title: 'telephone'
    },
    {
      field: 'work',
      title: 'job'
    },
    {
      field: 'city',
      title: 'city'
    }
  ];
  const option = {
    records,
    columns,
    dragHeaderMode: 'all',
    autoWrapText: true
  };
  const listTable = new ListTable(containerDom, option);
  test('listTable dragHeader interaction', () => {
    listTable.selectCell(4, 1);
    listTable.stateManager.startMoveCol(4, 1, 342, 60, null);
    listTable.stateManager.updateMoveCol(1, 1, 100, 60);
    listTable.stateManager.endMoveCol();
    expect(listTable.columns).toEqual([
      { field: 'id', sort: true, title: 'ID', width: 'auto' },
      { field: 'date1', title: 'birthday' },
      { field: 'email1', sort: true, title: 'email' },
      {
        columns: [
          { field: 'name', title: 'First Name' },
          { field: 'name', title: 'Last Name' }
        ],
        title: 'full name'
      },
      { field: 'sex', title: 'sex' },
      { field: 'tel', title: 'telephone' },
      { field: 'work', title: 'job' },
      { field: 'city', title: 'city' }
    ]);
  });
  test('listTable changeHeaderPosition moves columns', () => {
    const containerDom2: HTMLElement = createDiv();
    containerDom2.style.position = 'relative';
    containerDom2.style.width = '1000px';
    containerDom2.style.height = '800px';
    const records2 = [
      { a: 1, b: 2, c: 3 },
      { a: 4, b: 5, c: 6 }
    ];
    const columns2 = [
      { field: 'a', title: 'A' },
      { field: 'b', title: 'B' },
      { field: 'c', title: 'C' }
    ];
    const listTable2 = new ListTable(containerDom2, { records: records2, columns: columns2, dragHeaderMode: 'all' });
    listTable2.changeHeaderPosition({
      source: { col: 1, row: 0 },
      target: { col: 2, row: 0 },
      movingColumnOrRow: 'column'
    });
    expect(listTable2.columns).toEqual([
      { field: 'a', title: 'A' },
      { field: 'c', title: 'C' },
      { field: 'b', title: 'B' }
    ]);
    listTable2.release();
  });
  test('listTable dragHeader interaction', () => {
    option.transpose = true;
    listTable.updateOption(option);
    listTable.selectCell(1, 4);
    listTable.stateManager.startMoveCol(1, 4, 120, 60);
    listTable.stateManager.updateMoveCol(1, 1, 120, 177);
    listTable.stateManager.endMoveCol();
    expect(listTable.columns).toEqual([
      { field: 'id', sort: true, title: 'ID', width: 'auto' },
      { field: 'date1', title: 'birthday' },
      { field: 'email1', sort: true, title: 'email' },
      {
        columns: [
          { field: 'name', title: 'First Name' },
          { field: 'name', title: 'Last Name' }
        ],
        title: 'full name'
      },
      { field: 'sex', title: 'sex' },
      { field: 'tel', title: 'telephone' },
      { field: 'work', title: 'job' },
      { field: 'city', title: 'city' }
    ]);
    listTable.release();
  });
});
