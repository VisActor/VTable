import type React from 'react';
import type { PivotTableConstructorOptions } from '@visactor/vtable';
import { PivotTable as PivotTableConstrouctor } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

// 类型覆盖工具：让 PivotTableConstructorOptions 中的属性覆盖 BaseTableProps 中的同名属性
type Override<T, U> = Omit<T, keyof U> & U;

export type PivotTableProps = Override<
  Omit<BaseTableProps, 'records' | 'container'>,
  Omit<PivotTableConstructorOptions, 'container'>
>;

export const PivotTable = createTable<React.PropsWithChildren<PivotTableProps>>('PivotTable', {
  type: 'pivot-table',
  vtableConstrouctor: PivotTableConstrouctor as any
});
