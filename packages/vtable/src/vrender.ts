import { loadPoptip } from '@visactor/vrender-components';
import { getRuntimeInstallerBindingContext } from '@visactor/vrender-core/entries/runtime-installer';
import { container as legacyContainer, type ILegacyBindingContext } from '@visactor/vrender-core';
// 导出版本号
// export const version = __VERSION__;

let registed = false;
export function registerForVrender() {
  if (registed) {
    return;
  }
  registed = true;
  // Default env and graphic bootstrap is owned by create*VRenderApp().
  // VTable keeps only component/custom assembly that is not covered by the app creator.
  loadPoptip();
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
    const runtimeInstallerContext = getRuntimeInstallerBindingContext();

    if (module instanceof ContainerModule) {
      module.registry(legacyContainer.bind, unbindLegacyService, legacyContainer.isBound, legacyContainer.rebind);
      module.registry(
        runtimeInstallerContext.bind,
        unbindLegacyService,
        runtimeInstallerContext.isBound,
        runtimeInstallerContext.rebind
      );
      return;
    }

    module(legacyContainer);
    module(runtimeInstallerContext);
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
