import type React from 'react';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

export interface ListTableProps
  extends Omit<BaseTableProps, 'option' | 'records' | 'type'>,
    Omit<ListTableConstructorOptions, 'container'> {}

export const ListTable = createTable<React.PropsWithChildren<ListTableProps>>('ListTable', 'list-table');
