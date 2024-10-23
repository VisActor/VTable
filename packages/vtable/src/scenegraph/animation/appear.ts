import type { Text } from '@src/vrender';
import type { BaseTableAPI } from '../../ts-types/base-table';

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

  const { scenegraph: scene, frozenColCount, frozenRowCount } = table;

  // header cell
  const { colStart, colEnd, rowStart, rowEnd } = scene.proxy; // to do: right bottom frozen

  for (let col = 0; col <= colEnd; col++) {
    for (let row = 0; row <= rowEnd; row++) {
      const cellGroup = scene.highPerformanceGetCell(col, row);
      if (cellGroup && cellGroup.role === 'cell') {
        cellGroup.forEachChildren((child: Text) => {
          child.setAttribute('opacity', 0);
          child
            .animate()
            .wait(type === 'one-by-one' ? (direction === 'row' ? row : col) * (duration - delay) : delay)
            .to({ opacity: 1 }, duration, 'linear');
        });
      }
    }
  }
}
