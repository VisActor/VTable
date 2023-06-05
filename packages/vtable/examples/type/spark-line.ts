import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [
        { x: 0, y: 10 },
        { x: 1, y: 40 },
        { x: 2, y: 60 },
        { x: 2.5, y: 44 },
        { x: 3, y: 30 },
        { x: 5, y: 20 },
        { x: 7, y: 50 },
        { x: 8, y: 70 }
      ]
    },
    {
      progress: 80,
      id: 2,
      name: 'b',
      lineData: [
        { x: 0, y: 10 },
        { x: 1, y: 40 },
        { x: 2, y: 60 },
        { x: 2.5, y: 44 },
        { x: 3, y: 30 },
        { x: 4, y: 20 },
        { x: 5, y: 20 },
        { x: 6, y: 60 },
        { x: 7, y: 50 },
        { x: 8, y: 70 }
      ]
    },
    {
      progress: 1,
      id: 3,
      name: 'c',
      lineData: [
        { x: 0, y: 10 },
        { x: 1, y: 40 },
        { x: 2, y: 60 },
        { x: 2.5, y: 44 },
        { x: 3, y: 30 },
        { x: 4, y: 20 },
        { x: 5, y: 20 },
        { x: 6, y: 60 },
        { x: 7, y: 50 },
        { x: 8, y: 70 }
      ]
    },
    {
      progress: 55,
      id: 4,
      name: 'd',
      lineData: [
        { x: 0, y: 10 },
        { x: 1, y: 40 },
        { x: 2, y: 60 },
        { x: 2.5, y: 44 },
        { x: 3, y: 30 },
        { x: 4, y: 20 },
        { x: 5, y: 20 },
        { x: 6, y: 60 },
        { x: 7, y: 50 },
        { x: 8, y: 70 }
      ]
    },
    {
      progress: 28,
      id: 5,
      name: 'e',
      total: true,
      lineData: [
        { x: 0, y: 10 },
        { x: 1, y: 40 },
        { x: 2, y: 60 },
        { x: 2.5, y: 44 },
        { x: 3, y: 30 },
        { x: 4, y: 20 },
        { x: 5, y: 20 },
        { x: 6, y: 60 },
        { x: 7, y: 50 },
        { x: 8, y: 70 }
      ]
    }
  ];
  const baseSpec = {
    type: 'line',
    xField: {
      field: 'x',
      domain: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      type: 'point'
    },
    yField: {
      field: 'y',
      domain: [0, 80],
      type: 'linear'
    },
    pointShowRule: 'all',
    line: {
      visible: true,
      style: {
        stroke: '#2E62F1',
        strokeWidth: 2
      }
    },
    symbol: {
      visible: true,
      state: {
        hover: {
          stroke: 'blue',
          strokeWidth: 1,
          fill: 'red',
          shape: 'circle',
          size: 4
        }
      },
      style: {
        stroke: 'red',
        strokeWidth: 1,
        fill: 'yellow',
        shape: 'circle',
        size: 2
      }
    },
    crosshair: {
      style: {
        stroke: 'gray',
        strokeWidth: 1
      }
    }
  };
  const totalSpec = {
    type: 'line',
    xField: 'x',
    yField: 'y',
    pointShowRule: 'all',
    line: {
      visible: true,
      style: {
        stroke: 'green',
        strokeWidth: 4
      }
    },
    symbol: {
      visible: true,
      state: {
        hover: {
          stroke: 'blue',
          strokeWidth: 1,
          fill: 'red',
          shape: 'circle',
          size: 4
        }
      },
      style: {
        stroke: 'red',
        strokeWidth: 1,
        fill: 'yellow',
        shape: 'circle',
        size: 2
      }
    },
    crosshair: {
      style: {
        stroke: 'gray',
        strokeWidth: 1
      }
    }
  };

  const option: VTable.ListTableConstructorOptions = {
    parentElement: document.getElementById(Table_CONTAINER_DOM_ID),
    columns: [
      {
        field: 'id',
        caption: 'ID',
        sort: (v1, v2, order) => {
          if (order === 'desc') {
            return v1 === v2 ? 0 : v1 > v2 ? -1 : 1;
          }
          return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
        },
        width: 100
      },
      {
        field: 'lineData',
        caption: '这是一个折线图1',
        width: 250,
        columnType: 'sparkline',
        sparklineSpec: args => {
          const { col, row } = args;
          const data = instance.getCellOriginRecord(col, row);
          if (data.total) {
            return totalSpec;
          }
          return baseSpec;
        }
      },
      {
        field: 'lineData',
        caption: '这是一个折线图2',
        width: 250,
        columnType: 'sparkline',
        sparklineSpec: Object.assign({}, baseSpec, {
          symbol: {
            visible: false,
            state: {
              hover: {
                stroke: 'blue',
                strokeWidth: 1,
                fill: 'red',
                shape: 'circle',
                size: 4
              }
            },
            style: {
              stroke: 'red',
              strokeWidth: 1,
              fill: 'yellow',
              shape: 'circle',
              size: 2
            }
          }
        })
      }
    ],
    showPin: true, //显示VTable内置冻结列图标
    widthMode: 'standard',
    allowFrozenColCount: 2
  };

  const instance = new ListTable(option);

  //设置表格数据
  instance.setRecords(personsDataSource);

  // VTable.bindDebugTool(instance.scenegraph.stage as any, {
  //   customGrapicKeys: ['role', '_updateTag'],
  // });

  // 只为了方便控制太调试用，不要拷贝
  (window as any).tableInstance = instance;
}
