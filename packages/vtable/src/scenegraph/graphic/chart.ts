import type { GraphicType, IGroupGraphicAttribute, Stage } from '@src/vrender';
import { genNumberType, Group } from '@src/vrender';
import { Bounds, merge } from '@visactor/vutils';
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
  tableChartOption: any;
  col?: number;
  row?: number;
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
      const chartInstance = (this.chartInstance = new params.ClassType(
        params.spec,
        merge({}, this.attribute.tableChartOption, {
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
        })
      ));
      chartInstance.renderSync();
      chartInstance.getStage().enableDirtyBounds();
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
    this.activeChartInstance?.release();
    this.activeChartInstance = new this.attribute.ClassType(
      this.attribute.spec,
      merge({}, this.attribute.tableChartOption, {
        // disableDirtyBounds: true,
        renderCanvas: this.attribute.canvas,
        mode: 'desktop-browser',
        canvasControled: false,
        // viewBox: {
        //   x1: x1 - table.scrollLeft,
        //   x2: x2 - table.scrollLeft,
        //   y1: y1 - table.scrollTop,
        //   y2: y2 - table.scrollTop
        // },
        viewBox: {
          x1: 0,
          x2: x2 - x1,
          y1: 0,
          y2: y2 - y1
        },
        dpr: table.internalProps.pixelRatio,
        animation: false,
        interactive: true,
        autoFit: false, //控制当容器变化大小时vchart实例不应响应事件进行内部处理
        beforeRender: (chartStage: Stage) => {
          const stage = this.stage;
          const ctx = chartStage.window.getContext();
          const stageMatrix = stage.window.getViewBoxTransform();
          const viewBox = stage.window.getViewBox();
          ctx.inuse = true;
          // ctx.save();
          // console.log(ctx.getImageData(0, 0, 100, 100));
          ctx.clearMatrix();
          ctx.setTransform(
            stageMatrix.a,
            stageMatrix.b,
            stageMatrix.c,
            stageMatrix.d,
            stageMatrix.e,
            stageMatrix.f,
            true
          );
          ctx.translate(viewBox.x1, viewBox.y1);
          ctx.setTransformForCurrent(true); // 替代原有的chart viewBox
          ctx.beginPath();
          ctx.rect(clipBound.x1, clipBound.y1, clipBound.x2 - clipBound.x1, clipBound.y2 - clipBound.y1);
          ctx.clip();
          ctx.clearMatrix();

          if (table.options.canvas && !(chartStage as any).needRender) {
            // 在使用viewbox局部渲染时，activate单独渲染chart stage，可能导致外部stage场景层级错乱
            // 此时触发整个表格的重绘，外部stage场景可以通过table的beforeRender配置触发更上一级的重绘
            chartStage.pauseRender();
            table.scenegraph.stage.dirtyBounds.union(this.globalAABBBounds);
            table.scenegraph.updateNextFrame();
          }
        },
        afterRender(stage: any) {
          const ctx = stage.window.getContext();
          ctx.inuse = false;

          stage.needRender = false;
          chartStage.resumeRender();
        }
      })
    );
    const chartStage = this.activeChartInstance.getStage();
    // chartStage.needRender = true;
    // chartStage.background = 'red';
    const matrix = this.globalTransMatrix.clone();
    const stageMatrix = this.stage.window.getViewBoxTransform();
    matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
    chartStage.window.setViewBoxTransform &&
      chartStage.window.setViewBoxTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);

    // this.activeChartInstance.updateData('data', this.attribute.data);
    this.activeChartInstance.renderSync();

    (table.internalProps.layoutMap as any)?.updateDataStateToActiveChartInstance?.(this.activeChartInstance);
    this.activeChartInstance.on('click', (params: any) => {
      if (this.attribute.spec.select?.enable === false) {
        table.scenegraph.updateChartState(null);
      } else if (Chart.temp) {
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
    // move active chart view box out of browser view
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

    const { x1, y1, x2, y2 } = cellGroup.globalAABBBounds;

    return {
      x1: Math.ceil(x1 + padding[3] + table.scrollLeft + (table.options.viewBox?.x1 ?? 0)),
      x2: Math.ceil(x1 + cellGroup.attribute.width - padding[1] + table.scrollLeft + (table.options.viewBox?.x1 ?? 0)),
      y1: Math.ceil(y1 + padding[0] + table.scrollTop + (table.options.viewBox?.y1 ?? 0)),
      y2: Math.ceil(y1 + cellGroup.attribute.height - padding[2] + table.scrollTop + (table.options.viewBox?.y1 ?? 0))
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
  if (
    layoutMap.isLeftBottomCorner(col, row) ||
    layoutMap.isRightTopCorner(col, row) ||
    layoutMap.isLeftTopCorner(col, row) ||
    layoutMap.isRightBottomCorner(col, row)
  ) {
    // frozen cornor
  } else if (layoutMap.isFrozenColumn(col, row)) {
    // left frozen
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2 - table.getBottomFrozenRowsHeight();
  } else if (layoutMap.isFrozenRow(col, row)) {
    // top frozen
    bodyBound.x1 = tableBound.x1 + table.getFrozenColsWidth();
    bodyBound.x2 = tableBound.x2 - table.getRightFrozenColsWidth();
  } else if (layoutMap.isRightFrozenColumn(col, row)) {
    // right frozen
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2 - table.getBottomFrozenRowsHeight();
  } else if (layoutMap.isBottomFrozenRow(col, row)) {
    // bottom frozen
    bodyBound.x1 = tableBound.x1 + table.getFrozenColsWidth();
    bodyBound.x2 = tableBound.x2 - table.getRightFrozenColsWidth();
  } else if (!layoutMap.isFrozenColumn(col, row) && !layoutMap.isRightFrozenColumn(col, row)) {
    // no frozen body
    bodyBound.x1 = tableBound.x1 + table.getFrozenColsWidth();
    bodyBound.x2 = tableBound.x2 - table.getRightFrozenColsWidth();
    bodyBound.y1 = tableBound.y1 + table.getFrozenRowsHeight();
    bodyBound.y2 = tableBound.y2 - table.getBottomFrozenRowsHeight();
  }

  bodyBound.x1 = bodyBound.x1 + (table.options.viewBox?.x1 ?? 0);
  bodyBound.x2 = bodyBound.x2 + (table.options.viewBox?.x1 ?? 0);
  bodyBound.y1 = bodyBound.y1 + (table.options.viewBox?.y1 ?? 0);
  bodyBound.y2 = bodyBound.y2 + (table.options.viewBox?.y1 ?? 0);

  return bodyBound;
}
