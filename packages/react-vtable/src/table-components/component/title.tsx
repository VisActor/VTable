import type { TYPES } from '@visactor/vtable';
import type { BaseComponentProps } from '../base-component';
import { createComponent } from '../base-component';

export type TitleProps = TYPES.ITitle & BaseComponentProps;

export const Title = createComponent<TitleProps>('Title', 'title', undefined, true);
