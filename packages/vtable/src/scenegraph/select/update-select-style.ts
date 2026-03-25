import type { IRect, IRectGraphicAttribute } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';

// for fs big screen
export function temporarilyUpdateSelectRectStyle(rectAttribute: IRectGraphicAttribute, scene: Scenegraph) {
  // 临时覆盖选区样式（例如大屏模式下增强可见性）。
  // 该方法只更新最终选中态（selectedRangeComponents），不会影响 selectingRangeComponents（拖拽过程态）。
  const { selectedRangeComponents } = scene;
  selectedRangeComponents.forEach((selectComp: { rect: IRect }, key: string) => {
    selectComp.rect.setAttributes(rectAttribute);
  });
  scene.updateNextFrame();
}
