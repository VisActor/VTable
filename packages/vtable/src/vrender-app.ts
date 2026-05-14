import { createBrowserVRenderApp, createNodeVRenderApp } from '@visactor/vrender';
import { container as legacyContainer, GraphicRender } from '@visactor/vrender-core';
import type { IApp, IGraphicRender, IStage, IStageParams } from '@visactor/vrender-core';
import { Env } from './tools/env';

type VRenderAppEnv = 'browser' | 'node';

type DefaultVRenderAppRecord = {
  app: IApp;
  refCount: number;
};

export type VRenderStageAppOptions = {
  mode?: VRenderAppEnv;
  scope?: string;
  app?: IApp;
};

export type VRenderStageAppRef = {
  app: IApp;
  stage: IStage;
  releaseAppRef: () => void;
};

const defaultVRenderApps = new Map<string, DefaultVRenderAppRecord>();

const getVRenderAppEnv = (mode?: VRenderAppEnv): VRenderAppEnv => mode ?? (Env.mode === 'node' ? 'node' : 'browser');

const getVRenderAppKey = (env: VRenderAppEnv, scope?: string): string => `${env}:${scope ?? 'default'}`;

const createRendererRegistryKey = (renderer: IGraphicRender, prefix: string): string => {
  const type = renderer?.type ?? 'unknown';
  const numberType = renderer?.numberType ?? 'unknown';
  const ctor = renderer?.constructor?.name ?? 'anonymous';

  return `${prefix}:${String(numberType)}:${String(type)}:${ctor}`;
};

const syncLegacyRenderersToApp = (app: IApp): void => {
  const rendererRegistry = app.registry?.renderer;
  const existingRenderers = rendererRegistry?.getAll?.() ?? [];
  const legacyRenderers = legacyContainer.getAll<IGraphicRender>(GraphicRender) ?? [];

  if (!rendererRegistry || !legacyRenderers.length) {
    return;
  }

  const seen = new Set<string>();
  rendererRegistry.clear();

  [...legacyRenderers, ...existingRenderers].forEach(renderer => {
    const key = createRendererRegistryKey(renderer, 'renderer');

    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    renderer.reInit?.();
    rendererRegistry.register(key, renderer);
  });
};

const createDefaultVRenderApp = (env: VRenderAppEnv): IApp => {
  const app = env === 'node' ? createNodeVRenderApp() : createBrowserVRenderApp();

  syncLegacyRenderersToApp(app);

  return app;
};

const getDefaultVRenderAppRecord = (env: VRenderAppEnv, scope?: string): DefaultVRenderAppRecord => {
  const key = getVRenderAppKey(env, scope);
  const record = defaultVRenderApps.get(key);

  if (record && !record.app.released) {
    return record;
  }

  const nextRecord = {
    app: createDefaultVRenderApp(env),
    refCount: 0
  };
  defaultVRenderApps.set(key, nextRecord);

  return nextRecord;
};

const retainDefaultVRenderApp = (env: VRenderAppEnv, scope?: string) => {
  const key = getVRenderAppKey(env, scope);
  const record = getDefaultVRenderAppRecord(env, scope);
  let released = false;

  record.refCount += 1;

  return {
    app: record.app,
    releaseAppRef: () => {
      if (released) {
        return;
      }
      released = true;
      record.refCount -= 1;

      if (record.refCount <= 0) {
        defaultVRenderApps.delete(key);
        if (!record.app.released) {
          record.app.release();
        }
      }
    }
  };
};

const resolveVRenderApp = (options: VRenderStageAppOptions = {}) => {
  if (options.app) {
    return {
      app: options.app,
      releaseAppRef: (): void => undefined
    };
  }

  return retainDefaultVRenderApp(getVRenderAppEnv(options.mode), options.scope);
};

export function createStageFromVRenderApp(
  params: Partial<IStageParams>,
  options: VRenderStageAppOptions = {}
): VRenderStageAppRef {
  const resolvedApp = resolveVRenderApp(options);

  try {
    return {
      app: resolvedApp.app,
      stage: resolvedApp.app.createStage(params),
      releaseAppRef: resolvedApp.releaseAppRef
    };
  } catch (error) {
    resolvedApp.releaseAppRef();
    throw error;
  }
}
