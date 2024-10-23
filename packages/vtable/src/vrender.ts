// import '@visactor/vrender-core';
// import { container, isBrowserEnv, isNodeEnv, preLoadAllModule } from '@visactor/vrender-core';
// import { loadBrowserEnv, loadNodeEnv } from '@visactor/vrender-kits';
// import {
//   registerArc,
//   registerArc3d,
//   registerArea,
//   registerCircle,
//   registerGlyph,
//   registerGroup,
//   registerImage,
//   registerLine,
//   registerPath,
//   registerPolygon,
//   registerPyramid3d,
//   registerRect,
//   registerRect3d,
//   registerRichtext,
//   registerShadowRoot,
//   registerSymbol,
//   registerText,
//   registerWrapText
// } from '@visactor/vrender-kits';
// // 导出版本号
// // export const version = __VERSION__;

// let registed = false;
// export function registerForVrender() {
//   if (registed) {
//     return;
//   }
//   registed = true;
//   // 注册内置组件
//   preLoadAllModule();

//   if (isBrowserEnv()) {
//     loadBrowserEnv(container);
//   } else if (isNodeEnv()) {
//     loadNodeEnv(container);
//   }
//   registerArc();
//   registerArc3d();
//   registerArea();
//   registerCircle();
//   registerGlyph();
//   registerGroup();
//   registerImage();
//   registerLine();
//   registerPath();
//   registerPolygon();
//   registerPyramid3d();
//   registerRect();
//   registerRect3d();
//   registerRichtext();
//   registerShadowRoot();
//   registerSymbol();
//   registerText();
//   registerWrapText();
// }

// export * from '@visactor/vrender-core';
// export * from '@visactor/vrender-kits';

// only for vtable-used-in-vrender-bugserver.js
// export { Direction, version } from '@visactor/vrender';
export * from '@visactor/vrender';
export { ticks } from '@visactor/vrender-components';

export function registerForVrender() {
  // do nothing
}
