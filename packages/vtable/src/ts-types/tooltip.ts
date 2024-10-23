import type { RectProps } from './common';
import type { Placement } from './table-engine';

export type TooltipType = 'bubble-tooltip' | 'tooltip' | 'container';

/** 显示弹出提示内容 */
export type TooltipOptions = {
  /** tooltip内容 */
  content: string;
  /** tooltip框的位置 优先级高于referencePosition */
  position?: { x: number; y: number };
  /** tooltip框的参考位置 如果设置了position则该配置不生效 */
  referencePosition?: {
    /** 参考位置设置为一个矩形边界 设置placement来指定处于边界位置的方位*/
    rect: RectProps;
    /** 指定处于边界位置的方位  */
    placement?: Placement;
  };
  /** 需要自定义样式指定className dom的tooltip生效 */
  className?: string;
  /** 设置tooltip的样式 */
  style?: {
    bgColor?: string;
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    padding?: number[];
    arrowMark?: boolean;
    maxWidth?: number;
    maxHeight?: number;
  };
  /** 设置tooltip的消失时间 */
  disappearDelay?: number;
};
