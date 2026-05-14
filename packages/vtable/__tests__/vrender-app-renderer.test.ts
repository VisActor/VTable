import '../src/scenegraph/scenegraph';
import { createStageFromVRenderApp } from '../src/vrender';

(globalThis as any).__VERSION__ = 'none';

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
        .find(renderer => renderer.constructor?.name === 'DefaultCanvasGroupRender') as any;

      groupRenderer?.reInit?.();

      const contributionNames = groupRenderer?._groupRenderContribitions?.map(
        (contribution: { constructor?: { name?: string } }) => contribution.constructor?.name
      );

      expect(contributionNames).toContain('SplitGroupAfterRenderContribution');
    } finally {
      stage.release();
      releaseAppRef();
    }
  });
});
