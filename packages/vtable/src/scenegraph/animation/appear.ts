import type { Text } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';

type OpacityAttribute = {
  opacity?: Text['attribute']['opacity'];
};

type AppearGraphic = Text & {
  getFinalAttribute?: () => OpacityAttribute | undefined;
  setFinalAttributes?: (attribute: OpacityAttribute) => void;
};

function getAppearFinalOpacity(child: AppearGraphic) {
  return child.attribute.opacity ?? child.getFinalAttribute?.()?.opacity ?? 1;
}

function setAppearFinalOpacity(child: AppearGraphic, opacity: number) {
  child.setAttribute('opacity', opacity);

  const finalAttribute = child.getFinalAttribute?.();
  if (finalAttribute) {
    if (child.setFinalAttributes) {
      child.setFinalAttributes({ opacity });
    } else {
      finalAttribute.opacity = opacity;
    }
  }
}

export function dealWithAnimationAppear(table: BaseTableAPI) {
  if (!table.options.animationAppear) {
    return;
  }

  let duration: number;
  let delay: number;
  let type: 'all' | 'one-by-one';
  let direction: 'row' | 'column';

  if (table.options.animationAppear === true) {
    duration = 500;
    delay = 0;
    type = 'one-by-one';
    direction = 'column';
  } else {
    duration = table.options.animationAppear.duration ?? 500;
    delay = table.options.animationAppear.delay ?? 0;
    type = table.options.animationAppear.type ?? 'one-by-one';
    direction = table.options.animationAppear.direction ?? 'row';
  }

  const { scenegraph: scene } = table;

  // header cell
  const { colEnd, rowEnd } = scene.proxy; // to do: right bottom frozen

  for (let col = 0; col <= colEnd; col++) {
    for (let row = 0; row <= rowEnd; row++) {
      const cellGroup = scene.highPerformanceGetCell(col, row);
      if (cellGroup && cellGroup.role === 'cell') {
        cellGroup.forEachChildren((child: AppearGraphic) => {
          const finalOpacity = getAppearFinalOpacity(child);
          const animationDelay = type === 'one-by-one' ? (direction === 'row' ? row : col) * (duration - delay) : delay;

          setAppearFinalOpacity(child, finalOpacity);
          child.animate().wait(animationDelay).from({ opacity: 0 }, duration, 'linear');
        });
      }
    }
  }
}
