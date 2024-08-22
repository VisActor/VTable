import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    { name: 'Bananas', count: 1 },
    { name: 'Apples', count: 3 },
    { name: 'Bananas', count: 3 },
    { name: 'Bananas', count: 2 },
];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'name',
        
        title: 'Name',
        description: 'Name',
        sort:true,
        width: 150
      },
      {
        field: 'count',
        
        title: 'Count',
        description: 'Count',
        sort:true,
        width: 150
      },
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    multipleSort: true,
    widthMode: 'standard',
    allowFrozenColCount: 2
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    sortState:{
      field: 'name',
      order: 'desc'
    }
  });
  // instance.setRecords(personsDataSource);

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // instance.updateSortState({
  //   field: 'id',
  //   order: 'desc',
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
