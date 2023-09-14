import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

function DEFAULT_BG_COLOR(args) {
  const { row, table } = args;
  // if (row < table.frozenRowCount) {
  //   return "#FFF";
  // }
  const index = row - table.frozenRowCount;
  if (!(index & 1)) {
    return '#FFF';
  }
  return '#fbfbfc';
}

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
        title: 'ID'
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
        field: 'name',
        width: 150
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2,
    theme: {
      underlayBackgroundColor: '#b5e3f1',
      headerStyle: {
        color: '#1B1F23',
        bgColor: '#EEF1F5',
        fontFamily: 'PingFang SC',
        fontWeight: 500,
        fontSize: 12,
        borderColor: '#e1e4e8',
        padding: [8, 12, 8, 12],
        hover: {
          cellBgColor: '#c8daf6'
        }
      },
      rowHeaderStyle: {},
      cornerHeaderStyle: {},
      bodyStyle: {
        padding: [8, 12, 8, 12],
        color: '#141414',
        textAlign: 'right',
        fontFamily: 'PingFang SC',
        fontWeight: 500,
        fontSize: 12,
        bgColor: DEFAULT_BG_COLOR,
        borderColor: '#e1e4e8',
        hover: {
          cellBgColor: '#d6e6fe',
          inlineRowBgColor: '#F3F8FF',
          inlineColumnBgColor: '#F3F8FF'
        }
      },
      frameStyle: {
        borderColor: '#d1d5da',
        borderLineWidth: 1,
        borderLineDash: [],
        cornerRadius: 10,
        shadowBlur: 6,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(00, 24, 47, 0.06)'
      },
      frozenColumnLine: {
        shadow: {
          width: 4,
          startColor: 'rgba(00, 24, 47, 0.05)',
          endColor: 'rgba(00, 24, 47, 0)'
        }
      }
      // menuStyle: {
      //   color: '#000',
      //   highlightColor: '#2E68CF',
      //   font: '12px sans-serif',
      //   highlightFont: '12px sans-serif',
      //   hoverBgColor: '#EEE'
      // }
    },
    hover: {
      highlightMode: 'cross',
      disableHeaderHover: true
    },
    heightMode: 'autoHeight',
    autoWrapText: true
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource, {
    field: 'progress',
    order: 'desc'
  });

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
