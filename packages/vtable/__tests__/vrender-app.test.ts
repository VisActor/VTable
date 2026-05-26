jest.mock(
  '@visactor/vrender',
  () => ({
    createBrowserVRenderApp: jest.fn(),
    createNodeVRenderApp: jest.fn(),
    createWxVRenderApp: jest.fn(),
    createLynxVRenderApp: jest.fn(),
    createHarmonyVRenderApp: jest.fn(),
    createTaroVRenderApp: jest.fn(),
    createFeishuVRenderApp: jest.fn(),
    createTTVRenderApp: jest.fn()
  }),
  { virtual: true }
);

import { createBrowserVRenderApp, createNodeVRenderApp, createWxVRenderApp } from '@visactor/vrender';
import type { IApp, IStage } from '@visactor/vrender-core';
import { createStageFromVRenderApp } from '../src/vrender';

const mockedCreateBrowserVRenderApp = createBrowserVRenderApp as jest.Mock;
const mockedCreateNodeVRenderApp = createNodeVRenderApp as jest.Mock;
const mockedCreateWxVRenderApp = createWxVRenderApp as jest.Mock;

function createMockApp() {
  const app = {
    released: false,
    createStage: jest.fn((params: unknown) => ({
      params,
      release: jest.fn()
    })),
    release: jest.fn(() => {
      app.released = true;
    })
  };

  return app;
}

describe('VRender app-scoped stage helper', () => {
  beforeEach(() => {
    mockedCreateBrowserVRenderApp.mockReset();
    mockedCreateNodeVRenderApp.mockReset();
    mockedCreateWxVRenderApp.mockReset();
  });

  it('reuses the fallback app by env and scope until every retained stage is released', () => {
    const app = createMockApp();
    mockedCreateBrowserVRenderApp.mockReturnValue(app);

    const first = createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-reuse' });
    const second = createStageFromVRenderApp({ width: 200 }, { mode: 'browser', scope: 'unit-reuse' });

    expect(mockedCreateBrowserVRenderApp).toHaveBeenCalledTimes(1);
    expect(app.createStage).toHaveBeenCalledTimes(2);
    expect(first.stage).not.toBe(second.stage);

    first.releaseAppRef();
    expect(app.release).not.toHaveBeenCalled();

    second.releaseAppRef();
    second.releaseAppRef();
    expect(app.release).toHaveBeenCalledTimes(1);
  });

  it('keeps fallback apps isolated by scope', () => {
    const firstApp = createMockApp();
    const secondApp = createMockApp();
    mockedCreateBrowserVRenderApp.mockReturnValueOnce(firstApp).mockReturnValueOnce(secondApp);

    const first = createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-scope-a' });
    const second = createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-scope-b' });

    expect(mockedCreateBrowserVRenderApp).toHaveBeenCalledTimes(2);
    expect(firstApp.createStage).toHaveBeenCalledTimes(1);
    expect(secondApp.createStage).toHaveBeenCalledTimes(1);

    first.releaseAppRef();
    second.releaseAppRef();
    expect(firstApp.release).toHaveBeenCalledTimes(1);
    expect(secondApp.release).toHaveBeenCalledTimes(1);
  });

  it('uses the node app creator with envParams for node mode', () => {
    const app = createMockApp();
    const envParams = { createCanvas: jest.fn() };
    mockedCreateNodeVRenderApp.mockReturnValue(app);

    const created = createStageFromVRenderApp({ width: 100 }, { mode: 'node', scope: 'unit-node', envParams });

    expect(mockedCreateNodeVRenderApp).toHaveBeenCalledTimes(1);
    expect(mockedCreateNodeVRenderApp).toHaveBeenCalledWith({ envParams });
    expect(mockedCreateBrowserVRenderApp).not.toHaveBeenCalled();
    expect(app.createStage).toHaveBeenCalledWith({ width: 100 });

    created.releaseAppRef();
    expect(app.release).toHaveBeenCalledTimes(1);
  });

  it('keeps fallback node apps isolated by envParams identity', () => {
    const firstApp = createMockApp();
    const secondApp = createMockApp();
    const firstEnvParams = { createCanvas: jest.fn() };
    const secondEnvParams = { createCanvas: jest.fn() };
    mockedCreateNodeVRenderApp.mockReturnValueOnce(firstApp).mockReturnValueOnce(secondApp);

    const first = createStageFromVRenderApp(
      { width: 100 },
      { mode: 'node', scope: 'unit-node-envparams', envParams: firstEnvParams }
    );
    const second = createStageFromVRenderApp(
      { width: 100 },
      { mode: 'node', scope: 'unit-node-envparams', envParams: secondEnvParams }
    );

    expect(mockedCreateNodeVRenderApp).toHaveBeenCalledTimes(2);
    expect(firstApp.createStage).toHaveBeenCalledTimes(1);
    expect(secondApp.createStage).toHaveBeenCalledTimes(1);

    first.releaseAppRef();
    second.releaseAppRef();
    expect(firstApp.release).toHaveBeenCalledTimes(1);
    expect(secondApp.release).toHaveBeenCalledTimes(1);
  });

  it('uses stable mini-app creators for stable mini modes', () => {
    const app = createMockApp();
    const envParams = { canvasIdLists: ['unit'] };
    mockedCreateWxVRenderApp.mockReturnValue(app);

    const created = createStageFromVRenderApp({ width: 100 }, { mode: 'wx', scope: 'unit-wx', envParams });

    expect(mockedCreateWxVRenderApp).toHaveBeenCalledTimes(1);
    expect(mockedCreateWxVRenderApp).toHaveBeenCalledWith({ envParams });
    expect(app.createStage).toHaveBeenCalledWith({ width: 100 });

    created.releaseAppRef();
    expect(app.release).toHaveBeenCalledTimes(1);
  });

  it('borrows an externally supplied app and only creates a VTable-owned stage from it', () => {
    const app = createMockApp();

    const created = createStageFromVRenderApp({ width: 100 }, { app: app as unknown as IApp });

    expect(created.app).toBe(app);
    expect(created.stageOwned).toBe(true);
    expect(created.appOwned).toBe(false);
    expect(app.createStage).toHaveBeenCalledWith({ width: 100 });

    created.releaseAppRef();
    expect(app.release).not.toHaveBeenCalled();
  });

  it('borrows an externally supplied stage without creating or releasing an app', () => {
    const stage = { release: jest.fn() } as unknown as IStage;

    const created = createStageFromVRenderApp({ width: 100 }, { stage });

    expect(created.stage).toBe(stage);
    expect(created.stageOwned).toBe(false);
    expect(created.appOwned).toBe(false);
    expect(created.releaseAppRef()).toBeUndefined();
    expect(stage.release).not.toHaveBeenCalled();
    expect(mockedCreateBrowserVRenderApp).not.toHaveBeenCalled();
    expect(mockedCreateNodeVRenderApp).not.toHaveBeenCalled();
  });

  it('releases the retained fallback app when stage creation throws', () => {
    const app = createMockApp();
    const error = new Error('stage failed');
    app.createStage.mockImplementationOnce(() => {
      throw error;
    });
    mockedCreateBrowserVRenderApp.mockReturnValue(app);

    expect(() => createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-error' })).toThrow(error);
    expect(app.release).toHaveBeenCalledTimes(1);
  });
});
