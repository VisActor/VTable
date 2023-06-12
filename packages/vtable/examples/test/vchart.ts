import VChart from '@visactor/vchart';
const Table_CONTAINER_DOM_ID = 'vTable';

export function createTable() {
  const canvasEl = document.createElement('canvas');
  canvasEl.width = 1600;
  canvasEl.height = 800;
  canvasEl.style.width = '1600px';
  canvasEl.style.height = '800px';
  document.getElementById(Table_CONTAINER_DOM_ID)?.appendChild(canvasEl);
  const spec = {
    type: 'common',
    series: [
      {
        type: 'area',
        data: {
          id: 'data'
        },
        xField: 'x',
        yField: 'y',
        seriesField: 'type',
        point: {
          style: {
            fillOpacity: 1,
            stroke: '#000',
            strokeWidth: 4
          },
          state: {
            hover: {
              fillOpacity: 0.5,
              stroke: 'blue',
              strokeWidth: 2
            },
            selected: {
              fill: 'red'
            }
          }
        },
        area: {
          style: {
            fillOpacity: 0.3,
            stroke: '#000',
            strokeWidth: 4
          },
          state: {
            hover: {
              fillOpacity: 1
            },
            selected: {
              fill: 'red',
              fillOpacity: 1
            }
          }
        },
        line: {
          state: {
            hover: {
              stroke: 'red'
            },
            selected: {
              stroke: 'yellow'
            }
          }
        }
      }
    ],
    axes: [
      { orient: 'left', range: { min: 0 } },
      { orient: 'bottom', label: { visible: true }, type: 'band' }
    ],
    legends: [
      {
        visible: true,
        orient: 'bottom'
      }
    ]
  };

  const cs = new VChart(spec, {
    renderCanvas: canvasEl,
    mode: 'desktop-browser',
    canvasControled: false,
    interactive: false,
    animation: false,
    viewBox: {
      x1: 100,
      y1: 100,
      x2: 400,
      y2: 400
    }
  } as any);
  cs.renderSync();
  cs._compiler._srView.renderer.stage().render();
  cs.updateDataSync('data', [
    { x: '0', type: 'A', y: '100' },
    { x: '1', type: 'A', y: '707' },
    { x: '2', type: 'A', y: '832' },
    { x: '3', type: 'A', y: '726' },
    { x: '4', type: 'A', y: '756' },
    { x: '5', type: 'A', y: '777' },
    { x: '6', type: 'A', y: '689' },
    { x: '7', type: 'A', y: '795' },
    { x: '8', type: 'A', y: '889' },
    { x: '9', type: 'A', y: '757' },
    { x: '0', type: 'B', y: '773' },
    { x: '1', type: 'B', y: '785' },
    { x: '2', type: 'B', y: '635' },
    { x: '3', type: 'B', y: '813' },
    { x: '4', type: 'B', y: '678' },
    { x: '5', type: 'B', y: '796' },
    { x: '6', type: 'B', y: '652' },
    { x: '7', type: 'B', y: '623' },
    { x: '8', type: 'B', y: '649' },
    { x: '9', type: 'B', y: '630' }
  ]);
  cs._compiler._srView.renderer.stage().render();
  // setTimeout(() => {
  cs.updateViewBox({
    x1: 600,
    y1: 100,
    x2: 900,
    y2: 400
  });
  cs.updateDataSync('data', [
    { x: '0', type: 'A', y: '600' },
    { x: '1', type: 'A', y: '707' },
    { x: '2', type: 'A', y: '832' },
    { x: '3', type: 'A', y: '726' },
    { x: '4', type: 'A', y: '756' },
    { x: '5', type: 'A', y: '777' },
    { x: '6', type: 'A', y: '689' },
    { x: '7', type: 'A', y: '795' },
    { x: '8', type: 'A', y: '889' },
    { x: '9', type: 'A', y: '757' },
    { x: '0', type: 'B', y: '773' },
    { x: '1', type: 'B', y: '785' },
    { x: '2', type: 'B', y: '635' },
    { x: '3', type: 'B', y: '813' },
    { x: '4', type: 'B', y: '678' },
    { x: '5', type: 'B', y: '796' },
    { x: '6', type: 'B', y: '652' },
    { x: '7', type: 'B', y: '623' },
    { x: '8', type: 'B', y: '649' },
    { x: '9', type: 'B', y: '630' }
  ]);
  cs._compiler._srView.renderer.stage().render();
  // }, 0);
}
