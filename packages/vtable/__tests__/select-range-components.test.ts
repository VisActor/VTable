import { createGroup, createRect } from '../src/vrender';
import { moveSelectingRangeComponentsToSelectedRangeComponents } from '../src/scenegraph/select/move-select-border';
import type { Scenegraph } from '../src/scenegraph/scenegraph';

describe('selection range graphics', () => {
  test('replacing the same range removes old graphics and keeps the newly selected range', () => {
    const group = createGroup({});
    const previous = {
      rect: createRect({ x: 0, y: 0, width: 100, height: 25 }),
      fillhandle: createRect({ x: 97, y: 22, width: 6, height: 6 })
    };
    const current = {
      rect: createRect({ x: 100, y: 0, width: 100, height: 25 }),
      fillhandle: createRect({ x: 197, y: 22, width: 6, height: 6 })
    };
    const untouched = { rect: createRect({ x: 0, y: 25, width: 100, height: 25 }) };
    for (const graphic of [previous.rect, previous.fillhandle, current.rect, current.fillhandle, untouched.rect]) {
      group.add(graphic);
    }
    const scene = {
      selectedRangeComponents: new Map([
        ['same-range', previous],
        ['other-range', untouched]
      ]),
      selectingRangeComponents: new Map([['same-range', current]]),
      updateNextFrame: jest.fn()
    };

    // 同一 key 替换后，画布只能保留新选框/选择柄和未参与替换的选区。
    moveSelectingRangeComponentsToSelectedRangeComponents(scene as unknown as Scenegraph);
    const children = group.getChildren();
    expect(children.length).toBe(3);
    expect(children.includes(previous.rect)).toBe(false);
    expect(children.includes(previous.fillhandle)).toBe(false);
    expect(children.includes(current.rect)).toBe(true);
    expect(children.includes(current.fillhandle)).toBe(true);
    expect(children.includes(untouched.rect)).toBe(true);
    expect(scene.selectedRangeComponents.get('same-range')).toBe(current);
    expect(scene.selectingRangeComponents.size).toBe(0);
  });
});
