import type { ColumnIconOption } from '../icon';

export type IEmptyTip = {
  spaceBetweenTextAndIcon?: number;
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
    /** icon的高度 */
    width?: number;
    /** icon的高度 */
    height?: number; // 如果是font图标 不设的话默认是字体高度
    image: string;
  };
  displayMode?: 'basedOnTable' | 'basedOnContainer';
};
