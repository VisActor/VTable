import type { Container } from '../render/layout';
import type { CustomRenderFunctionArg } from './customElement';

export type ICustomLayoutObj = {
  rootContainer: Container | any;
  /**
   * 是否还需要默认渲染内容 只有配置true才绘制 默认 不绘制
   */
  renderDefault?: boolean;
  /**
   * 是否还启用style中的padding
   */
  enableCellPadding?: boolean;
};

export type ICustomLayoutFuc = (args: CustomRenderFunctionArg) => ICustomLayoutObj;

export type ICustomLayout = ICustomLayoutFuc | 'react-custom-layout';
