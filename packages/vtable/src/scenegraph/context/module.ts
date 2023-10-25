import type { CanvasConfigType, ICanvas } from '@visactor/vrender';
import { CanvasFactory, Context2dFactory, ContainerModule } from '@visactor/vrender';
import { Context2dForVTable } from './context';
import { CanvasForVTable } from './canvas';

export const contextModule = new ContainerModule((bind, unbind, isBinded, rebind) => {
  if (isBinded(CanvasFactory)) {
    console.log('reBind canvas');
    // unbind(CanvasFactory);
    rebind(CanvasFactory)
      .toDynamicValue(() => {
        console.log('vvvvvvvvv');

        return (params: CanvasConfigType) => new CanvasForVTable(params);
      })
      .whenTargetNamed(CanvasForVTable.env);
  }

  if (isBinded(Context2dFactory)) {
    console.log('reBind context2d');
    // unbind(Context2dFactory);
    rebind(Context2dFactory)
      .toDynamicValue(() => {
        console.log('aaaaaa');
        return (params: ICanvas, dpr: number) => new Context2dForVTable(params, dpr);
      })
      .whenTargetNamed(Context2dForVTable.env);
  }
});
