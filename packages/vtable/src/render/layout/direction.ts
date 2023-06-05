export type DirectionKey = {
  x: 'x' | 'y';
  y: 'y' | 'x';
  width: 'width' | 'height';
  height: 'height' | 'width';
  layoutWidth: 'layoutWidth' | 'layoutHeight';
  layoutHeight: 'layoutHeight' | 'layoutWidth';
  widthLimit: 'widthLimit' | 'heightLimit';
  heightLimit: 'heightLimit' | 'widthLimit';
  parentX: 'parentY' | 'parentX';
  parentY: 'parentX' | 'parentY';
  dx: 'dx' | 'dy';
  dy: 'dx' | 'dy';
};

export type Direction = 'row' | 'column';
export type JustifyContent = 'start' | 'end' | 'center'; // 布局方向上的对齐方式
export type AlignItems = 'start' | 'end' | 'center'; // 布局交叉方向上的对齐方式
type DirectionKeys = { [key in Direction]: DirectionKey };

export const DIRECTION_KEY: DirectionKeys = {
  row: {
    x: 'x',
    y: 'y',
    width: 'width',
    height: 'height',
    layoutWidth: 'layoutWidth',
    layoutHeight: 'layoutHeight',
    widthLimit: 'widthLimit',
    heightLimit: 'heightLimit',
    parentX: 'parentX',
    parentY: 'parentY',
    dx: 'dx',
    dy: 'dy'
  },
  column: {
    x: 'y',
    y: 'x',
    width: 'height',
    height: 'width',
    layoutWidth: 'layoutHeight',
    layoutHeight: 'layoutWidth',
    widthLimit: 'heightLimit',
    heightLimit: 'widthLimit',
    parentX: 'parentY',
    parentY: 'parentX',
    dx: 'dy',
    dy: 'dx'
  }
};
