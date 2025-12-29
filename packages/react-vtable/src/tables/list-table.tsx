import type React from 'react';
import type { ListTableConstructorOptions } from '@visactor/vtable';
import { ListTable as ListTableConstrouctor } from '@visactor/vtable';
import type { BaseTableProps } from './base-table';
import { createTable } from './base-table';

// 类型覆盖工具：让 ListTableConstructorOptions 中的属性覆盖 BaseTableProps 中的同名属性
type Override<T, U> = Omit<T, keyof U> & U;

export type ListTableProps = Override<
  Omit<BaseTableProps, 'records' | 'container'>,
  Omit<ListTableConstructorOptions, 'container'>
>;

export const ListTable = createTable<React.PropsWithChildren<ListTableProps>>('ListTable', {
  type: 'list-table',
  vtableConstrouctor: ListTableConstrouctor as any
});
