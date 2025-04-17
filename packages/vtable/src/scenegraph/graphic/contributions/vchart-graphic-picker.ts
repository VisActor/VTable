import { injectable } from '@src/vrender';
import type { IGraphicPicker, IPickParams } from '@src/vrender';
import type { Chart as VChartGraphic } from '../chart';
import { CHART_NUMBER_TYPE } from '../chart';

@injectable()
export class VChartPicker implements IGraphicPicker {
  type = 'chart';
  numberType: number = CHART_NUMBER_TYPE;

  contains(chart: any, point: any, params?: IPickParams): boolean | any {
    if (!chart.AABBBounds.containsPoint(point)) {
      return false;
    }
    return true;
  }
}
