import type { Scenegraph } from '../scenegraph';

export function moveSelectingRangeComponentsToSelectedRangeComponents(scene: Scenegraph) {
  // selectingRangeComponents 是拖拽/框选过程中的临时选区；
  // 鼠标松开后需要将其“提交”为 selectedRangeComponents，用于后续 hover/滚动时持续更新位置。
  //
  // 若 selectedRangeComponents 已存在同 key 的段落（例如重复选择同一区域），先删除旧图元避免泄漏与重复绘制。
  scene.selectingRangeComponents.forEach((rangeComponent, key) => {
    if (scene.selectedRangeComponents.get(key)) {
      scene.selectingRangeComponents.get(key).rect.delete();
      scene.selectingRangeComponents.get(key).fillhandle?.delete();
    }
    scene.selectedRangeComponents.set(key, rangeComponent);
  });
  scene.selectingRangeComponents = new Map();
  scene.updateNextFrame();
}
