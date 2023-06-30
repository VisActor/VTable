import type {
  IGraphicAttribute,
  IContext2d,
  IDrawContext,
  IGraphicRender,
  IGraphicRenderDrawParams,
  IMarkAttribute,
  IRenderService,
  IThemeAttribute
} from '@visactor/vrender';
import { ContributionProvider, getTheme, IGroupRenderContribution, createImage } from '@visactor/vrender';
import { inject, injectable, named } from 'inversify';
import type { Chart } from '../chart';
import { CHART_NUMBER_TYPE } from '../chart';

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

    const { dataId, data, viewBox } = chart.attribute;
    const { width = groupAttribute.width, height = groupAttribute.height } = chart.attribute;

    const { chartInstance, active, cacheCanvas, activeChartInstance } = chart;
    // console.log('render chart', chart.parent.col, chart.parent.row, viewBox, cacheCanvas);
    if (!active && cacheCanvas) {
      context.drawImage(cacheCanvas, x, y, width, height);
    } else if (activeChartInstance) {
      activeChartInstance.updateDataSync('data', data);
    } else {
      // console.log('viewBox', viewBox);
      chartInstance.updateViewBox({
        x1: viewBox.x1 - (chart.getRootNode() as any).table.scrollLeft,
        x2: viewBox.x2 - (chart.getRootNode() as any).table.scrollLeft,
        y1: viewBox.y1 - (chart.getRootNode() as any).table.scrollTop,
        y2: viewBox.y2 - (chart.getRootNode() as any).table.scrollTop
      });
      chartInstance.updateDataSync(dataId, data);
      const sg = chartInstance.getStage();
      chart.cacheCanvas = sg.toCanvas(); // 截图空白问题 因为开启了动画 首屏截图是无数据的TODO
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

    // 绘制子元素的时候要添加scroll
    const chartAttribute = getTheme(chart, params?.theme).group;
    const { scrollX = chartAttribute.scrollX, scrollY = chartAttribute.scrollY } = chart.attribute;
    if (scrollX || scrollY) {
      context.translate(scrollX, scrollY);
    }
    let p: any;
    if (params && params.drawingCb) {
      p = params.drawingCb();
    }
    if (p && p.then) {
      p.then(() => {
        if (clip) {
          context.restore();
        } else {
          context.highPerformanceRestore();
        }
      });
    } else if (clip) {
      context.restore();
    } else {
      context.highPerformanceRestore();
    }
  }
}
