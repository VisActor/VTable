import '../src/scenegraph/scenegraph';
import { application, container, createStageFromVRenderApp, TextMeasureContribution, vglobal } from '../src/vrender';

(globalThis as { __VERSION__?: string }).__VERSION__ = 'none';

type RendererWithGroupContributions = {
  constructor?: { name?: string };
  reInit?: () => void;
  _groupRenderContribitions?: { constructor?: { name?: string } }[];
};

type RendererWithRenderContributions = {
  constructor?: { name?: string };
  _renderContribitions?: { constructor?: { name?: string } }[];
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

  test('uses the VTable image renderer contributions for app-scoped stages', () => {
    const canvas = document.createElement('canvas');
    const { app, stage, releaseAppRef } = createStageFromVRenderApp(
      {
        canvas,
        width: 100,
        height: 100
      },
      { mode: 'browser', scope: 'unit-image-renderer-contributions' }
    );

    try {
      const imageRenderer = app.registry.renderer
        .getAll()
        .find(renderer => renderer.constructor?.name === 'DefaultCanvasImageRender') as
        | RendererWithRenderContributions
        | undefined;

      const contributionNames = imageRenderer?._renderContribitions?.map(
        contribution => contribution.constructor?.name
      );

      expect(contributionNames).toContain('BeforeImageRenderContribution');
      expect(contributionNames).toContain('AfterImageRenderContribution');
    } finally {
      stage.release();
      releaseAppRef();
    }
  });

  test('uses the VTable text renderer contributions for app-scoped stages', () => {
    const canvas = document.createElement('canvas');
    const { app, stage, releaseAppRef } = createStageFromVRenderApp(
      {
        canvas,
        width: 100,
        height: 100
      },
      { mode: 'browser', scope: 'unit-text-renderer-contributions' }
    );

    try {
      const textRenderer = app.registry.renderer
        .getAll()
        .find(renderer => renderer.constructor?.name === 'DefaultCanvasTextRender') as
        | RendererWithRenderContributions
        | undefined;

      const contributionNames = textRenderer?._renderContribitions?.map(contribution => contribution.constructor?.name);

      expect(contributionNames).toContain('SuffixTextBeforeRenderContribution');
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

  test('reactivates the runtime env when reusing an existing shared app', () => {
    const firstCanvas = document.createElement('canvas');
    const first = createStageFromVRenderApp(
      {
        canvas: firstCanvas,
        width: 100,
        height: 100
      },
      { mode: 'browser', scope: 'unit-env-reactivation' }
    );

    try {
      const runtimeGlobal = application.global as { envContribution?: { loadSvg?: unknown } };
      const legacyGlobal = vglobal as { envContribution?: { addEventListener?: unknown } };
      runtimeGlobal.envContribution = undefined;
      legacyGlobal.envContribution = undefined;

      const secondCanvas = document.createElement('canvas');
      const second = createStageFromVRenderApp(
        {
          canvas: secondCanvas,
          width: 100,
          height: 100
        },
        { mode: 'browser', scope: 'unit-env-reactivation' }
      );

      try {
        expect(typeof runtimeGlobal.envContribution?.loadSvg).toBe('function');
        expect(typeof legacyGlobal.envContribution?.addEventListener).toBe('function');
      } finally {
        second.stage.release();
        second.releaseAppRef();
      }
    } finally {
      first.stage.release();
      first.releaseAppRef();
    }
  });

  test('normalizes desktop-browser mode before activating legacy env', () => {
    const canvas = document.createElement('canvas');
    const created = createStageFromVRenderApp(
      {
        canvas,
        width: 100,
        height: 100
      },
      { mode: 'desktop-browser' as never, scope: 'unit-desktop-browser-env' }
    );

    try {
      const legacyGlobal = vglobal as {
        env?: string;
        envContribution?: { addEventListener?: unknown };
      };

      expect(legacyGlobal.env).toBe('browser');
      expect(typeof legacyGlobal.envContribution?.addEventListener).toBe('function');
    } finally {
      created.stage.release();
      created.releaseAppRef();
    }
  });
});
