import { ListTable } from '../src';
import { createStageFromVRenderApp } from '../src/vrender-app';
import { createCanvas, createDiv, removeDom } from './dom';

(globalThis as { __VERSION__?: string }).__VERSION__ = 'none';

const columns = [{ field: 'name', caption: 'Name', width: 120 }];
const records = [{ name: 'Alice' }];

describe('VTable VRender app-scoped lifecycle smoke', () => {
  test('creates, renders, releases, and recreates a browser-managed stage', () => {
    const container = createDiv();
    container.style.position = 'relative';
    container.style.width = '240px';
    container.style.height = '120px';
    const stages: unknown[] = [];

    try {
      for (let i = 0; i < 2; i++) {
        const beforeRender = jest.fn();
        const table = new ListTable({
          container,
          columns,
          records,
          widthMode: 'standard',
          heightMode: 'standard',
          defaultRowHeight: 30,
          vRenderAppScope: 'unit-browser-lifecycle',
          beforeRender
        });
        const stage = table.scenegraph.stage as { render: () => void; release: () => void };
        const releaseStage = jest.spyOn(stage, 'release');

        expect(table.scenegraph.stageOwned).toBe(true);
        expect(stage).toBeTruthy();
        expect(stages).not.toContain(stage);

        stage.render();
        expect(beforeRender).toHaveBeenCalled();

        stages.push(stage);
        table.release();
        expect(releaseStage).toHaveBeenCalledTimes(1);
        releaseStage.mockRestore();
      }
    } finally {
      removeDom(container);
    }
  });

  test('does not release an externally supplied borrowed stage', () => {
    const canvas = createCanvas();
    canvas.width = 240;
    canvas.height = 120;
    const external = createStageFromVRenderApp(
      {
        canvas,
        width: 240,
        height: 120
      },
      { mode: 'browser', scope: 'unit-borrowed-stage' }
    );
    const releaseStage = jest.spyOn(external.stage, 'release');

    try {
      const table = new ListTable({
        canvas,
        stage: external.stage,
        columns,
        records,
        widthMode: 'standard',
        heightMode: 'standard',
        defaultRowHeight: 30
      });

      expect(table.scenegraph.stage).toBe(external.stage);
      expect(table.scenegraph.stageOwned).toBe(false);

      table.release();
      expect(releaseStage).not.toHaveBeenCalled();
    } finally {
      releaseStage.mockRestore();
      external.stage.release();
      external.releaseAppRef();
      removeDom(canvas);
    }
  });
});
