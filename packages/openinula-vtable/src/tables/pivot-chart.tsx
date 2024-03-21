import type Inula from 'openinula';
import * as VTable from '@visactor/vtable';
import type { PivotChartConstructorOptions } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

export interface PivotChartProps
  extends Omit<BaseTableProps, 'records' | 'type'>,
    Omit<PivotChartConstructorOptions, 'container'> {}

export const PivotChart = createTable<Inula.PropsWithChildren<PivotChartProps>>('PivotChart', 'pivot-chart');

export function registerChartModule(name: string, chart: any) {
  VTable.register.chartModule(name, chart);
}
