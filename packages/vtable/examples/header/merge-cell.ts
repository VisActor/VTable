import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
import { InputEditor } from '@visactor/vtable-editors';

const input_editor = new InputEditor({});
VTable.register.editor('input', input_editor);
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
      name: 'a'
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80,
      id: 2,
      name: 'a'
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80,
      id: 2,
      name: 'a'
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80,
      id: 2,
      name: 'a'
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80,
      id: 2,
      name: 'a'
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
        width: 150,
        style: {
          // textStick: true
        }
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
        style: {
          textStick: true
        },
        width: 100,
        mergeCell: true
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
            const { row } = args;
            if (row === 1) {
              return 'blue';
            }
            return 'red';
          },
          fontSize(args) {
            const { row } = args;
            if (row === 1) {
              return 16;
            }
            return 20;
          },
          fontWeight(args) {
            const { row } = args;
            if (row === 1) {
              return 'bold';
            }
            return '';
          }
        },
        field: 'name',
        width: 150,
        mergeCell(v, v2) {
          console.log(v, v2);
          return v === v2;
        }
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      },
      {
        field: 'id',
        title: 'ID说明',
        width: 150
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    customMergeCell: (col, row, table) => {
      if (col <= 1 && row > 0 && row < 11) {
        return {
          text: 'customMergeCell',
          range: {
            start: {
              col: 0,
              row: 1
            },
            end: {
              col: 1,
              row: 10
            }
          },
          style: {
            bgColor: 'red',
            textStick: true
          }
        };
      }
    },
    editor: 'input'
  };

  const instance = new ListTable(option);
  window.tableInstance = instance;
  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'id',
    order: 'desc'
  });
}
