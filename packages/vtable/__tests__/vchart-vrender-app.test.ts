// @ts-nocheck

import VChart from '@visactor/vchart';
import * as stageApp from '@visactor/vchart/cjs/compile/stage-app.js';

describe('VChart VRender app integration', () => {
  test('uses an app-scoped VRender stage helper', () => {
    const stage = { release: jest.fn() };
    const app = {
      createStage: jest.fn(() => stage)
    };

    expect(typeof stageApp.resolveVRenderApp).toBe('function');
    expect(typeof stageApp.createStageFromApp).toBe('function');
    expect(stageApp.resolveVRenderApp(app).app).toBe(app);
    expect(stageApp.createStageFromApp(app, { width: 100, height: 80 })).toBe(stage);
    expect(app.createStage).toHaveBeenCalledWith({ width: 100, height: 80 });
  });

  test('renders chart marks through the resolved VRender app', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 120;

    const chart = new VChart(
      {
        type: 'line',
        width: 200,
        height: 120,
        padding: 10,
        background: '#000',
        data: {
          id: 'data',
          values: [
            { x: 'A', y: 20 },
            { x: 'B', y: 90 },
            { x: 'C', y: 45 }
          ]
        },
        xField: 'x',
        yField: 'y',
        axes: [
          { orient: 'bottom', visible: false },
          { orient: 'left', visible: false }
        ],
        line: {
          style: {
            stroke: '#207BFE',
            lineWidth: 3
          }
        },
        point: {
          style: {
            fill: '#207BFE',
            stroke: '#207BFE',
            size: 8
          }
        }
      },
      {
        renderCanvas: canvas,
        mode: 'desktop-browser',
        canvasControled: false,
        viewBox: { x1: 0, y1: 0, x2: 200, y2: 120 },
        dpr: 1,
        interactive: false,
        animation: false,
        autoFit: false
      }
    );

    chart.renderSync();

    const context = canvas.getContext('2d');
    expect(context).toBeTruthy();

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let bluePixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const red = pixels[i];
      const green = pixels[i + 1];
      const blue = pixels[i + 2];
      const alpha = pixels[i + 3];
      if (alpha > 0 && red < 80 && green > 80 && blue > 160) {
        bluePixels += 1;
      }
    }

    chart.release();
    expect(bluePixels).toBeGreaterThan(20);
  });
});
