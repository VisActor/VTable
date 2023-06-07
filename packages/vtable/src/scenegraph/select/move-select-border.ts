import type { Scenegraph } from '../scenegraph';

export function moveSelectingRangeComponentsToSelectedRangeComponents(scene: Scenegraph) {
  scene.selectingRangeComponents.forEach((rangeComponent, key) => {
    if (scene.selectedRangeComponents.get(key)) {
      scene.selectedRangeComponents.get(key).rect.delete();
    }
    scene.selectedRangeComponents.set(key, rangeComponent);
  });
  scene.selectingRangeComponents = new Map();
  scene.updateNextFrame();
}
