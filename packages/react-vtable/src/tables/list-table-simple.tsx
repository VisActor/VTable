import type React from 'react';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import { ListTableSimple as ListTableConstrouctor } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

export interface ListTableProps
  extends Omit<BaseTableProps, 'records'>,
    Omit<ListTableConstructorOptions, 'container'> {}

export const ListTableSimple = createTable<React.PropsWithChildren<ListTableProps>>('ListTable', {
  type: 'list-table',
  vtableConstrouctor: ListTableConstrouctor as any
});
