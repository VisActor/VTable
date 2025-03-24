import { injectable } from '@src/vrender';
import type { IGraphicPicker, IPickParams } from '@src/vrender';
import type { Chart as VChartGraphic } from '../chart';
import { CHART_NUMBER_TYPE } from '../chart';

@injectable()
export class VChartPicker implements IGraphicPicker {
  type = 'chart';
  numberType: number = CHART_NUMBER_TYPE;

  contains(chart: any, point: any, params?: IPickParams): boolean | any {
    const vChart = (chart as VChartGraphic).activeChartInstance;
    if (!vChart) {
      return false;
    }
    // 将当前的point转化到global
    const matrix = chart.parent.globalTransMatrix.clone();
    const stageMatrix = chart.stage.window.getViewBoxTransform();
    matrix.multiply(stageMatrix.a, stageMatrix.b, stageMatrix.c, stageMatrix.d, stageMatrix.e, stageMatrix.f);
    const toGlobalMatrix = matrix.getInverse();
    const nextP = { x: 0, y: 0 };
    toGlobalMatrix.transformPoint(point, nextP);

    // 得到 vchart stage
    const vchartStage = vChart.getStage();
    vchartStage.dirtyBounds?.clear();
    const toChartMatrix = vchartStage.window.getViewBoxTransform();
    toChartMatrix.transformPoint(nextP, nextP);
    const pick = vchartStage.pick(nextP.x, nextP.y);
    // @ts-ignore
    if (pick.graphic === null && pick.group.name === 'root') {
      return false;
    }
    return pick;
  }
}
