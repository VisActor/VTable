import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';
import type { ITitleDefine } from '@visactor/vtable';

export type PivotHeaderTitleProps = ITitleDefine & BaseComponentProps;

export const PivotColumnHeaderTitle = createComponent<PivotHeaderTitleProps>(
  'PivotColumnHeaderTitle',
  'columnHeaderTitle',
  undefined,
  true
);
export const PivotRowHeaderTitle = createComponent<PivotHeaderTitleProps>(
  'PivotRowHeaderTitle',
  'rowHeaderTitle',
  undefined,
  true
);
