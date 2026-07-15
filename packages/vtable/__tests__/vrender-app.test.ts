jest.mock('@visactor/vrender/entries/shared', () => ({
  acquireSharedVRenderApp: jest.fn()
}));
jest.mock('@visactor/vrender-components', () => ({
  installPoptipToApp: jest.fn(),
  loadPoptip: jest.fn()
}));
jest.mock('../src/scenegraph/runtime-contributions', () => ({
  installVTableRuntimeContributions: jest.fn()
}));

import { acquireSharedVRenderApp } from '@visactor/vrender/entries/shared';
import { installPoptipToApp } from '@visactor/vrender-components';
import type { IApp, IStage } from '@visactor/vrender-core';
import { createStageFromVRenderApp } from '../src/vrender-app';
import { installVTableRuntimeContributions } from '../src/scenegraph/runtime-contributions';

const mockedAcquireSharedVRenderApp = acquireSharedVRenderApp as jest.Mock;
const mockedInstallPoptipToApp = installPoptipToApp as jest.Mock;
const mockedInstallVTableRuntimeContributions = installVTableRuntimeContributions as jest.Mock;

const sharedRecords = new Map<string, { app: ReturnType<typeof createMockApp>; refCount: number }>();
const queuedApps: ReturnType<typeof createMockApp>[] = [];

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

function getSharedRecordKey(options: { env: string; key?: string | symbol }) {
  return `${options.env}:${String(options.key ?? 'default')}`;
}

function queueSharedApps(...apps: ReturnType<typeof createMockApp>[]) {
  queuedApps.push(...apps);
}

function installSharedAcquireMock() {
  mockedAcquireSharedVRenderApp.mockImplementation((options: { env: string; key?: string | symbol }) => {
    const key = getSharedRecordKey(options);
    let record = sharedRecords.get(key);

    if (!record || record.app.released) {
      record = {
        app: queuedApps.shift() ?? createMockApp(),
        refCount: 0
      };
      sharedRecords.set(key, record);
    }

    record.refCount += 1;
    let released = false;

    return {
      app: record.app,
      env: options.env,
      key: options.key ?? 'default',
      release: jest.fn(() => {
        if (released) {
          return;
        }
        released = true;
        record.refCount -= 1;

        if (record.refCount <= 0) {
          sharedRecords.delete(key);
          if (!record.app.released) {
            record.app.release();
          }
        }
      })
    };
  });
}

describe('VRender app-scoped stage helper', () => {
  beforeEach(() => {
    mockedAcquireSharedVRenderApp.mockReset();
    mockedInstallPoptipToApp.mockReset();
    mockedInstallVTableRuntimeContributions.mockReset();
    sharedRecords.clear();
    queuedApps.length = 0;
    installSharedAcquireMock();
  });

  it('reuses the shared app by env and scope until every retained stage is released', () => {
    const app = createMockApp();
    queueSharedApps(app);

    const first = createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-reuse' });
    const second = createStageFromVRenderApp({ width: 200 }, { mode: 'browser', scope: 'unit-reuse' });

    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledTimes(2);
    expect(mockedAcquireSharedVRenderApp).toHaveBeenNthCalledWith(1, {
      env: 'browser',
      key: 'browser:unit-reuse:default'
    });
    expect(mockedAcquireSharedVRenderApp).toHaveBeenNthCalledWith(2, {
      env: 'browser',
      key: 'browser:unit-reuse:default'
    });
    expect(app.createStage).toHaveBeenCalledTimes(2);
    expect(mockedInstallPoptipToApp).toHaveBeenCalledTimes(2);
    expect(mockedInstallPoptipToApp).toHaveBeenNthCalledWith(1, app);
    expect(mockedInstallPoptipToApp).toHaveBeenNthCalledWith(2, app);
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
    queueSharedApps(firstApp, secondApp);

    const first = createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-scope-a' });
    const second = createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-scope-b' });

    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledTimes(2);
    expect(mockedAcquireSharedVRenderApp).toHaveBeenNthCalledWith(1, {
      env: 'browser',
      key: 'browser:unit-scope-a:default'
    });
    expect(mockedAcquireSharedVRenderApp).toHaveBeenNthCalledWith(2, {
      env: 'browser',
      key: 'browser:unit-scope-b:default'
    });
    expect(firstApp.createStage).toHaveBeenCalledTimes(1);
    expect(secondApp.createStage).toHaveBeenCalledTimes(1);

    first.releaseAppRef();
    second.releaseAppRef();
    expect(firstApp.release).toHaveBeenCalledTimes(1);
    expect(secondApp.release).toHaveBeenCalledTimes(1);
  });

  it('uses the shared entry with envParams for node mode', () => {
    const app = createMockApp();
    const envParams = { createCanvas: jest.fn() };
    queueSharedApps(app);

    const created = createStageFromVRenderApp({ width: 100 }, { mode: 'node', scope: 'unit-node', envParams });

    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledTimes(1);
    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledWith(
      expect.objectContaining({
        env: 'node',
        key: expect.stringMatching(/^node:unit-node:object:\d+$/),
        envParams
      })
    );
    expect(app.createStage).toHaveBeenCalledWith({ width: 100 });

    created.releaseAppRef();
    expect(app.release).toHaveBeenCalledTimes(1);
  });

  it('keeps fallback node apps isolated by envParams identity', () => {
    const firstApp = createMockApp();
    const secondApp = createMockApp();
    const firstEnvParams = { createCanvas: jest.fn() };
    const secondEnvParams = { createCanvas: jest.fn() };
    queueSharedApps(firstApp, secondApp);

    const first = createStageFromVRenderApp(
      { width: 100 },
      { mode: 'node', scope: 'unit-node-envparams', envParams: firstEnvParams }
    );
    const second = createStageFromVRenderApp(
      { width: 100 },
      { mode: 'node', scope: 'unit-node-envparams', envParams: secondEnvParams }
    );

    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledTimes(2);
    const firstKey = mockedAcquireSharedVRenderApp.mock.calls[0][0].key;
    const secondKey = mockedAcquireSharedVRenderApp.mock.calls[1][0].key;
    expect(firstKey).toEqual(expect.stringMatching(/^node:unit-node-envparams:object:\d+$/));
    expect(secondKey).toEqual(expect.stringMatching(/^node:unit-node-envparams:object:\d+$/));
    expect(firstKey).not.toBe(secondKey);
    expect(firstApp.createStage).toHaveBeenCalledTimes(1);
    expect(secondApp.createStage).toHaveBeenCalledTimes(1);

    first.releaseAppRef();
    second.releaseAppRef();
    expect(firstApp.release).toHaveBeenCalledTimes(1);
    expect(secondApp.release).toHaveBeenCalledTimes(1);
  });

  it('uses the shared entry for stable mini modes', () => {
    const app = createMockApp();
    const envParams = { canvasIdLists: ['unit'] };
    queueSharedApps(app);

    const created = createStageFromVRenderApp({ width: 100 }, { mode: 'wx', scope: 'unit-wx', envParams });

    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledTimes(1);
    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledWith(
      expect.objectContaining({
        env: 'wx',
        key: expect.stringMatching(/^wx:unit-wx:object:\d+$/),
        envParams
      })
    );
    expect(app.createStage).toHaveBeenCalledWith({ width: 100 });

    created.releaseAppRef();
    expect(app.release).toHaveBeenCalledTimes(1);
  });

  it('normalizes VChart desktop-browser mode to the browser VRender app env', () => {
    const app = createMockApp();
    queueSharedApps(app);

    const created = createStageFromVRenderApp(
      { width: 100 },
      { mode: 'desktop-browser' as never, scope: 'unit-desktop-browser' }
    );

    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledTimes(1);
    expect(mockedAcquireSharedVRenderApp).toHaveBeenCalledWith({
      env: 'browser',
      key: 'browser:unit-desktop-browser:default'
    });
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
    expect(mockedInstallVTableRuntimeContributions).toHaveBeenCalledWith(app);
    expect(mockedInstallVTableRuntimeContributions.mock.invocationCallOrder[0]).toBeLessThan(
      app.createStage.mock.invocationCallOrder[0]
    );
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
    expect(mockedAcquireSharedVRenderApp).not.toHaveBeenCalled();
    expect(mockedInstallVTableRuntimeContributions).not.toHaveBeenCalled();
  });

  it('releases the retained fallback app when stage creation throws', () => {
    const app = createMockApp();
    const error = new Error('stage failed');
    app.createStage.mockImplementationOnce(() => {
      throw error;
    });
    queueSharedApps(app);

    expect(() => createStageFromVRenderApp({ width: 100 }, { mode: 'browser', scope: 'unit-error' })).toThrow(error);
    expect(app.release).toHaveBeenCalledTimes(1);
  });
});
