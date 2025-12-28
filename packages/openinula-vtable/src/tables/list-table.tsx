import type Inula from 'openinula';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

export interface ListTableProps
  extends Omit<BaseTableProps, 'records' | 'type'>,
    Omit<ListTableConstructorOptions, 'container'> {}

export const ListTable = createTable<ListTableProps & { children?: Inula.InulaNode }>('ListTable', 'list-table');
