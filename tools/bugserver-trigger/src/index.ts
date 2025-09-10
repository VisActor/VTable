import * as VTable from '@visactor/vtable';
import * as VRender from '@visactor/vtable/es/vrender';
import * as VTableEditors from '@visactor/vtable-editors';
import * as VTableGantt from '@visactor/vtable-gantt';
import * as VTablePlugins from '@visactor/vtable-plugins';
// import * as VTableSheet from '@visactor/vtable-sheet';

// @ts-ignore
window.VTable = { ...VTable, editors: VTableEditors };
// @ts-ignore
window.VTableEditors = VTableEditors;
// @ts-ignore
window.VTableGantt = VTableGantt;
// // @ts-ignore
// window.VTableSheet = VTableSheet;
// @ts-ignore
window.VTablePlugins = VTablePlugins;
// @ts-ignore
window.VRender = VRender;

export default {
  VTable,
  VTableEditors,
  VTableGantt,
  VTablePlugins,
  VRender
};

// export const a = 'a';
// export const b = 'b';

// global.a = a;
// global.b = b;
