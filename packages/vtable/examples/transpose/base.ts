import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80,
      id: 2,
      name: 'b'
    },
    {
      progress: 1,
      id: 3,
      name: 'c'
    },
    {
      progress: 55,
      id: 4,
      name: 'd'
    },
    {
      progress: 28,
      id: 5,
      name: 'e'
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },
        title: 'progress',
        description: '这是一个标题的详细描述',
        width: 150
      },
      {
        field: 'id',
        title: 'ID',
        fieldFormat(rec) {
          if (rec.id === 2) {
            return 3;
          }
          return rec.id;
        },
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 100
      },
      {
        field: 'id',
        fieldFormat(rec) {
          return `这是第${rec.id}号`;
        },
        title: 'ID说明',
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
        title: 'Name',
        headerStyle: {
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 13,
          fontFamily: 'sans-serif'
        },
        style: {
          color(args) {
            const { col } = args;
            if (col === 1) {
              return 'blue';
            }
            return 'red';
          },
          fontSize(args) {
            const { col } = args;
            if (col === 1) {
              return 16;
            }
            return 20;
          },
          fontWeight(args) {
            const { col } = args;
            if (col === 1) {
              return 'bold';
            }
            return '';
          },
          fontFamily: 'sans-serif'
        },
        field: 'name',
        width: 150
      }
    ],
    theme: VTable.themes.ARCO,
    widthMode: 'standard',
    defaultHeaderColWidth: 150,
    defaultColWidth: 100,
    transpose: true
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  VTable.bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
