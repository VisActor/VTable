import { loadPoptip } from '@visactor/vrender-components';
import '@visactor/vrender-core';
import { isBrowserEnv, isNodeEnv, registerAllModules, registerFlexLayoutPlugin } from '@visactor/vrender-core';
import {
  loadBrowserEnv,
  loadNodeEnv,
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
// 导出版本号
// export const version = __VERSION__;

let registed = false;
export function registerForVrender() {
  if (registed) {
    return;
  }
  registed = true;

  if (isBrowserEnv()) {
    loadBrowserEnv();
  } else if (isNodeEnv()) {
    loadNodeEnv();
  }
  registerArc();
  // registerArc3d();
  // registerArea();
  registerCircle();
  // registerGlyph();
  registerGroup();
  registerImage();
  registerLine();
  // registerPath();
  // registerPolygon();
  // registerPyramid3d();
  registerRect();
  // registerRect3d();
  registerRichtext();
  registerShadowRoot();
  registerSymbol();
  registerText();
  registerFlexLayoutPlugin();
  // registerWrapText();
  loadPoptip();

  registerFlexLayoutPlugin();
}

export type { Direction } from '@visactor/vrender-core';
export type { State } from '@visactor/vrender-components';
// export { GroupFadeIn } from '@visactor/vrender-core';
// export { GroupFadeOut } from '@visactor/vrender-core';

export * from '@visactor/vrender-core';
export * from '@visactor/vrender-kits';
export * from '@visactor/vrender-components';
export * from '@visactor/vrender-animate';
