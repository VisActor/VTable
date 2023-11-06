import type { IStage } from '@visactor/vrender';
import type { Chart } from '../chart';
import { Bounds, isValid } from '@visactor/vutils';
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
  const { axes, dataId, data, spec } = chart.attribute;
  const { chartInstance } = chart;
  const viewBox = chart.getViewBox();

  // avoid canvas size 0
  if (viewBox.x2 <= viewBox.x1) {
    viewBox.x2 = viewBox.x1 + 1;
  }
  if (viewBox.y2 <= viewBox.y1) {
    viewBox.y2 = viewBox.y1 + 1;
  }

  axes.forEach((axis: any, index: number) => {
    if (axis.type === 'linear') {
      const chartAxis = chartInstance._chart._components[index];
      chartAxis._domain = {
        min: axis.range?.min ?? 0,
        max: axis.range?.max ?? 0
      };
    } else if (axis.type === 'band') {
      const chartAxis = chartInstance._chart._components[index];
      chartAxis._spec.domain = axis.domain.slice(0);
      chartAxis.updateScaleDomain();
    }
  });

  chartInstance.updateViewBox(
    {
      x1: viewBox.x1 - (chart.getRootNode() as any).table.scrollLeft,
      x2: viewBox.x2 - (chart.getRootNode() as any).table.scrollLeft,
      y1: viewBox.y1 - (chart.getRootNode() as any).table.scrollTop,
      y2: viewBox.y2 - (chart.getRootNode() as any).table.scrollTop
    },
    false,
    false
  );
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
function cacheStageCanvas(stage: IStage, chart: Chart) {
  const { viewWidth, viewHeight } = stage;
  if (viewWidth < cacheCanvasSizeLimit && viewHeight < cacheCanvasSizeLimit) {
    chart.cacheCanvas = stage.toCanvas();
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

      const canvas = stage.toCanvas(false, bounds);
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
