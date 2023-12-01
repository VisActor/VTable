import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';
import type { IRowDimension, IColumnDimension } from '@visactor/vtable';

export type RowPivotDimensionProps = IRowDimension & BaseComponentProps;
export type ColumnPivotDimensionProps = IColumnDimension & BaseComponentProps;

export const PivotColumnDimension = createComponent<ColumnPivotDimensionProps>('PivotColumnDimension', 'columns');
export const PivotRowDimension = createComponent<RowPivotDimensionProps>('PivotRowDimension', 'rows');
