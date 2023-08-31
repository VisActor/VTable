import type { IRect } from '@visactor/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellLocation } from '../../ts-types';

/** 按住shift 则继续上次选中范围 需要将现有的删除掉 */
export function deleteLastSelectedRangeComponents(scene: Scenegraph) {
  scene.selectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellLocation }, key: string) => {
    const lastSelectId = key.split('-')[4];
    if (lastSelectId === scene.lastSelectId) {
      selectComp.rect.delete();
      scene.selectedRangeComponents.delete(key);
    }
  });
}

export function deleteAllSelectBorder(scene: Scenegraph) {
  scene.selectedRangeComponents.forEach((selectComp: { rect: IRect; role: CellLocation }, key: string) => {
    selectComp.rect.delete();
  });
  scene.selectedRangeComponents = new Map();
}
