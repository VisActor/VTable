import type { IRect } from '@src/vrender';
import type { Scenegraph } from '../scenegraph';
import type { CellRange, CellSubLocation } from '../../ts-types';
import { getCellSelectBorderKey } from './create-select-border';

/** 归并仅涉及普通 body 单段选框，按完整边界直接删除，不遍历或重建无关图元。 */
export function deleteSelectedBodyRangeComponent(scene: Scenegraph, range: CellRange): void {
  const key = getCellSelectBorderKey(
    Math.min(range.start.col, range.end.col),
    Math.min(range.start.row, range.end.row),
    Math.max(range.start.col, range.end.col),
    Math.max(range.start.row, range.end.row)
  );
  const component = scene.selectedRangeComponents.get(key);
  component?.rect.delete();
  component?.fillhandle?.delete();
  scene.selectedRangeComponents.delete(key);
}

/** 按住shift 则继续上次选中范围 需要将现有的删除掉 */
export function deleteLastSelectedRangeComponents(scene: Scenegraph) {
  // lastSelectId 用于标识“上一次选择动作”的选区段落（可能拆分为多段，selectId 相同）。
  // shift 续选时，需要移除上一次的选区图元，再将本次选区追加到 selectedRangeComponents。
  scene.selectedRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      const lastSelectId = key.split('-')[4];
      if (lastSelectId === scene.lastSelectId) {
        selectComp.rect.delete();
        selectComp.fillhandle?.delete();
        scene.selectedRangeComponents.delete(key);
      }
    }
  );
}

export function deleteAllSelectBorder(scene: Scenegraph) {
  // 清理最终选中态选区（包含 fill handle）
  scene.selectedRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      selectComp.rect.delete();
      selectComp.fillhandle?.delete();
    }
  );
  scene.selectedRangeComponents = new Map();
}

export function deleteAllSelectingBorder(scene: Scenegraph) {
  // 清理拖拽/框选过程中的临时选区
  scene.selectingRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      selectComp.rect.delete();
      selectComp.fillhandle?.delete();
    }
  );
  scene.selectingRangeComponents = new Map();
}

export function removeFillHandleFromSelectComponents(scene: Scenegraph) {
  // 多选区时不展示 fill handle，需要从所有 selectedRangeComponents 中移除
  scene.selectedRangeComponents.forEach(
    (selectComp: { rect: IRect; fillhandle?: IRect; role: CellSubLocation }, key: string) => {
      selectComp.fillhandle?.delete();
      selectComp.fillhandle = undefined;
    }
  );
}
