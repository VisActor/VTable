import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';
import type { IDimension } from '@visactor/vtable';

export type PivotDimensionProps = IDimension & BaseComponentProps;

export const PivotColumnDimension = createComponent<PivotDimensionProps>('PivotColumnDimension', 'columns');
export const PivotRowDimension = createComponent<PivotDimensionProps>('PivotRowDimension', 'rows');
