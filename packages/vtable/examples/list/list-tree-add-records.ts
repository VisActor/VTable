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
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createTable() {
  const data = [
    { id: 1, name: '1', children: [{ id: '1-1', name: '1-1' }] },
    { id: 2, name: '2', children: [{ id: '2-1', name: '2-1' }] }
  ];
  const columns = [
    {
      field: 'id',
      title: 'id',
      width: 'auto',
      tree: true
    },
    {
      field: 'name',
      title: 'name',
      width: 'auto'
    }
  ];

  const option = {
    records: data,
    columns,
    widthMode: 'standard'
  };
  const tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
  window.tableInstance = tableInstance;
  // tableInstance.addRecords({ id: '1-2', name: '1-2' }, [0, 2]);
  // tableInstance.on('sort_click', args => {
  //   tableInstance.updateSortState(
  //     {
  //       field: args.field,
  //       order: Date.now() % 3 === 0 ? 'desc' : Date.now() % 3 === 1 ? 'asc' : 'normal'
  //     },
  //     false
  //   );
  //   return false; //return false代表不执行内部排序逻辑
  // });
}
