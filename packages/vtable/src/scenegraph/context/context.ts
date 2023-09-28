// 参考konva
import { injectable } from 'inversify';
import type { IContext2d, EnvType } from '@visactor/vrender';
import { BrowserContext2d } from '@visactor/vrender';

declare const tt: {
  canvasGetImageData: (d: any) => any;
};

@injectable()
export class Context2dForVTable extends BrowserContext2d implements IContext2d {
  static env: EnvType = 'browser';

  // fill() {
  //   debugger;
  // }

  // stroke() {
  //   debugger;
  // }
}
