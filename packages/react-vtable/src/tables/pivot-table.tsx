import type React from 'react';
import type { PivotTableConstructorOptions } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

export interface PivotTableProps
  extends Omit<BaseTableProps, 'records' | 'type'>,
    Omit<PivotTableConstructorOptions, 'container'> {}

export const PivotTable = createTable<React.PropsWithChildren<PivotTableProps>>('PivotTable', 'pivot-table');
