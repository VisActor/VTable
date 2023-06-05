import type { Container } from '../render/layout';
import type { CustomRenderFunctionArg } from './customElement';

export type ICustomLayoutObj = {
  rootContainer: Container;
  /**
   * 是否还需要默认渲染内容 只有配置true才绘制 默认 不绘制
   */
  renderDefault?: boolean;
};

export type ICustomLayoutFuc = (args: CustomRenderFunctionArg) => ICustomLayoutObj;

export type ICustomLayout = ICustomLayoutFuc;
