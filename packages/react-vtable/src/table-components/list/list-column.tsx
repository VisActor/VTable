import type { ReactElement, ReactNode } from 'react';
import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';
import type { ColumnDefine } from '@visactor/vtable';

export type ListColumnProps = Omit<ColumnDefine, 'columns'> & BaseComponentProps;

export const ListColumn = createComponent<ListColumnProps>('ListColumn', 'columns');
