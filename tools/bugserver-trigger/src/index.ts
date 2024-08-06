import * as VTable from '@visactor/vtable';
import * as VTableEditors from '@visactor/vtable-editors';
import * as VTableGantt from '@visactor/vtable-gantt';

// @ts-ignore
window.VTable = VTable;
// @ts-ignore
window.VTableEditors = VTableEditors;
// @ts-ignore
window.VTableGantt = VTableGantt;

export default {
  VTable,
  VTableEditors,
  VTableGantt
};

// export const a = 'a';
// export const b = 'b';

// global.a = a;
// global.b = b;
