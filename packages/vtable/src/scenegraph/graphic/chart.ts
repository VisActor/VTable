import type { GraphicType, IGroupGraphicAttribute } from '@src/vrender';
import { genNumberType, Group } from '@src/vrender';
import { Bounds } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { PivotChart } from '../../PivotChart';

interface IChartGraphicAttribute extends IGroupGraphicAttribute {
  canvas: HTMLCanvasElement;
  dataId: string | Record<string, string>; //如果是spec外层的dataId,则是string,否则通过series获取到的是Record<string, string> <dataId, series-chart的指标key用于过滤数据>
  data: any;
  spec: any;
  axes: any;
  ClassType: any;
  chartInstance: any;
  cellPadding: number[];
  mode: string;
  modeParams: any;
  dpr: number;
  // viewBox: {
  //   x1: number;
  //   y1: number;
  //   x2: number;
  //   y2: number;
  // };
}

export const CHART_NUMBER_TYPE = genNumberType();

export class Chart extends Group {
  type: GraphicType = 'chart' as any;
  declare attribute: IChartGraphicAttribute;
  chartInstance: any;
  activeChartInstance: any;
  active: boolean;
  cacheCanvas: HTMLCanvasElement | { x: number; y: number; width: number; height: number; canvas: HTMLCanvasElement }[]; // HTMLCanvasElement
  isShareChartSpec: boolean; //针对chartSpec用户配置成函数形式的话 就不需要存储chartInstance了 会太占内存，使用这个变量 当渲染出缓存图表会就删除chartInstance实例
  constructor(isShareChartSpec: boolean, params: IChartGraphicAttribute) {
    super(params);
    this.numberType = CHART_NUMBER_TYPE;
    this.isShareChartSpec = isShareChartSpec;
    // 创建chart
    if (!params.chartInstance) {
      const chartInstance = new params.ClassType(params.spec, {
        renderCanvas: params.canvas,
        mode: this.attribute.mode === 'node' ? 'node' : 'desktop-browser',
        modeParams: this.attribute.modeParams,
        canvasControled: false,
        viewBox: { x1: 0, x2: 0, y1: 0, y2: 0 },
        dpr: params.dpr,
        // viewBox: params.viewBox,
        // viewBox: this.getViewBox(),
        // viewBox: {
        //   x1: params.cellPadding[3],
        //   x2: params.width - params.cellPadding[1],
        //   y1: params.cellPadding[0],
        //   y2: params.height - params.cellPadding[2]
        // },
        interactive: false,
        animation: false,
        autoFit: false
      });
      chartInstance.renderSync();
      params.chartInstance = this.chartInstance = chartInstance;
    } else {
      this.chartInstance = params.chartInstance;
    }

    // this.chart.load().then((cache) => {
    //   this.cacheCanvas = cache;
    //   this.deactivate();
    // });
  }

  // onBeforeAttributeUpdate() {
  //   if (arguments[2] === y) {
  //     debugger;
  //   }
  // }
  /**
   * 激活该图表元素
   * @param table
   */
  activate(table: BaseTableAPI) {
    this.active = true;
    const { col, row } = this.parent;
    // this.chart = new TestChart(this.attribute.spec);
    // const ctx = this.attribute.canvas.getContext('2d');
    // const { x1, y1, x2, y2 } = this.attribute.viewBox;
    const { x1, y1, x2, y2 } = this.getViewBox();
    //获取渲染区域的bound 考虑被表头遮住部分的情况
    const tableBound = getTableBounds(col, row, table);
    const clipBound = tableBound.intersect({
      x1: x1 - table.scrollLeft,
      x2: x2 - table.scrollLeft,
      y1: y1 - table.scrollTop,
      y2: y2 - table.scrollTop
    });
    this.activeChartInstance = new this.attribute.ClassType(this.attribute.spec, {
      // disableDirtyBounds: true,
      renderCanvas: this.attribute.canvas,
      mode: 'desktop-browser',
      canvasControled: false,
      viewBox: {
        x1: x1 - table.scrollLeft,
        x2: x2 - table.scrollLeft,
        y1: y1 - table.scrollTop,
        y2: y2 - table.scrollTop
      },
      dpr: table.internalProps.pixelRatio,
      animation: false,
      interactive: true,
      autoFit: false, //控制当容器变化大小时vchart实例不应响应事件进行内部处理
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
      if (Chart.temp) {
        table.scenegraph.updateChartState(params?.datum);
      }
    });
    this.activeChartInstance.on('brushEnd', (params: any) => {
      table.scenegraph.updateChartState(params?.value?.inBrushData);
      Chart.temp = 0;
      setTimeout(() => {
        Chart.temp = 1;
      }, 0);
    });
    (table as PivotChart)._bindChartEvent?.(this.activeChartInstance);
  }
  static temp: number = 1;
  /**
   * 图表失去焦点
   * @param table
   */
  deactivate() {
    this.active = false;
    // move active chart view box out of broswer view
    // to avoid async render when chart is releasd
    this.activeChartInstance?.updateViewBox(
      {
        x1: -1000,
        x2: -800,
        y1: -1000,
        y2: -800
      },
      false,
      false
    );
    this.activeChartInstance?.release();
    this.activeChartInstance = null;
  }
  /** 更新图表对应数据 */
  updateData(data: any) {
    this.attribute.data = data;
  }

  getViewBox(): {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } {
    const cellGroup = this.parent as Group;
    const padding = this.attribute.cellPadding;
    const table = (this.stage as any).table as BaseTableAPI;
    return {
      x1: Math.ceil(cellGroup.globalAABBBounds.x1 + padding[3] + table.scrollLeft),
      x2: Math.ceil(cellGroup.globalAABBBounds.x1 + cellGroup.attribute.width - padding[1] + table.scrollLeft),
      y1: Math.ceil(cellGroup.globalAABBBounds.y1 + padding[0] + table.scrollTop),
      y2: Math.ceil(cellGroup.globalAABBBounds.y1 + cellGroup.attribute.height - padding[2] + table.scrollTop)
    };
  }
}

function getTableBounds(col: number, row: number, table: BaseTableAPI) {
  const { layoutMap } = table.internalProps;
  const bodyBound = new Bounds();
  const tableBound = table.scenegraph.tableGroup.globalAABBBounds;
  bodyBound.x1 = tableBound.x1;
  bodyBound.x2 = tableBound.x2;
  bodyBound.y1 = tableBound.y1;
  bodyBound.y2 = tableBound.y2;

  if (!layoutMap.isFrozenColumn(col, row) && !layoutMap.isRightFrozenColumn(col, row)) {
    // no frozen body
    bodyBound.x1 = tableBound.x1 + table.getFrozenColsWidth();
    bodyBound.x2 = tableBound.x2 - table.getRightFrozenColsWidth();
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2 - table.getBottomFrozenRowsHeight();
  } else if (layoutMap.isLeftBottomCorner(col, row) || layoutMap.isRightTopCorner(col, row)) {
    // frozen cornor
  } else if (layoutMap.isFrozenColumn(col, row)) {
    // left frozen
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2 - table.getBottomFrozenRowsHeight();
  } else if (layoutMap.isRightFrozenColumn(col, row)) {
    // right frozen
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2 - table.getBottomFrozenRowsHeight();
  } else if (layoutMap.isBottomFrozenRow(col, row)) {
    // bottom frozen
    bodyBound.x1 = tableBound.x1 + table.getFrozenColsWidth();
    bodyBound.x2 = tableBound.x2 - table.getRightFrozenColsWidth();
  }

  return bodyBound;
}
