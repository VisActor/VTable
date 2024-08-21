import type { IGraphic } from '@src/vrender';
import { DefaultRenderService } from '@src/vrender';

export class VTableDefaultRenderService extends DefaultRenderService {
  protected _prepare(g: IGraphic, updateBounds: boolean) {
    g.role !== 'cell' &&
      g.forEachChildren(g => {
        this._prepare(g as IGraphic, updateBounds);
      });
    g.update({ bounds: updateBounds, trans: true });
  }
}
