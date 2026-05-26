import '../src/scenegraph/scenegraph';
import { container, createStageFromVRenderApp, TextMeasureContribution } from '../src/vrender';

(globalThis as { __VERSION__?: string }).__VERSION__ = 'none';

type RendererWithGroupContributions = {
  constructor?: { name?: string };
  reInit?: () => void;
  _groupRenderContribitions?: { constructor?: { name?: string } }[];
};

type PickerWithContains = {
  constructor?: { name?: string };
  type?: string;
  contains?: (
    graphic: { attribute?: Record<string, unknown>; AABBBounds: { containsPoint: () => boolean } },
    point: {
      x: number;
      y: number;
    }
  ) => unknown;
};

describe('VRender app renderer installation', () => {
  test('uses the VTable group renderer contributions for app-scoped stages', () => {
    const canvas = document.createElement('canvas');
    const { app, stage, releaseAppRef } = createStageFromVRenderApp(
      {
        canvas,
        width: 100,
        height: 100
      },
      { mode: 'browser', scope: 'unit-renderer-contributions' }
    );

    try {
      const groupRenderer = app.registry.renderer
        .getAll()
        .find(renderer => renderer.constructor?.name === 'DefaultCanvasGroupRender') as RendererWithGroupContributions;

      groupRenderer?.reInit?.();

      const contributionNames = groupRenderer?._groupRenderContribitions?.map(
        contribution => contribution.constructor?.name
      );

      expect(contributionNames).toContain('SplitGroupAfterRenderContribution');
    } finally {
      stage.release();
      releaseAppRef();
    }
  });

  test('uses the VTable chart picker contribution for app-scoped stages', () => {
    const canvas = document.createElement('canvas');
    const { app, stage, releaseAppRef } = createStageFromVRenderApp(
      {
        canvas,
        width: 100,
        height: 100
      },
      { mode: 'browser', scope: 'unit-picker-contributions' }
    );

    try {
      const picker = app.registry.picker
        .getAll()
        .find(entry => entry.constructor?.name === 'VChartPicker') as unknown as PickerWithContains | undefined;

      expect(picker?.type).toBe('chart');
      expect(
        picker?.contains?.(
          {
            attribute: {},
            AABBBounds: {
              containsPoint: () => true
            }
          },
          { x: 1, y: 1 }
        )
      ).toBe(true);
    } finally {
      stage.release();
      releaseAppRef();
    }
  });

  test('uses the VTable fast text measure contribution with app-scoped setup', () => {
    const canvas = document.createElement('canvas');
    const { stage, releaseAppRef } = createStageFromVRenderApp(
      {
        canvas,
        width: 100,
        height: 100
      },
      { mode: 'browser', scope: 'unit-text-measure-contribution' }
    );

    try {
      const textMeasure = container.get<{
        constructor?: { name?: string };
        measureTextWidth: (text: string, options: { fontSize: number; fontFamily: string }) => number;
      }>(TextMeasureContribution);

      expect(textMeasure.constructor?.name).toBe('FastTextMeasureContribution');
      expect(textMeasure.measureTextWidth('VTable', { fontSize: 12, fontFamily: 'Arial' })).toBeGreaterThan(0);
    } finally {
      stage.release();
      releaseAppRef();
    }
  });
});
