import type { IGraphicPicker, IPickParams } from '@src/vrender';
import type { Chart as VChartGraphic } from '../chart';
import { CHART_NUMBER_TYPE } from '../chart';

export class VChartPicker implements IGraphicPicker {
  type = 'chart';
  numberType: number = CHART_NUMBER_TYPE;

  contains(chart: any, point: any, params?: IPickParams): boolean | any {
    if (chart.attribute.detectPickChartItem) {
      const vChart = (chart as VChartGraphic).activeChartInstance;
      if (!vChart) {
        return false;
      }
      // 得到 vchart stage
      const vchartStage = vChart.getStage();
      vchartStage.dirtyBounds?.clear();
      // 因为vchart 在 vtable 内始坐标变换始终等于在group中的坐标变换，所以这里不需要再做坐标转换
      const pick = vchartStage.pick(point.x, point.y);
      // @ts-ignore
      if (pick.graphic === null && pick.group.name === 'root') {
        return false;
      }
      return pick;
    }
    if (!chart.AABBBounds.containsPoint(point)) {
      return false;
    }
    return true;
  }
}
