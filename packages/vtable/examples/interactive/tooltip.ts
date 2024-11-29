import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a long long text ,to test tooltip'
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
        description: `这是一个标题的详细描述,这是一个标题的详细描述,
这是一个标题的详细描述,这是一个标题的详细描述,这是一个标题的详细描述,这是一个标题的详细描述,
这是一个标题的详细描述,这是一个标题的详细描述, 这是一个标题的详细描述,这是一个标题的详细描述,
这是一个标题的详细描述,这是一个标题的详细描述,这是一个标题的详细描述,这是一个标题的详细描述,
这是一个标题的详细描述,这是一个标题的详细描述`,
        width: 150,
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
        width: 850
      },
      {
        title: 'Name',
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
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    tooltip: {
      renderMode: 'html',
      isShowOverflowTextTooltip: true,
      overflowTextTooltipDisappearDelay: 1000,
      position: VTable.TYPES.Placement.top
    }
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  instance.on('click_cell', args => {
    const { col, row } = args;
    const rect = instance.getVisibleCellRangeRelativeRect({ col, row });
    if (col === 0 && row === 0) {
      instance.showTooltip(col, row, {
        content: '你好！',
        position: {
          x: rect.left,
          y: rect.bottom
        },
        referencePosition: { rect, placement: VTable.TYPES.Placement.right }, //TODO
        className: 'defineTooltip',
        style: {
          bgColor: 'black',
          color: 'white',
          fontSize: 14,
          fontFamily: 'STKaiti',
          arrowMark: true
        }
      });
    }
  });

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
