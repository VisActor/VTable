import * as VTable from '../../src';
import { InputEditor } from '@visactor/vtable-editors';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
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
      progress: 80.4,
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80.4,
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      // progress: '',
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80.4,
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
    },
    {
      progress: 100,
      id: 1,
      name: 'a'
    },
    {
      progress: 80.4,
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
    emptyTip: true,
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'progress',
        fieldFormat(rec) {
          return `已完成${rec.progress}%`;
        },

        title: 'progress',
        description: '这是一个标题的详细描述',
        width: 'auto',
        showSort: true //显示VTable内置排序图标
      },
      {
        field: 'id',
        title: 'ID',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        aggregation: {
          aggregationType: VTable.TYPES.AggregationType.CUSTOM,
          aggregationFun(values, records) {
            // 使用 reduce() 方法统计金牌数
            const max = records.reduce((acc, data) => {
              acc = Math.max(data.id, acc);
              return acc;
            }, 0);
            return max;
          }
        }
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    autoFillWidth: true,
    allowFrozenColCount: 2,
    editor: 'input',
    headerEditor: 'input'
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  instance.on('change_cell_value', arg => {
    console.log(arg);
  });

  // bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag']
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}

window.createTable = createTable;
