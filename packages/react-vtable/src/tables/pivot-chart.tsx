import type React from 'react';
import { register } from '@visactor/vtable';
import type { PivotChartConstructorOptions } from '@visactor/vtable';
import { PivotChart as PivotChartConstrouctor } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

interface AnyRecords {
  records: Record<string, unknown>[];
}
export interface PivotChartProps
  extends Omit<BaseTableProps, 'records'>,
    Omit<PivotChartConstructorOptions, 'container' | 'records'>,
    AnyRecords {}

export const PivotChart = createTable<React.PropsWithChildren<PivotChartProps>>('PivotChart', {
  type: 'pivot-chart',
  vtableConstrouctor: PivotChartConstrouctor as any
});

export function registerChartModule(name: string, chart: any) {
  register.chartModule(name, chart);
}
