import type { GraphicType, IGroupGraphicAttribute } from '@visactor/vrender';
import { genNumberType, Group } from '@visactor/vrender';
import { Bounds, cloneDeep } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { PivotChart } from '../../PivotChart';
import { clearChartCacheImage, updateChartSize } from '../refresh-node/update-chart';
import type { PivoLayoutMap } from '../../layout/pivot-layout';

interface IChartGraphicAttribute extends IGroupGraphicAttribute {
  canvas: HTMLCanvasElement;
  dataId: string;
  data: any;
  spec: any;
  ClassType: any;
  chartInstance: any;
  cellPadding: number[];
  viewBox: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
}

export const CHART_NUMBER_TYPE = genNumberType();

export class Chart extends Group {
  type: GraphicType = 'chart' as any;
  declare attribute: IChartGraphicAttribute;
  chartInstance: any;
  activeChartInstance: any;
  active: boolean;
  cacheCanvas: HTMLCanvasElement; // HTMLCanvasElement

  constructor(params: IChartGraphicAttribute) {
    super(params);
    this.numberType = CHART_NUMBER_TYPE;

    // 创建chart
    if (!params.chartInstance) {
      const ctx = params.canvas.getContext('2d');
      params.chartInstance = this.chartInstance = new params.ClassType(params.spec, {
        renderCanvas: params.canvas,
        mode: 'desktop-browser',
        canvasControled: false,
        viewBox: params.viewBox,
        interactive: false,
        animation: false
      });
      this.chartInstance.renderSync();
    } else {
      this.chartInstance = params.chartInstance;
    }

    // this.chart.load().then((cache) => {
    //   this.cacheCanvas = cache;
    //   this.deactivate();
    // });
  }
  /**
   * 激活该图表元素
   * @param table
   */
  activate(table: BaseTableAPI) {
    this.active = true;
    // this.chart = new TestChart(this.attribute.spec);
    // const ctx = this.attribute.canvas.getContext('2d');
    const { x1, y1, x2, y2 } = this.attribute.viewBox;
    //获取渲染区域的bound 考虑被表头遮住部分的情况
    const tableBound = table.scenegraph.tableGroup.globalAABBBounds;
    const bodyBound = new Bounds();
    bodyBound.x1 = tableBound.x1 + table.getFrozenColsWidth();
    bodyBound.x2 = tableBound.x2;
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2;
    const clipBound = bodyBound.intersect({
      x1: x1 - table.scrollLeft,
      x2: x2 - table.scrollLeft,
      y1: y1 - table.scrollTop,
      y2: y2 - table.scrollTop
    });
    this.activeChartInstance = new this.attribute.ClassType(this.attribute.spec, {
      renderCanvas: this.attribute.canvas,
      mode: 'desktop-browser',
      canvasControled: false,
      viewBox: {
        x1: x1 - table.scrollLeft,
        x2: x2 - table.scrollLeft,
        y1: y1 - table.scrollTop,
        y2: y2 - table.scrollTop
      },
      animation: false,
      interactive: true,
      beforeRender: (stage: any) => {
        const ctx = stage.window.getContext();
        ctx.inuse = true;
        ctx.clearMatrix();
        ctx.setTransformForCurrent(true);
        ctx.beginPath();
        ctx.rect(clipBound.x1, clipBound.y1, clipBound.x2 - clipBound.x1, clipBound.y2 - clipBound.y1);
        ctx.clip();
      },
      afterRender(stage: any) {
        const ctx = stage.window.getContext();
        ctx.inuse = false;
      }
    });
    // this.activeChartInstance.updateData('data', this.attribute.data);
    this.activeChartInstance.renderSync();

    (table.internalProps.layoutMap as any)?.updateDataStateToActiveChartInstance?.(this.activeChartInstance);
    this.activeChartInstance.on('click', (params: any) => {
      console.log('click captured', params);
      if (Chart.temp) {
        table.scenegraph.updateChartState(params?.datum);
      }
    });
    this.activeChartInstance.on('brushEnd', (params: any) => {
      console.log('brushEnd captured', params);
      table.scenegraph.updateChartState(params?.value?.inBrushData);
      Chart.temp = 0;
      setTimeout(() => {
        Chart.temp = 1;
      }, 0);
    });
    (table as PivotChart)._bindChartEvent?.(this.activeChartInstance);
    console.log('active');
  }
  static temp: number = 1;
  /**
   * 图表失去焦点
   * @param table
   */
  deactivate() {
    this.active = false;
    this.activeChartInstance.release();
    this.activeChartInstance = null;
    console.log('deactivate');
  }
  /** 更新图表对应数据 */
  updateData(data: any) {
    this.attribute.data = data;
  }
}
