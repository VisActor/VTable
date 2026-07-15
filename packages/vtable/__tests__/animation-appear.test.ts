// @ts-nocheck

import { dealWithAnimationAppear } from '../src/scenegraph/animation/appear';
import { createText, defaultTimeline, registerAnimate } from '../src/vrender';

type MockAnimationAppear = Partial<{
  duration: number;
  delay: number;
  type: 'all' | 'one-by-one';
  direction: 'row' | 'column';
}>;

interface MockChild {
  attribute: Record<string, unknown>;
  setAttribute: jest.Mock;
  animate: jest.Mock;
}

function createAnimation() {
  const animation = {
    wait: jest.fn(() => animation),
    to: jest.fn(() => animation),
    from: jest.fn(() => animation)
  };

  return animation;
}

function createChild(opacity?: number) {
  const animation = createAnimation();
  const child = {
    attribute: opacity === undefined ? {} : { opacity },
    setAttribute: jest.fn((key: string, value: unknown) => {
      child.attribute[key] = value;
    }),
    animate: jest.fn(() => animation)
  };

  return { child, animation };
}

function createTable(children: MockChild[], animationAppear: MockAnimationAppear = {}) {
  const cellGroup = {
    role: 'cell',
    forEachChildren: (callback: (child: MockChild) => void) => {
      children.forEach(callback);
    }
  };

  return {
    options: {
      animationAppear: {
        duration: 1000,
        delay: 500,
        type: 'one-by-one',
        direction: 'row',
        ...animationAppear
      }
    },
    scenegraph: {
      proxy: {
        colEnd: 0,
        rowEnd: 2
      },
      highPerformanceGetCell: jest.fn((_col: number, row: number) => (row === 2 ? cellGroup : null))
    }
  };
}

describe('dealWithAnimationAppear', () => {
  beforeEach(() => {
    registerAnimate();
    defaultTimeline.clear();
  });

  afterEach(() => {
    defaultTimeline.clear();
  });

  it('keeps the final opacity as static state and animates from hidden state', () => {
    const first = createChild();
    const second = createChild(0.4);
    const table = createTable([first.child, second.child]);

    dealWithAnimationAppear(table as Parameters<typeof dealWithAnimationAppear>[0]);

    expect(first.child.attribute.opacity).toBe(1);
    expect(second.child.attribute.opacity).toBe(0.4);

    expect(first.animation.wait).toHaveBeenCalledWith(1000);
    expect(first.animation.from).toHaveBeenCalledWith({ opacity: 0 }, 1000, 'linear');
    expect(first.animation.to).not.toHaveBeenCalled();

    expect(second.animation.wait).toHaveBeenCalledWith(1000);
    expect(second.animation.from).toHaveBeenCalledWith({ opacity: 0 }, 1000, 'linear');
    expect(second.animation.to).not.toHaveBeenCalled();
  });

  it('uses the column index for one-by-one column animation delays', () => {
    const { child, animation } = createChild();
    const table = createTable([child], { direction: 'column' });
    table.scenegraph.proxy.colEnd = 3;
    table.scenegraph.proxy.rowEnd = 0;
    table.scenegraph.highPerformanceGetCell.mockImplementation((col: number) =>
      col === 3
        ? {
            role: 'cell',
            forEachChildren: (callback: (child: MockChild) => void) => callback(child)
          }
        : null
    );

    dealWithAnimationAppear(table as Parameters<typeof dealWithAnimationAppear>[0]);

    expect(animation.wait).toHaveBeenCalledWith(1500);
    expect(animation.from).toHaveBeenCalledWith({ opacity: 0 }, 1000, 'linear');
  });

  it('keeps VRender static and final opacity visible through the fade appear lifecycle', () => {
    const child = createText({ text: 'cell', opacity: 1 });
    child.setFinalAttributes({ opacity: 0 });
    const table = createTable([child], { delay: 0, type: 'all' });

    dealWithAnimationAppear(table as Parameters<typeof dealWithAnimationAppear>[0]);

    expect(child.attribute.opacity).toBe(0);
    expect(child.baseAttributes.opacity).toBe(1);
    expect(child.getFinalAttribute().opacity).toBe(1);

    defaultTimeline.tick(500);

    expect(child.attribute.opacity).toBeCloseTo(0.5);
    expect(child.baseAttributes.opacity).toBe(1);
    expect(child.getFinalAttribute().opacity).toBe(1);

    defaultTimeline.tick(500);

    expect(child.attribute.opacity).toBe(1);
    expect(child.baseAttributes.opacity).toBe(1);
    expect(child.getFinalAttribute().opacity).toBe(1);
  });
});
