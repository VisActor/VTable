import {
  createBrowserVRenderApp,
  createFeishuVRenderApp,
  createHarmonyVRenderApp,
  createLynxVRenderApp,
  createNodeVRenderApp,
  createTaroVRenderApp,
  createTTVRenderApp,
  createWxVRenderApp
} from '@visactor/vrender';
import { container as legacyContainer, GraphicRender } from '@visactor/vrender-core';
import type { IApp, IEnvParamsMap, IGraphicRender, IStage, IStageParams } from '@visactor/vrender-core';
import { Env } from './tools/env';

type StableVRenderAppEnv = 'browser' | 'node' | 'wx' | 'lynx' | 'harmony';
// Keep public creator paths for Tier 2 runtimes, but do not treat them as stable default support without real-device smoke.
type Tier2VRenderAppEnv = 'taro' | 'feishu' | 'tt';
type VRenderAppEnv = StableVRenderAppEnv | Tier2VRenderAppEnv;
type VRenderAppEntryOptions = {
  envParams?: IEnvParamsMap[VRenderAppEnv];
};

type DefaultVRenderAppRecord = {
  app: IApp;
  refCount: number;
};

export type VRenderStageAppOptions = {
  mode?: VRenderAppEnv;
  scope?: string;
  app?: IApp;
  stage?: IStage;
  envParams?: IEnvParamsMap[VRenderAppEnv];
};

export type VRenderStageAppRef = {
  app?: IApp;
  stage: IStage;
  releaseAppRef: () => void;
  stageOwned: boolean;
  appOwned: boolean;
};

const defaultVRenderApps = new Map<string, DefaultVRenderAppRecord>();
const envParamsKeyMap = new WeakMap<object, number>();
let envParamsKeyId = 0;

const getVRenderAppEnv = (mode?: VRenderAppEnv): VRenderAppEnv => mode ?? (Env.mode === 'node' ? 'node' : 'browser');

const getEnvParamsKey = (envParams?: IEnvParamsMap[VRenderAppEnv]): string => {
  if (envParams == null) {
    return 'default';
  }

  if (typeof envParams === 'object' || typeof envParams === 'function') {
    const envParamsObject = envParams as object;
    const existingKey = envParamsKeyMap.get(envParamsObject);

    if (existingKey != null) {
      return `object:${existingKey}`;
    }

    envParamsKeyId += 1;
    envParamsKeyMap.set(envParamsObject, envParamsKeyId);
    return `object:${envParamsKeyId}`;
  }

  return `primitive:${String(envParams)}`;
};

const getVRenderAppKey = (env: VRenderAppEnv, scope?: string, envParams?: IEnvParamsMap[VRenderAppEnv]): string =>
  `${env}:${scope ?? 'default'}:${getEnvParamsKey(envParams)}`;

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

const createDefaultVRenderApp = (env: VRenderAppEnv, envParams?: IEnvParamsMap[VRenderAppEnv]): IApp => {
  const entryOptions: VRenderAppEntryOptions | undefined = envParams == null ? undefined : { envParams };
  let app: IApp;

  switch (env) {
    case 'node':
      app = createNodeVRenderApp(entryOptions);
      break;
    case 'wx':
      app = createWxVRenderApp(entryOptions);
      break;
    case 'lynx':
      app = createLynxVRenderApp(entryOptions);
      break;
    case 'harmony':
      app = createHarmonyVRenderApp(entryOptions);
      break;
    case 'taro':
      app = createTaroVRenderApp(entryOptions);
      break;
    case 'feishu':
      app = createFeishuVRenderApp(entryOptions);
      break;
    case 'tt':
      app = createTTVRenderApp(entryOptions);
      break;
    case 'browser':
    default:
      app = createBrowserVRenderApp(entryOptions);
      break;
  }

  syncLegacyRenderersToApp(app);

  return app;
};

const getDefaultVRenderAppRecord = (
  env: VRenderAppEnv,
  scope?: string,
  envParams?: IEnvParamsMap[VRenderAppEnv]
): DefaultVRenderAppRecord => {
  const key = getVRenderAppKey(env, scope, envParams);
  const record = defaultVRenderApps.get(key);

  if (record && !record.app.released) {
    return record;
  }

  const nextRecord = {
    app: createDefaultVRenderApp(env, envParams),
    refCount: 0
  };
  defaultVRenderApps.set(key, nextRecord);

  return nextRecord;
};

const retainDefaultVRenderApp = (env: VRenderAppEnv, scope?: string, envParams?: IEnvParamsMap[VRenderAppEnv]) => {
  const key = getVRenderAppKey(env, scope, envParams);
  const record = getDefaultVRenderAppRecord(env, scope, envParams);
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
      appOwned: false,
      releaseAppRef: (): void => undefined
    };
  }

  return {
    ...retainDefaultVRenderApp(getVRenderAppEnv(options.mode), options.scope, options.envParams),
    appOwned: true
  };
};

export function createStageFromVRenderApp(
  params: Partial<IStageParams>,
  options: VRenderStageAppOptions = {}
): VRenderStageAppRef {
  if (options.stage) {
    return {
      app: options.app,
      stage: options.stage,
      releaseAppRef: (): void => undefined,
      stageOwned: false,
      appOwned: false
    };
  }

  const resolvedApp = resolveVRenderApp(options);

  try {
    return {
      app: resolvedApp.app,
      stage: resolvedApp.app.createStage(params),
      releaseAppRef: resolvedApp.releaseAppRef,
      stageOwned: true,
      appOwned: resolvedApp.appOwned
    };
  } catch (error) {
    resolvedApp.releaseAppRef();
    throw error;
  }
}
