import { getTargetCell } from '@visactor/vtable';
import type { CreateDOMParamsType, IGraphic } from '@visactor/vtable/es/vrender';
import { ContainerModule, EnvContribution, BrowserEnvContribution } from '@visactor/vtable/es/vrender';
import { isString } from '@visactor/vutils';

export type CreateDOMParamsTypeForVTable = CreateDOMParamsType & {
  graphic: IGraphic;
  style?: Record<string, any>;
};

export const reactEnvModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(VTableBrowserEnvContribution).toSelf().inSingletonScope();
  if (isBound(EnvContribution)) {
    rebind(EnvContribution).toService(VTableBrowserEnvContribution);
  } else {
    bind(EnvContribution).toService(VTableBrowserEnvContribution);
  }
});

class VTableBrowserEnvContribution extends BrowserEnvContribution {
  updateDom(dom: HTMLElement, params: CreateDOMParamsTypeForVTable): boolean {
    const tableDiv = dom.parentElement;
    if (tableDiv && params.graphic) {
      const top = parseInt(params.style.top, 10);
      const left = parseInt(params.style.left, 10);

      let domWidth;
      let domHeight;
      if ((dom.style.display = 'none')) {
        const cellGroup = getTargetCell(params.graphic);
        domWidth = cellGroup.attribute.width ?? 1;
        domHeight = cellGroup.attribute.height ?? 1;
      } else {
        domWidth = dom.offsetWidth;
        domHeight = dom.offsetHeight;
      }
      if (top + domHeight < 0 || left + domWidth < 0 || top > tableDiv.offsetHeight || left > tableDiv.offsetWidth) {
        dom.style.display = 'none';
        return false;
      }
    }

    const { width, height, style } = params;

    if (style) {
      if (isString(style)) {
        dom.setAttribute('style', style);
      } else {
        Object.keys(style).forEach((k: any) => {
          dom.style[k] = style[k];
        });
      }
    }
    if (width != null) {
      dom.style.width = `${width}px`;
    }
    if (height != null) {
      dom.style.height = `${height}px`;
    }

    return true;
  }
}
