/* eslint-disable */
import VChart from '@visactor/vchart';
import { container, VWindow, type IStage, type IWindow } from '@src/vrender';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const spec = {
    type: 'common',
    series: [
      {
        id: 'col_88',
        type: 'bar',
        data: {
          id: 'col_88'
        },
        bar: {
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          },
          style: {
            cursor: 'pointer'
          }
        },
        barMinWidth: 1,
        barMaxWidth: 30,
        barMinHeight: 1,
        xField: 'col_104',
        yField: 'col_88',
        stack: true,
        sortDataByAxis: true
      },
      {
        type: 'bar',
        id: 'forecast_col_88_0',
        data: {
          id: 'forecast_col_88_0'
        },
        xField: 'col_104',
        yField: 'forecast_col_88_0',
        stack: true,
        point: {
          style: {
            cursor: 'pointer',
            fillOpacity: 1,
            lineWidth: 1,
            size: 8,
            fill: 'green'
          },
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          }
        },
        bar: {
          style: {
            cursor: 'pointer',
            fill: 'green'
          },
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          }
        },
        line: {
          style: {
            stroke: 'green'
          }
        },
        area: {
          style: {
            cursor: 'pointer',
            fill: 'green'
          }
        },
        direction: 'vertical',
        barMaxWidth: 30,
        shape: 'M512 512m-512 0a23 23 0 1 0 1024 0 23 23 0 1 0-1024 0Z',
        size: 10,
        sortDataByAxis: true
      },
      {
        type: 'bar',
        id: 'forecast_col_88_1',
        data: {
          id: 'forecast_col_88_1'
        },
        xField: 'col_104',
        yField: 'forecast_col_88_1',
        stack: true,
        point: {
          style: {
            cursor: 'pointer',
            fillOpacity: 1,
            lineWidth: 1,
            size: 8,
            fill: 'green'
          },
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          }
        },
        bar: {
          style: {
            cursor: 'pointer',
            fill: 'green'
          },
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          }
        },
        line: {
          style: {
            stroke: 'green'
          }
        },
        area: {
          style: {
            cursor: 'pointer',
            fill: 'green'
          }
        },
        direction: 'vertical',
        barMaxWidth: 30,
        shape: 'M512 512m-512 0a23 23 0 1 0 1024 0 23 23 0 1 0-1024 0Z',
        size: 10,
        sortDataByAxis: true
      },
      {
        type: 'bar',
        id: 'forecast_col_88_2',
        data: {
          id: 'forecast_col_88_2'
        },
        xField: 'col_104',
        yField: 'forecast_col_88_2',
        stack: true,
        point: {
          style: {
            cursor: 'pointer',
            fillOpacity: 1,
            lineWidth: 1,
            size: 8,
            fill: 'green'
          },
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          }
        },
        bar: {
          style: {
            cursor: 'pointer',
            fill: 'green'
          },
          state: {
            selected_reverse: {
              fill: '#ddd',
              fillOpacity: 0.2
            }
          }
        },
        line: {
          style: {
            stroke: 'green'
          }
        },
        area: {
          style: {
            cursor: 'pointer',
            fill: 'green'
          }
        },
        direction: 'vertical',
        barMaxWidth: 30,
        shape: 'M512 512m-512 0a23 23 0 1 0 1024 0 23 23 0 1 0-1024 0Z',
        size: 10,
        sortDataByAxis: true
      }
    ],
    axes: [
      {
        range: {
          min: 0,
          max: 3099446.139999995
        },
        label: {
          style: {
            fontSize: 14
          },
          visible: false,
          flush: true
        },
        orient: 'left',
        min: 0,
        seriesId: ['col_88', 'forecast_col_88_0', 'forecast_col_88_1', 'forecast_col_88_2'],
        type: 'linear',
        title: {
          visible: false
        },
        domainLine: {
          visible: false
        },
        tick: {},
        sync: {
          axisId: 'NO_AXISID_FRO_VTABLE'
        }
      },
      {
        range: {
          min: -332219.03000000253,
          max: 3099446.139999995
        },
        label: {
          style: {
            fontSize: 14
          },
          visible: false,
          flush: true
        },
        orient: 'right',
        visible: false,
        seriesId: ['col_88', 'forecast_col_88_0', 'forecast_col_88_1', 'forecast_col_88_2'],
        type: 'linear',
        title: {
          visible: false
        },
        domainLine: {
          visible: false
        },
        tick: {},
        sync: {
          axisId: 'NO_AXISID_FRO_VTABLE'
        }
      },
      {
        domain: ['家具', '技术', '办公用品'],
        label: {
          style: {
            fontSize: 14
          },
          visible: false
        },
        type: 'band',
        orient: 'bottom',
        visible: true,
        domainLine: {
          visible: false
        },
        tick: {
          visible: false
        },
        subTick: {
          visible: false
        },
        title: {
          visible: false
        }
      }
    ],
    scales: [
      {
        id: 'col_88',
        type: 'ordinal',
        range: ['#1763FF']
      },
      {
        id: 'forecast_col_88_0',
        type: 'ordinal',
        range: ['#1763FF']
      },
      {
        id: 'forecast_col_88_1',
        type: 'ordinal',
        range: ['#1763FF']
      },
      {
        id: 'forecast_col_88_2',
        type: 'ordinal',
        range: ['#1763FF']
      }
    ],
    tooltip: {
      visible: true,
      mark: {
        title: {
          visible: false
        },
        content: [
          {
            id: 'TJ9194a62fe76749788aecd5925dc780',
            fieldName: 'col_70'
          },
          {
            id: 'TJf1555be631da475fa8e983817e01cf',
            fieldName: 'col_104'
          },
          {
            id: 'TJ7510091ab7fe4c86a466ac353b863e',
            fieldName: 'col_71'
          },
          {
            id: 'TJ09eb1a9575674cac82a34b1f094f7c',
            fieldName: 'col_88'
          }
        ]
      },
      dimension: {
        visible: false
      },
      style: {},
      renderMode: 'html',
      throttleInterval: 150,

      group: {
        title: {
          visible: false
        },
        valueLabel: {
          visible: false
        },
        triggerMark: 'line'
      }
    },
    color: {
      type: 'ordinal',
      range: ['#1763FF']
    },
    label: {
      visible: false
    },
    markLine: [],
    sortDataByAxis: true,
    padding: 0,
    dataZoom: []
  };

  const vchart = new VChart(spec, { dom: CONTAINER_ID, animation: false });
  vchart.renderSync();
  vchart.updateViewBox(
    // {
    //   x1: viewBox.x1 - (chart.getRootNode() as any).table.scrollLeft,
    //   x2: viewBox.x2 - (chart.getRootNode() as any).table.scrollLeft,
    //   y1: viewBox.y1 - (chart.getRootNode() as any).table.scrollTop,
    //   y2: viewBox.y2 - (chart.getRootNode() as any).table.scrollTop
    // },
    {
      x1: 0,
      x2: 201,
      y1: 0,
      y2: 436
    },
    false,
    false
  );
  const matrix = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 293,
    f: 472
  };
  // const stageMatrix = {
  //   "a": 1,
  //   "b": 0,
  //   "c": 0,
  //   "d": 1,
  //   "e": 0,
  //   "f": 0
  // };
  const chartStage = vchart.getStage();
  const stageMatrix = chartStage.window.getViewBoxTransform().clone();
  debugger;
  stageMatrix.multiply(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

  chartStage.window.setViewBoxTransform &&
    chartStage.window.setViewBoxTransform(
      stageMatrix.a,
      stageMatrix.b,
      stageMatrix.c,
      stageMatrix.d,
      stageMatrix.e,
      stageMatrix.f
    );
  vchart.updateModelSpecSync(
    { type: 'axes', index: 0 },
    {
      min: 0,
      max: 3099446.139999995,
      tick: {
        tickMode: undefined
      }
    },
    true
  );
  vchart.updateModelSpecSync(
    { type: 'axes', index: 1 },
    {
      min: -332219.03000000253,
      max: 3099446.139999995,
      tick: {
        tickMode: undefined
      }
    },
    true
  );
  vchart.updateModelSpec({ type: 'axes', index: 3 }, { domain: ['家具', '技术', '办公用品'] }, true);
  vchart.updateFullDataSync([
    {
      id: 'col_88',
      values: [
        {
          col_70: '2021',
          col_104: '技术',
          col_88: 139143.26
        },
        {
          col_70: '2021',
          col_104: '家具',
          col_88: 156815.92
        },
        {
          col_70: '2021',
          col_104: '办公用品',
          col_88: 175510.92000000016
        }
      ]
    },
    {
      id: 'forecast_col_88_0',
      values: []
    },
    {
      id: 'forecast_col_88_1',
      values: []
    },
    {
      id: 'forecast_col_88_2',
      values: []
    }
  ]);
  const sg = vchart.getStage();
  debugger;
  //  const canvas=sg.toCanvas();
  const window = renderToNewWindow(sg);
  const c = window.getNativeHandler();
  const canvas = c.nativeCanvas;
  canvas.style.position = 'absolute';
  canvas.style.top = '0px';
  canvas.style.left = '0px';
  document.body.appendChild(canvas);
  // window['updateData'] = () => {
  // }
}

function renderToNewWindow(stage) {
  const matrix = stage.window.getViewBoxTransform();
  const window = container.get<IWindow>(VWindow);
  const x1 = 0;
  const y1 = 0;
  const x2 = stage.viewWidth;
  const y2 = stage.viewHeight;
  const width = stage.viewWidth;
  const height = stage.viewHeight;

  window.create({
    viewBox: { x1, y1, x2, y2 },
    width: width * matrix.a,
    height: height * matrix.d,
    dpr: stage.window.dpr,
    canvasControled: true,
    offscreen: true,
    title: ''
  });

  window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
  debugger;
  (stage as any).renderTo(window);
  return window;
}
