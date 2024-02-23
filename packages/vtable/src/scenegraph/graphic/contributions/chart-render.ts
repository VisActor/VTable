import type {
  IGraphicAttribute,
  IContext2d,
  IDrawContext,
  IGraphicRender,
  IGraphicRenderDrawParams,
  IMarkAttribute,
  IRenderService,
  IThemeAttribute
} from '@src/vrender';
import {
  ContributionProvider,
  getTheme,
  IGroupRenderContribution,
  createImage,
  inject,
  injectable,
  named
} from '@src/vrender';
import type { Chart } from '../chart';
import { CHART_NUMBER_TYPE } from '../chart';
import {
  IsHandlingChartQueue,
  chartRenderKeys,
  chartRenderQueueList,
  renderChart,
  startRenderChartQueue
} from './chart-render-helper';
import { isArray } from '@visactor/vutils';

export const ChartRender = Symbol.for('ChartRender');
export const ChartRenderContribution = Symbol.for('ChartRenderContribution');

@injectable()
export class DefaultCanvasChartRender implements IGraphicRender {
  type: 'chart';
  numberType: number = CHART_NUMBER_TYPE;

  drawShape(
    chart: Chart,
    context: IContext2d,
    x: number,
    y: number,
    drawContext: IDrawContext,
    params?: IGraphicRenderDrawParams,
    fillCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean,
    strokeCb?: (
      ctx: IContext2d,
      markAttribute: Partial<IMarkAttribute & IGraphicAttribute>,
      themeAttribute: IThemeAttribute
    ) => boolean
  ) {
    const groupAttribute = getTheme(chart, params?.theme).group;

    const { dataId, data, spec } = chart.attribute;
    const viewBox = chart.getViewBox();
    const { width = groupAttribute.width, height = groupAttribute.height } = chart.attribute;

    const { active, cacheCanvas, activeChartInstance } = chart;
    // console.log('render chart', chart.parent.col, chart.parent.row, viewBox, cacheCanvas);
    if (!active && cacheCanvas) {
      if (isArray(cacheCanvas)) {
        cacheCanvas.forEach(singleCacheCanvas => {
          const { x, y, width, height, canvas } = singleCacheCanvas;
          context.drawImage(canvas, x, y, width, height);
        });
      } else {
        context.drawImage(cacheCanvas, x, y, width, height);
      }
    } else if (activeChartInstance) {
      if (typeof dataId === 'string') {
        activeChartInstance.updateDataSync(dataId, data ?? []);
      } else {
        const dataBatch = [];
        // 如果是组合图有series系列 需要组个设置数据 这里的data包括的单元格完整数据 需要根据key过滤
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
          if (!activeChartInstance.updateFullDataSync) {
            activeChartInstance.updateDataSync(
              dataIdStr,
              dataIdAndField
                ? data?.filter((item: any) => {
                    return item.hasOwnProperty(dataIdAndField);
                  }) ?? []
                : data ?? []
            );
          }
        }
        activeChartInstance.updateFullDataSync?.(dataBatch);
      }
    } else {
      if ((chart.getRootNode() as any).table.internalProps.renderChartAsync) {
        if (chartRenderKeys.indexOf(`${chart.parent.col}+${chart.parent.row}`) === -1) {
          chartRenderKeys.push(`${chart.parent.col}+${chart.parent.row}`);
          chartRenderQueueList.push(chart);
        }
        //判断是否已经开启渲染队列
        if (!IsHandlingChartQueue()) {
          startRenderChartQueue((chart.getRootNode() as any).table);
        }
      } else {
        renderChart(chart);
      }
    }
  }

  draw(chart: Chart, renderService: IRenderService, drawContext: IDrawContext, params?: IGraphicRenderDrawParams) {
    const { context } = drawContext;
    if (!context) {
      return;
    }
    // debugger;
    const { clip } = chart.attribute;
    if (clip) {
      context.save();
    } else {
      context.highPerformanceSave();
    }
    // group直接transform
    context.transformFromMatrix(chart.transMatrix, true);

    context.beginPath();
    // 如果跳过绘制，那就不绘制
    if (params.skipDraw) {
      this.drawShape(
        chart,
        context,
        0,
        0,
        drawContext,
        params,
        () => false,
        () => false
      );
    } else {
      this.drawShape(chart, context, 0, 0, drawContext);
    }

    if (clip) {
      context.restore();
    } else {
      context.highPerformanceRestore();
    }
  }
}
