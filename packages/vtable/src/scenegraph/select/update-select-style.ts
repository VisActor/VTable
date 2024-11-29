import type { IRect, IRectGraphicAttribute } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';

// for fs big screen
export function temporarilyUpdateSelectRectStyle(rectAttribute: IRectGraphicAttribute, scene: Scenegraph) {
  const { selectedRangeComponents } = scene;
  selectedRangeComponents.forEach((selectComp: { rect: IRect }, key: string) => {
    selectComp.rect.setAttributes(rectAttribute);
  });
  scene.updateNextFrame();
}
