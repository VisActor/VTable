import { acquireSharedVRenderApp } from '@visactor/vrender/entries/shared';
import { installPoptipToApp } from '@visactor/vrender-components';
import {
  installBrowserEnvToApp,
  installFeishuEnvToApp,
  installHarmonyEnvToApp,
  installLynxEnvToApp,
  installNodeEnvToApp,
  installTaroEnvToApp,
  installTTEnvToApp,
  installWxEnvToApp
} from '@visactor/vrender-kits/installers/app';
import { loadBrowserEnv } from '@visactor/vrender-kits/env/browser';
import { loadFeishuEnv } from '@visactor/vrender-kits/env/feishu';
import { loadHarmonyEnv } from '@visactor/vrender-kits/env/harmony';
import { loadLynxEnv } from '@visactor/vrender-kits/env/lynx';
import { loadNodeEnv } from '@visactor/vrender-kits/env/node';
import { loadTaroEnv } from '@visactor/vrender-kits/env/taro';
import { loadTTEnv } from '@visactor/vrender-kits/env/tt';
import { loadWxEnv } from '@visactor/vrender-kits/env/wx';
import type { TVRenderSharedAppEnv, TVRenderSharedAppOptions } from '@visactor/vrender/entries/shared';
import { vglobal } from '@visactor/vrender-core';
import type { IApp, IEnvParamsMap, IStage, IStageParams } from '@visactor/vrender-core';
import { Env } from './tools/env';
import { installVTableRuntimeContributions } from './scenegraph/runtime-contributions';

type VRenderAppEnv = TVRenderSharedAppEnv;
type VRenderStageMode = VRenderAppEnv | 'desktop-browser';

export type VRenderStageAppOptions = {
  mode?: VRenderStageMode;
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

const envParamsKeyMap = new WeakMap<object, number>();
let envParamsKeyId = 0;

const getVRenderAppEnv = (mode?: VRenderStageMode): VRenderAppEnv => {
  if (mode === 'desktop-browser') {
    return 'browser';
  }

  return mode ?? (Env.mode === 'node' ? 'node' : 'browser');
};

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

const getForcedEnvParams = (
  envParams?: IEnvParamsMap[VRenderAppEnv]
): IEnvParamsMap[VRenderAppEnv] & { force: true } => {
  if (envParams != null && (typeof envParams === 'object' || typeof envParams === 'function')) {
    return Object.assign(Object.create(envParams as object), { force: true });
  }

  return { force: true } as IEnvParamsMap[VRenderAppEnv] & { force: true };
};

const activateLegacyVGlobalEnv = (env: VRenderAppEnv, envParams?: IEnvParamsMap[VRenderAppEnv]): void => {
  switch (env) {
    case 'node':
      loadNodeEnv();
      break;
    case 'wx':
      loadWxEnv();
      break;
    case 'lynx':
      loadLynxEnv();
      break;
    case 'harmony':
      loadHarmonyEnv();
      break;
    case 'taro':
      loadTaroEnv();
      break;
    case 'feishu':
      loadFeishuEnv();
      break;
    case 'tt':
      loadTTEnv();
      break;
    case 'browser':
    default:
      loadBrowserEnv();
      break;
  }

  vglobal.setEnv(env, getForcedEnvParams(envParams));
};

const activateSharedVRenderAppEnv = (app: IApp, env: VRenderAppEnv, envParams?: IEnvParamsMap[VRenderAppEnv]): void => {
  switch (env) {
    case 'node':
      installNodeEnvToApp(app, envParams as IEnvParamsMap['node']);
      break;
    case 'wx':
      installWxEnvToApp(app, envParams as IEnvParamsMap['wx']);
      break;
    case 'lynx':
      installLynxEnvToApp(app, envParams as IEnvParamsMap['lynx']);
      break;
    case 'harmony':
      installHarmonyEnvToApp(app, envParams as IEnvParamsMap['harmony']);
      break;
    case 'taro':
      installTaroEnvToApp(app, envParams as IEnvParamsMap['taro']);
      break;
    case 'feishu':
      installFeishuEnvToApp(app, envParams as IEnvParamsMap['feishu']);
      break;
    case 'tt':
      installTTEnvToApp(app, envParams as IEnvParamsMap['tt']);
      break;
    case 'browser':
    default:
      installBrowserEnvToApp(app, envParams as IEnvParamsMap['browser']);
      break;
  }

  activateLegacyVGlobalEnv(env, envParams);
  installPoptipToApp(app);
};

const retainDefaultVRenderApp = (env: VRenderAppEnv, scope?: string, envParams?: IEnvParamsMap[VRenderAppEnv]) => {
  const key = getVRenderAppKey(env, scope, envParams);
  const sharedOptions = {
    env,
    key,
    ...(envParams == null ? undefined : { envParams })
  } as TVRenderSharedAppOptions<VRenderAppEnv>;
  const handle = acquireSharedVRenderApp(sharedOptions);
  let released = false;

  activateSharedVRenderAppEnv(handle.app, env, envParams);

  return {
    app: handle.app,
    releaseAppRef: () => {
      if (released) {
        return;
      }
      released = true;
      handle.release();
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
    installVTableRuntimeContributions(resolvedApp.app);
    const stage = resolvedApp.app.createStage(params);

    return {
      app: resolvedApp.app,
      stage,
      releaseAppRef: resolvedApp.releaseAppRef,
      stageOwned: true,
      appOwned: resolvedApp.appOwned
    };
  } catch (error) {
    resolvedApp.releaseAppRef();
    throw error;
  }
}
