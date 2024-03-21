import type Inula from 'openinula';
import type { PivotTableConstructorOptions } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

export interface PivotTableProps
  extends Omit<BaseTableProps, 'records' | 'type'>,
    Omit<PivotTableConstructorOptions, 'container'> {}

export const PivotTable = createTable<Inula.PropsWithChildren<PivotTableProps>>('PivotTable', 'pivot-table');
