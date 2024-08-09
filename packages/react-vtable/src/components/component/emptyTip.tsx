import { createComponent } from '../base-component';
import type { BaseComponentProps } from '../base-component';

export type EmptyTipProps = {
  text?: string;
  textStyle?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string | number;
    fontVariant?: string;
    lineHeight?: number | string;
    underline?: number;
    lineThrough?: number;
    color?: string;
  };
  icon?: {
    width?: number;
    height?: number;
    image: string;
  };
} & BaseComponentProps;

export const EmptyTip = createComponent<EmptyTipProps>('EmptyTip', 'emptyTip', undefined, true);
