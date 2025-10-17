import * as VTable from '@visactor/vtable';
import * as VRender from '@visactor/vtable/es/vrender';
import * as VTableEditors from '@visactor/vtable-editors';
import * as VTableGantt from '@visactor/vtable-gantt';
import {
  // 高亮相关
  FocusHighlightPlugin,
  HighlightHeaderWhenSelectCellPlugin,

  // 行列操作
  AddRowColumnPlugin,
  TableSeriesNumber,
  PasteAddRowColumnPlugin,

  // 键盘和交互
  ExcelEditCellKeyboardPlugin,

  // 图表相关
  rotate90WithTransform,

  // 上下文菜单和过滤
  ContextMenuPlugin,
  FilterPlugin,

  // 其他功能
  AutoFillPlugin,
  MasterDetailPlugin
} from '@visactor/vtable-plugins';
import * as VTableSheet from '@visactor/vtable-sheet';

// @ts-ignore
window.VTable = { ...VTable, editors: VTableEditors };
// @ts-ignore
window.VTableEditors = VTableEditors;
// @ts-ignore
window.VTableGantt = VTableGantt;
// @ts-ignore
window.VTableSheet = VTableSheet;
// 创建一个新对象，不包含问题模块
const VTablePlugins = {
  // 高亮相关
  FocusHighlightPlugin,
  HighlightHeaderWhenSelectCellPlugin,
  // 行列操作
  AddRowColumnPlugin,
  TableSeriesNumber,
  PasteAddRowColumnPlugin,
  // 键盘和交互
  ExcelEditCellKeyboardPlugin,
  // 图表相关
  rotate90WithTransform,
  // 上下文菜单和过滤
  ContextMenuPlugin,
  FilterPlugin,
  // 其他功能
  AutoFillPlugin,
  MasterDetailPlugin
};

// @ts-ignore
window.VTablePlugins = VTablePlugins;
// @ts-ignore
window.VRender = VRender;

export default {
  VTable,
  VTableEditors,
  VTableGantt,
  VTablePlugins,
  VTableSheet,
  VRender
};

// export const a = 'a';
// export const b = 'b';

// global.a = a;
// global.b = b;
