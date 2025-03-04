import { container, VWindow, type IStage, type IWindow } from '@src/vrender';
import type { Chart } from '../chart';
import type { IAABBBounds } from '@visactor/vutils';
import { Bounds, isValid } from '@visactor/vutils';
import type { BaseTableAPI } from '../../../ts-types/base-table';
export const cancelRenderChartQueue = false;
export const chartRenderKeys: string[] = [];
export const chartRenderQueueList: Chart[] = [];
interface chartRenderQueueItem {
  chart: Chart;
}
//每次消费的图表数量
let batchRenderChartCount = 5;
let isHandlingChartQueue = false;
export function setBatchRenderChartCount(count: number) {
  if (isValid(count)) {
    batchRenderChartCount = count;
  }
}
export function IsHandlingChartQueue() {
  return isHandlingChartQueue;
}
export function renderChart(chart: Chart) {
  const { axes, dataId, data, spec, ClassType, canvas, mode, modeParams, dpr } = chart.attribute;
  let { chartInstance } = chart;
  if (!chartInstance) {
    chartInstance = new ClassType(spec, {
      renderCanvas: canvas,
      mode: mode === 'node' ? 'node' : 'desktop-browser',
      modeParams: modeParams,
      canvasControled: false,
      viewBox: { x1: 0, x2: 0, y1: 0, y2: 0 },
      dpr: dpr,
      interactive: false,
      animation: false,
      autoFit: false
    });
    chartInstance.renderSync();
    chart.chartInstance = chartInstance;
  }
  const viewBox = chart.getViewBox();

  // avoid canvas size 0
  if (viewBox.x2 <= viewBox.x1) {
    viewBox.x2 = viewBox.x1 + 1;
  }
  if (viewBox.y2 <= viewBox.y1) {
    viewBox.y2 = viewBox.y1 + 1;
  }

  // use vrender trasnform, viewbox starts from 0,0
  chartInstance.updateViewBox(
    // {
    //   x1: viewBox.x1 - (chart.getRootNode() as any).table.scrollLeft,
    //   x2: viewBox.x2 - (chart.getRootNode() as any).table.scrollLeft,
    //   y1: viewBox.y1 - (chart.getRootNode() as any).table.scrollTop,
    //   y2: viewBox.y2 - (chart.getRootNode() as any).table.scrollTop
    // },
    {
      x1: 0,
      x2: viewBox.x2 - viewBox.x1,
      y1: 0,
      y2: viewBox.y2 - viewBox.y1
    },
    false,
    false
  );

  const chartStage = chartInstance.getStage();
  const matrix = chart.globalTransMatrix.clone();
  const stageMatrix = chart.stage.window.getViewBoxTransform();
  matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
  chartStage.window.setViewBoxTransform &&
    chartStage.window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  // to be fixed: update state everytimes render, need be fix by vchart
  //  测试的没发现问题  这里应该能去掉吧 留着每次都要调用一次
  // const table = (chart.getRootNode() as any).table as BaseTableAPI;
  // (table.internalProps.layoutMap as any)?.updateDataStateToActiveChartInstance?.(chartInstance);

  const { table } = chart.getRootNode() as any;

  let updateSpec = false;
  if (table.options.specFormat) {
    const formatResult = table.options.specFormat(chart.attribute.spec, chartInstance, chart);
    if (formatResult.needFormatSpec && formatResult.spec) {
      const spec = formatResult.spec;
      chartInstance.updateSpecSync(spec);
      updateSpec = formatResult.updateSpec ?? true;
    }
  }

  if (!updateSpec) {
    axes?.forEach((axis: any, index: number) => {
      if (axis.type === 'band') {
        // const chartAxis = chartInstance._chart._components[index];
        // chartAxis._spec.domain = axis.domain.slice(0);
        // chartAxis.updateScaleDomain();
        chartInstance.updateModelSpec({ type: 'axes', index }, { domain: axis.domain.slice(0) }, true);
      } else {
        // const chartAxis = chartInstance._chart._components[index];
        // chartAxis._domain = {
        //   min: axis.range?.min ?? 0,
        //   max: axis.range?.max ?? 0
        // };
        chartInstance.updateModelSpecSync(
          { type: 'axes', index },
          {
            min: axis.range?.min ?? 0,
            max: axis.range?.max ?? 0,
            tick: {
              tickMode: axis.tick?.tickMode
            }
          },
          true
        );
      }
    });

    // to be fixed: update state everytimes render, need be fix by vchart
    (table.internalProps.layoutMap as any)?.updateDataStateToActiveChartInstance?.(chartInstance);

    if (typeof dataId === 'string') {
      chartInstance.updateDataSync(dataId, data ?? []);
    } else {
      const dataBatch = [];
      for (const dataIdStr in dataId) {
        const dataIdAndField = dataId[dataIdStr];
        const series = spec.series.find((item: any) => item?.data?.id === dataIdStr);
        dataBatch.push({
          id: dataIdStr,
          values: dataIdAndField
            ? data?.filter((item: any) => {
                return item.hasOwnProperty(dataIdAndField);
              }) ?? []
            : data ?? [],
          fields: series?.data?.fields
        });
        // 判断是否有updateFullDataSync 木有的话 还是循环调用updateDataSync
        if (!chartInstance.updateFullDataSync) {
          chartInstance.updateDataSync(
            dataIdStr,
            dataIdAndField
              ? data?.filter((item: any) => {
                  return item.hasOwnProperty(dataIdAndField);
                }) ?? []
              : data ?? []
          );
        }
      }
      chartInstance.updateFullDataSync?.(dataBatch);
    }
  }

  const sg = chartInstance.getStage();
  cacheStageCanvas(sg, chart);
  // chart.cacheCanvas = sg.toCanvas();

  // debugger;
  // chart.cacheCanvas[] = sg.toCanvas(fullImage, viewBox);
  // chart.cacheCanvas = sg.toCanvas(false, {
  //   x1: 0,
  //   y1: 0,
  //   x2: 500,
  //   y2: 300,
  //   width: () => 500,
  //   height: () => 300
  // });
  // 截图空白问题 因为开启了动画 首屏截图是无数据的TODO
}

export function startRenderChartQueue(table: any) {
  isHandlingChartQueue = true;

  // 检查是否还有未渲染的图表
  if (chartRenderQueueList.length > 0) {
    // 使用 requestAnimationFrame 或 setTimeout 来调度下一批图表的渲染
    // requestAnimationFrame(() => renderChartQueue(table));
    requestAnimationFrame(() => {
      // 从集合中获取要渲染的图表上下文
      const chartsToRender = chartRenderQueueList.splice(0, batchRenderChartCount);
      chartRenderKeys.splice(0, batchRenderChartCount);
      // 渲染图表
      chartsToRender.forEach(chart => {
        // 在正确的位置渲染图表
        renderChart(chart);
        chart.addUpdateBoundTag();
      });
      table.render();
      startRenderChartQueue(table);
    });
    // setTimeout(() => {
    //   // debugger;
    //   renderChartQueue(table);
    // }, 0);
  } else {
    isHandlingChartQueue = false;
  }
}

const cacheCanvasSizeLimit = 2000;
export function cacheStageCanvas(stage: IStage, chart: Chart) {
  const { viewWidth, viewHeight } = stage;
  if (viewWidth < cacheCanvasSizeLimit && viewHeight < cacheCanvasSizeLimit) {
    chart.cacheCanvas = toCanvas(stage);
    if (!chart.isShareChartSpec) {
      // 不能整列共享chart的情况 生成完图片后即将chartInstance清除
      chart.chartInstance?.release();
      chart.chartInstance = null;
      chart.setAttribute('chartInstance', null);
    }
    return;
  }

  const rows = Math.ceil(viewHeight / cacheCanvasSizeLimit);
  const columns = Math.ceil(viewWidth / cacheCanvasSizeLimit);

  const cacheCanvas = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const startX = col * cacheCanvasSizeLimit;
      const startY = row * cacheCanvasSizeLimit;
      const endX = startX + cacheCanvasSizeLimit > viewWidth ? viewWidth : startX + cacheCanvasSizeLimit;
      const endY = startY + cacheCanvasSizeLimit > viewHeight ? viewHeight : startY + cacheCanvasSizeLimit;
      const width = endX - startX;
      const height = endY - startY;
      const bounds = new Bounds();
      bounds.setValue(startX, startY, endX, endY);

      const canvas = toCanvas(stage, false, bounds);
      cacheCanvas.push({
        canvas,
        x: startX,
        y: startY,
        width,
        height
      });
    }
  }

  chart.cacheCanvas = cacheCanvas;
}

function toCanvas(stage: IStage, fullImage: boolean = true, viewBox?: IAABBBounds): HTMLCanvasElement | null {
  if ((stage as any).releaseStatus === 'released') {
    return null;
  }
  const matrix = stage.window.getViewBoxTransform();
  const window = renderToNewWindow(stage, fullImage, viewBox);
  window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
  (stage as any).renderTo(window);
  const c = window.getNativeHandler();
  if (c.nativeCanvas) {
    return c.nativeCanvas;
  }
  return null;
}

function renderToNewWindow(stage: IStage, fullImage: boolean = true, viewBox?: IAABBBounds): IWindow {
  const matrix = stage.window.getViewBoxTransform();
  const window = container.get<IWindow>(VWindow);
  const x1 = viewBox ? -viewBox.x1 : 0;
  const y1 = viewBox ? -viewBox.y1 : 0;
  const x2 = viewBox ? viewBox.x2 : stage.viewWidth;
  const y2 = viewBox ? viewBox.y2 : stage.viewHeight;
  const width = viewBox ? viewBox.width() : stage.viewWidth;
  const height = viewBox ? viewBox.height() : stage.viewHeight;
  if (fullImage) {
    window.create({
      viewBox: { x1, y1, x2, y2 },
      width: width * matrix.a,
      height: height * matrix.d,
      dpr: stage.window.dpr,
      canvasControled: true,
      offscreen: true,
      title: ''
    });
  } else {
    window.create({
      viewBox: { x1, y1, x2, y2 },
      width: width * matrix.a,
      height: height * matrix.d,
      dpr: stage.window.dpr,
      canvasControled: true,
      offscreen: true,
      title: ''
    });
  }

  (stage as any).renderTo(window);
  return window;
}
