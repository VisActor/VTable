import { injectable } from 'inversify';
import { type ICanvas, type CanvasConfigType, type EnvType, BrowserCanvas } from '@visactor/vrender';
import { Context2dForVTable } from './context';

@injectable()
export class CanvasForVTable extends BrowserCanvas implements ICanvas {
  static env: EnvType = 'browser';

  /**
   * 通过canvas生成一个wrap对象，初始化时不会再设置canvas的属性
   * @param params
   */
  constructor(params: CanvasConfigType) {
    super(params);
    // debugger;
    this._context = new Context2dForVTable(this, this._dpr);
    this.initStyle();
  }
}
