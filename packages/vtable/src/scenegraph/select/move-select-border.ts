import type { Scenegraph } from '../scenegraph';
import { FastTextMeasureContribution } from '../utils/text-measure';

export function moveSelectingRangeComponentsToSelectedRangeComponents(scene: Scenegraph) {
  scene.selectingRangeComponents.forEach((rangeComponent, key) => {
    if (scene.selectedRangeComponents.size < scene.selectingRangeComponents.size - 1) {
      scene.selectingRangeComponents.get(key).rect.delete();
      scene.selectingRangeComponents.get(key).fillhandle.delete();
    }
    scene.selectedRangeComponents.set(key, rangeComponent);
  });
  scene.selectingRangeComponents = new Map();
  scene.updateNextFrame();
}
