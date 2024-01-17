import type { IGraphic } from '@src/vrender';
import { ContainerModule, DefaultRenderService, RenderService } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { InteractionState } from '../../ts-types';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(RenderServiceForVTable).toSelf();
  rebind(RenderService).toService(RenderServiceForVTable);
});

export class RenderServiceForVTable extends DefaultRenderService {
  lastPrepareTime = 0;
  // 渲染前准备工作，计算bounds等逻辑
  prepare(updateBounds: boolean): void {
    this.renderTreeRoots.forEach(g => {
      const table = (g.stage as any).table as BaseTableAPI;
      if (table && table.stateManager.fastScrolling) {
        // const now = Date.now();
        // if (now - this.lastPrepareTime > 50) {
        //   this.lastPrepareTime = now;
        //   this._prepare(g, updateBounds);
        // } else {
        //   // do nothing
        // }
        g.stage.dirtyBounds?.empty();
      } else {
        this._prepare(g, updateBounds);
      }
    });
    return;
  }
}
