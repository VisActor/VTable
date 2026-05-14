import { loadPoptip } from '@visactor/vrender-components';
import {
  container as legacyContainer,
  type ILegacyBindingContext,
  isBrowserEnv,
  isNodeEnv,
  preLoadAllModule,
  registerFlexLayoutPlugin
} from '@visactor/vrender-core';
import {
  loadBrowserEnv,
  loadNodeEnv,
  registerArc,
  registerArc3d,
  registerArea,
  registerCircle,
  registerGifImage,
  registerGlyph,
  registerGroup,
  registerImage,
  registerLine,
  registerPath,
  registerPolygon,
  registerPyramid3d,
  registerRect,
  registerRect3d,
  registerRichtext,
  registerShadowRoot,
  registerStar,
  registerSymbol,
  registerText,
  registerWrapText
} from '@visactor/vrender-kits';
// 导出版本号
// export const version = __VERSION__;

let registed = false;
export function registerForVrender() {
  if (registed) {
    return;
  }
  registed = true;
  // 注册内置组件
  preLoadAllModule();

  if (isBrowserEnv()) {
    loadBrowserEnv(legacyContainer);
  } else if (isNodeEnv()) {
    loadNodeEnv(legacyContainer);
  }
  registerArc();
  registerArc3d();
  registerArea();
  registerCircle();
  registerGlyph();
  registerGroup();
  registerGifImage();
  registerImage();
  registerLine();
  registerPath();
  registerPolygon();
  registerPyramid3d();
  registerRect();
  registerRect3d();
  registerRichtext();
  registerShadowRoot();
  registerStar();
  registerSymbol();
  registerText();
  registerFlexLayoutPlugin();
  registerWrapText();
  loadPoptip();

  registerFlexLayoutPlugin();
}

type LegacyBind = ILegacyBindingContext['bind'];
type LegacyRebind = ILegacyBindingContext['rebind'];
type LegacyIsBound = ILegacyBindingContext['isBound'];
type LegacyContainerModuleHandler = (
  bind: LegacyBind,
  unbind: (serviceIdentifier: unknown) => void,
  isBound: LegacyIsBound,
  rebind: LegacyRebind
) => void;

export class ContainerModule {
  constructor(public readonly registry: LegacyContainerModuleHandler) {}
}

const unbindLegacyService = (): void => undefined;

export const container = Object.assign(legacyContainer, {
  load(module: ContainerModule | ((context: ILegacyBindingContext) => void)): void {
    if (module instanceof ContainerModule) {
      module.registry(legacyContainer.bind, unbindLegacyService, legacyContainer.isBound, legacyContainer.rebind);
      return;
    }

    module(legacyContainer);
  },
  get<T>(serviceIdentifier: unknown): T {
    return legacyContainer.getAll<T>(serviceIdentifier as never)[0];
  }
});

export const injectable =
  () =>
  <T>(target: T): T =>
    target;

export const inject =
  (_serviceIdentifier: unknown) =>
  (..._args: unknown[]): void =>
    undefined;

export const named =
  (_name: unknown) =>
  (..._args: unknown[]): void =>
    undefined;

export type { Direction } from '@visactor/vrender-core';
export type { State } from '@visactor/vrender-components';
export { createStageFromVRenderApp } from './vrender-app';
export type { VRenderStageAppOptions, VRenderStageAppRef } from './vrender-app';
// export { GroupFadeIn } from '@visactor/vrender-core';
// export { GroupFadeOut } from '@visactor/vrender-core';

export * from '@visactor/vrender-core';
export * from '@visactor/vrender-kits';
export * from '@visactor/vrender-components';
export * from '@visactor/vrender-animate';
