import type React from 'react';
import { register, PivotChart as PivotChartConstrouctor, type PivotChartConstructorOptions } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

// 类型覆盖工具：让 PivotChartConstructorOptions 中的属性覆盖 BaseTableProps 中的同名属性
type Override<T, U> = Omit<T, keyof U> & U;

interface AnyRecords {
  records: Record<string, unknown>[];
}

export type PivotChartProps = Override<
  Omit<BaseTableProps, 'records' | 'container'>,
  Omit<PivotChartConstructorOptions, 'container' | 'records'>
> &
  AnyRecords;

export const PivotChart = createTable<React.PropsWithChildren<PivotChartProps>>('PivotChart', {
  type: 'pivot-chart',
  vtableConstrouctor: PivotChartConstrouctor as any
});

export function registerChartModule(name: string, chart: any) {
  register.chartModule(name, chart);
}
