import * as VTable from '../../src';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const personsDataSource = [
    {
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [10, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [7, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [1, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [-5, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [4, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [10, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [7, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [1, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [-5, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [4, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [10, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [7, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [1, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [-5, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [4, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [10, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [7, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [1, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [-5, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [4, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [10, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [7, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [1, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [-5, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [4, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      progress: 100,
      id: 1,
      name: 'a',
      lineData: [10, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [7, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [1, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [-5, 5, 7, 8, 3, 9, 4],
      lineData2: [
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
      lineData: [4, 5, 7, 8, 3, 9, 4],
      lineData2: [
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

  const baseSpec: VTable.TYPES.SparklineSpec = {
    type: 'line',
    xField: {
      field: 'x',
      domain: [0, 1, 2, 3, 4, 5, 6, 7, 8]
    },
    yField: {
      field: 'y',
      domain: [0, 80]
    },
    pointShowRule: 'all',
    line: {
      style: {
        stroke: '#2E62F1',
        strokeWidth: 2
      }
    },
    point: {
      hover: {
        stroke: 'blue',
        strokeWidth: 1,
        fill: 'red',
        shape: 'circle',
        size: 4
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
  const totalSpec: VTable.TYPES.SparklineSpec = {
    type: 'line',
    xField: 'x',
    yField: 'y',
    pointShowRule: 'all',
    line: {
      style: {
        stroke: 'green',
        strokeWidth: 4
      }
    },
    point: {
      hover: {
        stroke: 'blue',
        strokeWidth: 1,
        fill: 'red',
        shape: 'circle',
        size: 4
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

  const specFieldString: VTable.TYPES.SparklineSpec = {
    type: 'line',
    xField: 'x',
    yField: 'y',
    pointShowRule: 'all',
    line: {
      style: {
        stroke: '#2E62F1',
        strokeWidth: 2
      }
    },
    point: {
      hover: {
        stroke: 'blue',
        strokeWidth: 1,
        fill: 'red',
        shape: 'circle',
        size: 4
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
    container: document.getElementById(CONTAINER_ID),
    columns: [
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
        field: 'lineData',
        title: '这是一个折线图1',
        width: 250,
        cellType: 'sparkline'
      },
      {
        field: 'lineData2',
        title: '这是一个折线图2',
        width: 250,
        cellType: 'sparkline',
        sparklineSpec: Object.assign({}, baseSpec, {
          smooth: true,
          point: {
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
      },
      {
        field: 'lineData2',
        title: '这是一个折线图3',
        width: 250,
        cellType: 'sparkline',
        sparklineSpec: specFieldString
      },
      {
        field: 'lineData2',
        title: '这是一个折线图4',
        width: 250,
        cellType: 'sparkline',
        sparklineSpec: {
          type: 'line',
          xField: 'x',
          yField: 'y',
          crosshair: {
            style: {
              stroke: 'red'
            }
          }
        }
      }
    ],
    showFrozenIcon: true, //显示VTable内置冻结列图标
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
  window.tableInstance = instance;
  (window as any).exportImgs = function () {
    const base64ImgList: string[] = [];
    const t0 = window.performance.now();
    const scrollTop = instance.scrollTop;
    for (let col = 1; col <= 4; col++) {
      for (let row = 1; row <= 30; row++) {
        base64ImgList.push(instance.exportCellImg(col, row));
      }
    }
    instance.scrollTop = scrollTop;
    console.log('cost time', window.performance.now() - t0);
    return base64ImgList;
  };

  // setTimeout(() => {
  //   exportImgs();
  // }, 5000);
}
