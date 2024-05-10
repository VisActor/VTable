import type { ITextGraphicAttribute } from '@visactor/vrender-core';

export type CoordinateType = 'cartesian' | 'polar' | 'geo' | 'none';
export type IOrientType = 'left' | 'top' | 'right' | 'bottom' | 'z';
export type IPolarOrientType = 'radius' | 'angle';

export interface ITickDataOpt {
  /**
   * 是否进行轴采样
   */
  sampling?: boolean;
  tickCount?: number | ((option: ITickCallbackOption) => number);
  forceTickCount?: number;
  tickStep?: number;
  tickMode?: 'average' | 'd3' | string;
  noDecimals?: boolean;

  coordinateType: CoordinateType;
  axisOrientType: IOrientType | IPolarOrientType;
  startAngle?: number;

  labelFormatter?: (value: any) => string;
  labelStyle: ITextGraphicAttribute;
  labelGap?: number;
}

export interface ICartesianTickDataOpt extends ITickDataOpt {
  axisOrientType: IOrientType;
  labelLastVisible: boolean;
  labelFlush: boolean;
}

export interface IPolarTickDataOpt extends ITickDataOpt {
  axisOrientType: IPolarOrientType;
  getRadius: () => number;
  labelOffset: number;
  inside: boolean;
}

export interface ITickData {
  index: number;
  value: number | string;
  // label: string;
}

type ITickCallbackOption = {
  /**
   * 坐标轴占据的画布大小。
   * 直角坐标系中为轴的宽度或高度。
   * 极坐标系中半径轴的长度。
   */
  axisLength?: number;
  /**
   * 轴标签的样式
   */
  labelStyle?: ITextGraphicAttribute;
};
