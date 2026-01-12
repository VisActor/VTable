import type { GraphicType, IGroupGraphicAttribute, Stage, Group } from '@src/vrender';
import { genNumberType, Rect } from '@src/vrender';
import { Bounds, merge } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { PivotChart } from '../../PivotChart';
import { getCellHoverColor } from '../../state/hover/is-cell-hover';
import {
  setBrushingChartInstance,
  clearAllChartInstanceList,
  clearChartInstanceListByColumnDirection,
  clearChartInstanceListByRowDirection,
  generateChartInstanceListByColumnDirection,
  generateChartInstanceListByRowDirection,
  generateChartInstanceListByViewRange,
  getBrushingChartInstance,
  isDisabledShowTooltipToAllChartInstances
} from './active-cell-chart-list';
import type { PivotChartConstructorOptions } from '../..';
import { getAxisConfigInPivotChart } from '../../layout/chart-helper/get-axis-config';
import { cancellableThrottle } from '../../tools/util';

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
  detectPickChartItem?: boolean;
}

export const CHART_NUMBER_TYPE = genNumberType();

export class Chart extends Rect {
  type: GraphicType = 'chart' as any;
  declare attribute: IChartGraphicAttribute;
  chartInstance: any;
  activeChartInstance: any;
  activeChartInstanceLastViewBox: { x1: number; y1: number; x2: number; y2: number } = null;
  activeChartInstanceHoverOnMark: any = null;
  justShowMarkTooltip: boolean = undefined;
  justShowMarkTooltipTimer: number = Date.now();
  delayRunDimensionHoverTimer: any = undefined;
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
    if (this.activeChartInstance) {
      return;
    }
    const { col, row } = this.parent;
    const hoverColor = getCellHoverColor(this.parent, table);
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
    // this.activeChartInstance?.release();
    this.attribute.ClassType.globalConfig.uniqueTooltip = false;
    // console.log('---activate', Date.now(), this.parent.col, this.parent.row);
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
          // console.log(
          //   'beforeRender clip',
          //   clipBound.x1,
          //   clipBound.y1,
          //   clipBound.x2 - clipBound.x1,
          //   clipBound.y2 - clipBound.y1
          // );
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
        },
        renderHooks: {
          afterClearRect(drawParams: any) {
            const { context, layer, viewBox } = drawParams;
            if (layer.main && drawParams.clear && hoverColor) {
              context.beginPath();
              context.fillStyle = hoverColor;
              context.rect(viewBox.x1, viewBox.y1, viewBox.x2 - viewBox.x1, viewBox.y2 - viewBox.y1);
              context.fill();
            }
          }
        },
        componentShowContent:
          (table.options as PivotChartConstructorOptions).chartDimensionLinkage?.showTooltip &&
          this.attribute.spec.type !== 'scatter'
            ? {
                tooltip: {
                  dimension: false,
                  mark: true
                },
                crosshair: false
              }
            : undefined
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
        table.scenegraph.updateChartState(null, undefined);
      } else if (Chart.temp) {
        table.scenegraph.updateChartState(params?.datum, 'click');
      }
    });
    let brushChangeThrottle: any;
    if ((table.options as PivotChartConstructorOptions).chartDimensionLinkage?.listenBrushChange) {
      // 创建可取消的节流函数，用于 brushChange 事件
      brushChangeThrottle = cancellableThrottle(
        table.scenegraph.updateChartState.bind(table.scenegraph),
        (table.options as PivotChartConstructorOptions).chartDimensionLinkage?.brushChangeDelay ?? 100
      );

      this.activeChartInstance.on('brushChange', (params: any) => {
        brushChangeThrottle.throttled(params?.value?.inBrushData, 'brush');
      });
    }
    this.activeChartInstance.on('brushStart', (params: any) => {
      const brushingChartInstance = getBrushingChartInstance();
      if (brushingChartInstance !== this.activeChartInstance) {
        if (brushingChartInstance) {
          brushingChartInstance.getChart().getComponentsByKey('brush')[0].clearBrushStateAndMask();
        }
        setBrushingChartInstance(this.activeChartInstance, col, row);
      }
    });
    this.activeChartInstance.on('brushEnd', (params: any) => {
      // 取消 brushChange 中可能还在等待的节流执行
      brushChangeThrottle?.cancel();
      // 立即执行 updateChartState，确保 brushEnd 的调用能及时执行
      table.scenegraph.updateChartState(params?.value?.inBrushData, 'brush');
      Chart.temp = 0;
      setTimeout(() => {
        Chart.temp = 1;
      }, 0);
    });
    if ((table.options as PivotChartConstructorOptions).chartDimensionLinkage?.showTooltip) {
      if (this.attribute.spec.type === 'pie') {
        this.activeChartInstance.on('pointerover', { markName: 'pie' }, (params: any) => {
          const categoryField = this.attribute.spec.categoryField;
          const datum = { [categoryField]: params?.datum?.[categoryField] };

          generateChartInstanceListByViewRange(datum, table, false);
        });
        this.activeChartInstance.on('pointerout', { markName: 'pie' }, (params: any) => {
          const categoryField = this.attribute.spec.categoryField;
          const datum = { [categoryField]: params?.datum?.[categoryField] };
          generateChartInstanceListByViewRange(datum, table, true);
        });
      }
      this.activeChartInstance.on('dimensionHover', (params: any) => {
        if (isDisabledShowTooltipToAllChartInstances()) {
          return;
        }
        //和下面调用disableTooltip做对应，一个关闭，一个打开。如果这里不加这句话可能导致这个实例没有tooltip的情况（如这个实例没有机会被加入到chartInstanceListColumnByColumnDirection或chartInstanceListRowByRowDirection中）
        this.activeChartInstance.disableTooltip(false);

        const dimensionInfo = params?.dimensionInfo[0];
        const canvasXY = params?.event?.canvas;
        const viewport = params?.event?.viewport;
        if (viewport) {
          const xValue = dimensionInfo.data[0].series.positionToDataX(viewport.x);
          const yValue = dimensionInfo.data[0].series.positionToDataY(viewport.y);
          if (this.attribute.spec.type === 'scatter') {
            // console.log('receive scatter dimensionHover', params.action);
            generateChartInstanceListByColumnDirection(col, xValue, undefined, canvasXY, table, false, true);
            generateChartInstanceListByRowDirection(row, undefined, yValue, canvasXY, table, false, true);
            //#region 显示横纵向crosshair的labelHoverOnAxis 代码块
            const axisConfigLeft = getAxisConfigInPivotChart(
              table.rowHeaderLevelCount - 1,
              row,
              table.internalProps.layoutMap as any
            );
            // 显示左侧纵向crosshair的labelHoverOnAxis
            if (axisConfigLeft.labelHoverOnAxis) {
              table.scenegraph
                .getCell(table.rowHeaderLevelCount - 1, row)
                .firstChild.showLabelHoverOnAxis(canvasXY.y - table.getCellRelativeRect(col, row).top, yValue);
            }
            const axisConfigBottom = getAxisConfigInPivotChart(
              col,
              table.rowCount - table.bottomFrozenRowCount,
              table.internalProps.layoutMap as any
            );
            // 显示底部横向crosshair的labelHoverOnAxis
            if (axisConfigBottom.labelHoverOnAxis) {
              table.scenegraph
                .getCell(col, table.rowCount - table.bottomFrozenRowCount)
                .firstChild.showLabelHoverOnAxis(canvasXY.x - table.getCellRelativeRect(col, row).left, xValue);
            }
            //#endregion 显示横纵向crosshair的labelHoverOnAxis 代码块
          } else {
            //hover到mark和dimension的tooltip显示逻辑有区别，hover到mark的时候只显示背景及本身的tooltip，不显示其他联动区域图表的tooltip，而hover到dimension的时候需要显示其他联动区域图表的tooltip
            //#region 为了解决鼠标快速移动于mark和dimension之间造成tooltip闪动问题，纯粹的防抖效果不好的问题，需要增加一个延迟显示tooltip的机制（写了一堆看不懂的逻辑）
            let justShowMarkTooltip = true;
            const preMark = this.activeChartInstanceHoverOnMark;
            const prev_justShowMarkTooltip = this.justShowMarkTooltip;
            // console.log('----', params, params.datum, params.dimensionInfo[0].data[0]);
            if (params.mark && params.datum && !Array.isArray(params.datum)) {
              this.activeChartInstanceHoverOnMark = params.mark;
              justShowMarkTooltip = true;
            } else {
              this.activeChartInstanceHoverOnMark = null;
              justShowMarkTooltip = false;
            }
            this.justShowMarkTooltip = justShowMarkTooltip;
            let delayRunDimensionHover: boolean = false;
            if (prev_justShowMarkTooltip !== false && justShowMarkTooltip === false) {
              this.justShowMarkTooltipTimer = Date.now();
              delayRunDimensionHover = true;
            } else if (prev_justShowMarkTooltip === false && justShowMarkTooltip === false) {
              if (Date.now() - this.justShowMarkTooltipTimer < 100) {
                // 鼠标hover到空白区域时，不要立马显示tooltip，而是等100ms后显示 以防止tooltip在mark和dimension的tooltip之间来回闪烁
                delayRunDimensionHover = true;
              } else {
                delayRunDimensionHover = false;
              }
            } else if (prev_justShowMarkTooltip === false && justShowMarkTooltip === true) {
              delayRunDimensionHover = false;
              this.clearDelayRunDimensionHoverTimer();
            } else if (prev_justShowMarkTooltip === true && justShowMarkTooltip === true) {
              delayRunDimensionHover = false;
              this.clearDelayRunDimensionHoverTimer(); //及时清除之前的定时器
            }
            //#endregion

            if (
              params.action === 'enter' ||
              params.action === 'move' ||
              preMark !== this.activeChartInstanceHoverOnMark
            ) {
              // console.log('-----preMark', params.action, hideTooltip, preMark, this.activeChartInstanceHoverOnMark);
              const dimensionValue = dimensionInfo.value;

              const indicatorsAsCol = (table.options as PivotChartConstructorOptions).indicatorsAsCol;
              if (!delayRunDimensionHover) {
                if (indicatorsAsCol) {
                  generateChartInstanceListByRowDirection(
                    row,
                    dimensionValue,
                    null,
                    canvasXY,
                    table,
                    justShowMarkTooltip,
                    false
                  );
                } else {
                  generateChartInstanceListByColumnDirection(
                    col,
                    dimensionValue,
                    null,
                    canvasXY,
                    table,
                    justShowMarkTooltip,
                    false
                  );
                }
              } else {
                this.clearDelayRunDimensionHoverTimer();
                //还是需要有个延迟出现的时间，否则从mark切换到dimension时，tooltip不会出现了（ preMark !== this.activeChartInstanceHoverOnMark总是为false）
                this.delayRunDimensionHoverTimer = setTimeout(() => {
                  if (isDisabledShowTooltipToAllChartInstances()) {
                    // 如果当前是禁止显示tooltip的状态，这里的逻辑不会执行。否则这个延时会导致显示tooltip
                    return;
                  }
                  if (indicatorsAsCol) {
                    generateChartInstanceListByRowDirection(
                      row,
                      dimensionValue,
                      null,
                      canvasXY,
                      table,
                      justShowMarkTooltip,
                      false
                    );
                  } else {
                    generateChartInstanceListByColumnDirection(
                      col,
                      dimensionValue,
                      null,
                      canvasXY,
                      table,
                      justShowMarkTooltip,
                      false
                    );
                  }
                }, 100);
              }
              //#region 显示横纵向crosshair的labelHoverOnAxis 代码块
              if (indicatorsAsCol) {
                const series = dimensionInfo.data[0].series;
                const width =
                  this.attribute.spec.type === 'histogram' || series.type === 'line' || series.type === 'area'
                    ? 0
                    : series.getYAxisHelper().getBandwidth(0);
                let y = series.valueToPositionY(dimensionValue);

                const axisConfig = getAxisConfigInPivotChart(
                  table.rowHeaderLevelCount - 1,
                  row,
                  table.internalProps.layoutMap as any
                );
                let hoverOnLabelValue = yValue;
                if (this.attribute.spec.type === 'histogram') {
                  const { series, datum } = dimensionInfo.data[0];
                  if (datum.length > 0) {
                    const rangeStartValue = datum[0][series.fieldY[0]];
                    const rangeEndValue = datum[0][series.fieldY2];
                    hoverOnLabelValue = rangeStartValue + ' ~ ' + rangeEndValue;
                    y = (series.valueToPositionY(rangeStartValue) + series.valueToPositionY(rangeEndValue)) / 2;
                  }
                }
                // 显示左侧纵向crosshair的labelHoverOnAxis
                if (axisConfig.labelHoverOnAxis) {
                  table.scenegraph
                    .getCell(table.rowHeaderLevelCount - 1, row)
                    .firstChild.showLabelHoverOnAxis(
                      y + (series.type === 'line' || series.type === 'area' ? 0 : width / 2),
                      hoverOnLabelValue
                    );
                }
              } else {
                const series = dimensionInfo.data[0].series;
                const width =
                  this.attribute.spec.type === 'histogram' || series.type === 'line' || series.type === 'area'
                    ? 0
                    : series.getXAxisHelper().getBandwidth(0);
                let x = series.valueToPositionX(dimensionValue);
                const axisConfig = getAxisConfigInPivotChart(
                  col,
                  table.rowCount - table.bottomFrozenRowCount,
                  table.internalProps.layoutMap as any
                );
                let hoverOnLabelValue = dimensionValue;
                if (this.attribute.spec.type === 'histogram') {
                  const { series, datum } = dimensionInfo.data[0];
                  if (datum.length > 0) {
                    const rangeStartValue = datum[0][series.fieldX[0]];
                    const rangeEndValue = datum[0][series.fieldX2];
                    hoverOnLabelValue = rangeStartValue + ' ~ ' + rangeEndValue;
                    x = (series.valueToPositionX(rangeStartValue) + series.valueToPositionX(rangeEndValue)) / 2;
                  }
                }
                // 显示底部横向crosshair的labelHoverOnAxis
                if (axisConfig.labelHoverOnAxis) {
                  table.scenegraph
                    .getCell(col, table.rowCount - table.bottomFrozenRowCount)
                    .firstChild.showLabelHoverOnAxis(x + width / 2, hoverOnLabelValue);
                }
              }
              //#endregion 显示横纵向crosshair的labelHoverOnAxis 代码块
            }
          }
        }
      });
    }
    (table as PivotChart)._bindChartEvent?.(this.activeChartInstance);

    if (isDisabledShowTooltipToAllChartInstances()) {
      // 如果所有图表实例都禁用了dimensionHover，新建图表实例时，禁用当前图表实例的tooltip。避免在brush过程中显示tooltip
      this.activeChartInstance.disableTooltip(true);
    }
  }
  static temp: number = 1;

  clearDelayRunDimensionHoverTimer() {
    clearTimeout(this.delayRunDimensionHoverTimer);
    this.delayRunDimensionHoverTimer = undefined;
  }
  /**
   * 图表失去焦点
   * @param table
   */
  deactivate(
    table: BaseTableAPI,
    {
      forceRelease = false,
      releaseChartInstance = true,
      releaseColumnChartInstance = true,
      releaseRowChartInstance = true,
      releaseAllChartInstance = false
    }: {
      forceRelease?: boolean;
      releaseChartInstance?: boolean;
      releaseColumnChartInstance?: boolean;
      releaseRowChartInstance?: boolean;
      releaseAllChartInstance?: boolean;
    } = {}
  ) {
    // console.trace('------deactivate', releaseChartInstance, releaseColumnChartInstance, releaseRowChartInstance);
    this.activeChartInstanceHoverOnMark = null;
    this.justShowMarkTooltip = undefined;
    this.justShowMarkTooltipTimer = Date.now();
    this.clearDelayRunDimensionHoverTimer();
    if (releaseChartInstance) {
      // move active chart view box out of browser view
      // to avoid async render when chart is releasd

      if (forceRelease || !getBrushingChartInstance() || getBrushingChartInstance() !== this.activeChartInstance) {
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

      const { col, row } = this.parent;
      // 隐藏左侧纵向crosshair的labelHoverOnAxis
      table.internalProps.layoutMap.isAxisCell(table.rowHeaderLevelCount - 1, row) &&
        table.scenegraph.getCell(table.rowHeaderLevelCount - 1, row).firstChild?.hideLabelHoverOnAxis?.();
      // 隐藏底部横向crosshair的labelHoverOnAxis
      table.internalProps.layoutMap.isAxisCell(col, table.rowCount - table.bottomFrozenRowCount) &&
        table.scenegraph.getCell(col, table.rowCount - table.bottomFrozenRowCount).firstChild?.hideLabelHoverOnAxis?.();
    } else {
      const { col, row } = this.parent;
      if (releaseColumnChartInstance) {
        // 隐藏底部横向crosshair的labelHoverOnAxis
        table.internalProps.layoutMap.isAxisCell(col, table.rowCount - table.bottomFrozenRowCount) &&
          table.scenegraph
            .getCell(col, table.rowCount - table.bottomFrozenRowCount)
            .firstChild?.hideLabelHoverOnAxis?.();
      }
      if (releaseRowChartInstance) {
        // 隐藏左侧纵向crosshair的labelHoverOnAxis
        table.internalProps.layoutMap.isAxisCell(table.rowHeaderLevelCount - 1, row) &&
          table.scenegraph.getCell(table.rowHeaderLevelCount - 1, row).firstChild?.hideLabelHoverOnAxis?.();
      }
    }
    if (releaseAllChartInstance) {
      clearAllChartInstanceList(table, forceRelease);
    } else {
      if (releaseColumnChartInstance) {
        clearChartInstanceListByColumnDirection(
          this.parent.col,
          this.attribute.spec.type === 'scatter' ? this.parent.row : undefined,
          table,
          forceRelease
        );
      }
      if (releaseRowChartInstance) {
        clearChartInstanceListByRowDirection(
          this.parent.row,
          this.attribute.spec.type === 'scatter' ? this.parent.col : undefined,
          table,
          forceRelease
        );
      }
    }
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

    const viewBox = {
      x1: Math.ceil(x1 + padding[3] + table.scrollLeft + (table.options.viewBox?.x1 ?? 0)),
      x2: Math.ceil(x1 + cellGroup.attribute.width - padding[1] + table.scrollLeft + (table.options.viewBox?.x1 ?? 0)),
      y1: Math.ceil(y1 + padding[0] + table.scrollTop + (table.options.viewBox?.y1 ?? 0)),
      y2: Math.ceil(y1 + cellGroup.attribute.height - padding[2] + table.scrollTop + (table.options.viewBox?.y1 ?? 0))
    };

    if (this.activeChartInstance) {
      this.activeChartInstanceLastViewBox = viewBox;
    } else {
      this.activeChartInstanceLastViewBox = null;
    }
    return viewBox;
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
