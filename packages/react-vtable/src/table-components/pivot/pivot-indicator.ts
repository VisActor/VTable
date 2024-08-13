import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';
import type { IIndicator } from '@visactor/vtable';

export type PivotIndicatorProps = IIndicator & BaseComponentProps;

export const PivotIndicator = createComponent<PivotIndicatorProps>('PivotIndicator', 'indicators');
