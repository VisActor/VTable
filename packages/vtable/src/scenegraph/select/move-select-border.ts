import type { Scenegraph } from '../scenegraph';

export function moveSelectingRangeComponentsToSelectedRangeComponents(scene: Scenegraph) {
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
