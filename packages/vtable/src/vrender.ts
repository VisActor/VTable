import '@visactor/vrender-core';
import type { CreateDOMParamsType } from '@visactor/vrender-core';
import {
  ContainerModule,
  EnvContribution,
  container,
  isBrowserEnv,
  isNodeEnv,
  preLoadAllModule
} from '@visactor/vrender-core';
import { loadBrowserEnv, loadNodeEnv } from '@visactor/vrender-kits';
import { BrowserEnvContribution } from '@visactor/vrender-kits';
import {
  registerArc,
  registerArc3d,
  registerArea,
  registerCircle,
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
  registerSymbol,
  registerText,
  registerWrapText
} from '@visactor/vrender-kits';
import { isString } from '@visactor/vutils';
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
    loadBrowserEnv(container);
  } else if (isNodeEnv()) {
    loadNodeEnv(container);
  }
  registerArc();
  registerArc3d();
  registerArea();
  registerCircle();
  registerGlyph();
  registerGroup();
  registerImage();
  registerLine();
  registerPath();
  registerPolygon();
  registerPyramid3d();
  registerRect();
  registerRect3d();
  registerRichtext();
  registerShadowRoot();
  registerSymbol();
  registerText();
  registerWrapText();

  // for react-vtable
  if (isBrowserEnv()) {
    // bind(BrowserEnvContribution).toSelf().inSingletonScope();
    // bind(EnvContribution).toService(BrowserEnvContribution);
    container.load(reactEnvModule);
  }
}

export * from '@visactor/vrender-core';
export * from '@visactor/vrender-kits';

const reactEnvModule = new ContainerModule(bind => {
  bind(VTableBrowserEnvContribution).toSelf().inSingletonScope();
  bind(EnvContribution).toService(VTableBrowserEnvContribution);
});

class VTableBrowserEnvContribution extends BrowserEnvContribution {
  updateDom(dom: HTMLElement, params: CreateDOMParamsType): boolean {
    // debugger;

    const tableDiv = dom.parentElement;
    if (tableDiv) {
      // const tableRect = tableDiv.getBoundingClientRect();

      const top = parseInt(params.style.top, 10);
      const left = parseInt(params.style.left, 10);
      const domWidth = dom.offsetWidth; // TO DO: offsetWidth is 0 when display none
      const domHeight = dom.offsetHeight; // TO DO: offsetHeight is 0 when display none

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
