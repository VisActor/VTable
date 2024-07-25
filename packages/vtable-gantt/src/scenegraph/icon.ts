import type { IImageGraphicAttribute } from '@visactor/vrender-core';
import { Image } from '@visactor/vrender-core';

export interface IIconBase {
  /**
   * icon 是何种内容类型，如svg font。可用来约束不同类型的属性定义
   */
  type: 'font' | 'svg' | 'path' | 'image';
  /** icon的高度 */
  width?: number;
  /** icon的高度 */
  height?: number; // 如果是font图标 不设的话默认是字体高度
  // /**
  //  * IconPosition枚举类型
  //  */
  // positionType: IconPosition;
  /**
   * 和右侧元素间隔距离, 或者与单元格边界的间隔距离
   */
  marginRight?: number;
  /**
   * 和左侧元素间隔距离, 或者与单元格边界的间隔距离
   */
  marginLeft?: number;
  /**
   * icon名称，会作为内部缓存的key
   */
  name: string;

  /** 鼠标hover到图标上后出现的具体鼠标样式 */
  cursor?: string;
  /**是否可见 默认'always' 可选：'always' | 'mouseenter_cell' | 'click_cell',常驻|hover到单元格时|选中单元格时。
   * 建议：如需使用 'mouseenter_cell' | 'click_cell'，建议将positionTyle设为absoluteRight【即不占位】，否则占位的类型会影响视觉展示
   */
  visibleTime?: 'always' | 'mouseenter_cell' | 'click_cell';
  /**
   * 是否可交互 默认为true  目前已知不可交互按钮：下拉菜单状态
   */
  interactive?: boolean;
}
export interface IIconGraphicAttribute extends IImageGraphicAttribute {
  backgroundWidth?: number;
  backgroundHeight?: number;
  backgroundColor?: string;
  visibleTime?: string;
  funcType?: string;
  hoverImage?: string | HTMLImageElement | HTMLCanvasElement;
  originImage?: string | HTMLImageElement | HTMLCanvasElement;
  // margin?: [number, number, number, number];
  marginLeft?: number;
  marginRight?: number;
  shape?: 'circle' | 'square';
  interactive?: boolean;
}

export class Icon extends Image {
  declare attribute: IIconGraphicAttribute;
  role?: string;

  // eslint-disable-next-line no-useless-constructor
  constructor(params: IIconGraphicAttribute) {
    super(params);

    // if (this.attribute.visibleTime === 'mouseenter_cell' || this.attribute.visibleTime === 'click_cell') {
    //   this.attribute.opacity = 0;
    // }

    // if (this.attribute.hoverImage) {
    //   this.attribute.originImage = this.attribute.image;
    // }
  }

  get backgroundWidth(): number {
    return this.attribute.backgroundWidth ?? this.attribute.width ?? 0;
  }

  get backgroundHeight(): number {
    return this.attribute.backgroundHeight ?? this.attribute.height ?? 0;
  }
}
