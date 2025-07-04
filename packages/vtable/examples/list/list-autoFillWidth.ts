import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing'
  }));
};

export function createTable() {
  const records = generatePersons(10);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'email1',
      title: 'email',
      width: 'auto',
      minWidth: 150
    },
    {
      field: 'email1',
      title: 'email',
      width: 'auto',
      minWidth: 150
    },
    {
      field: 'email1',
      title: 'email',
      width: 'auto',
      minWidth: 150
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    // emptyTip: true,
    records,
    columns: [...columns],
    autoFillWidth: true
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID)!, option);
  (window as any).tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
