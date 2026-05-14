jest.mock(
  '@visactor/vrender',
  () => ({
    createBrowserVRenderApp: jest.fn(),
    createNodeVRenderApp: jest.fn()
  }),
  { virtual: true }
);

import { createBrowserVRenderApp, createNodeVRenderApp } from '@visactor/vrender';
import { createStageFromVRenderApp } from '../src/vrender';

const mockedCreateBrowserVRenderApp = createBrowserVRenderApp as jest.Mock;
const mockedCreateNodeVRenderApp = createNodeVRenderApp as jest.Mock;

function createMockApp() {
  const app = {
    released: false,
    createStage: jest.fn((params: any) => ({
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

  it('uses the node app creator for node mode', () => {
    const app = createMockApp();
    mockedCreateNodeVRenderApp.mockReturnValue(app);

    const created = createStageFromVRenderApp({ width: 100 }, { mode: 'node', scope: 'unit-node' });

    expect(mockedCreateNodeVRenderApp).toHaveBeenCalledTimes(1);
    expect(mockedCreateBrowserVRenderApp).not.toHaveBeenCalled();
    expect(app.createStage).toHaveBeenCalledWith({ width: 100 });

    created.releaseAppRef();
    expect(app.release).toHaveBeenCalledTimes(1);
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
