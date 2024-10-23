import type { ITableLegendOption } from '../../ts-types/component/legend';
import { DiscreteTableLegend } from './discrete-legend/discrete-legend';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { ContinueTableLegend } from './continue-legend/continue-legend';

export type CreateLegend = (
  option: ITableLegendOption,
  table: BaseTableAPI
) => DiscreteTableLegend | ContinueTableLegend;
export function createLegend(option: ITableLegendOption, table: BaseTableAPI) {
  if (option.type === 'color' || option.type === 'size') {
    return new ContinueTableLegend(option, table);
  }
  return new DiscreteTableLegend(option, table);
}
