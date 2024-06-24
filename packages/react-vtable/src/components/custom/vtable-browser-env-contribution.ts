import { getTargetCell, VRender } from '@visactor/vtable';
import { isString } from '@visactor/vutils';

const { ContainerModule, EnvContribution, BrowserEnvContribution } = VRender;
type CreateDOMParamsType = VRender.CreateDOMParamsType;

export const reactEnvModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(VTableBrowserEnvContribution).toSelf().inSingletonScope();
  if (isBound(EnvContribution)) {
    rebind(EnvContribution).toService(VTableBrowserEnvContribution);
  } else {
    bind(EnvContribution).toService(VTableBrowserEnvContribution);
  }
});

class VTableBrowserEnvContribution extends BrowserEnvContribution {
  updateDom(dom: HTMLElement, params: CreateDOMParamsType): boolean {
    const tableDiv = dom.parentElement;
    if (tableDiv) {
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
        Object.keys(style).forEach(k => {
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
