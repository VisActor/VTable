import * as VTable from '@visactor/vtable';
import * as VRender from '@visactor/vtable/es/vrender';
import * as React from 'react';
import { Button } from '../../../packages/react-vtable/es/components/button/button';
import { Link } from '../../../packages/react-vtable/es/components/link/link';
import {
  createReconcilerContainer,
  reconcilor
} from '../../../packages/react-vtable/es/table-components/custom/reconciler';
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
// @ts-ignore
window.ReactVTableTest = {
  runDetachedCustomLayoutComponents() {
    const testReconciler = reconcilor as typeof reconcilor & {
      flushSyncWork?: () => unknown;
      flushPassiveEffects?: () => unknown;
    };

    [React.createElement(Link, null, 'View'), React.createElement(Button, null, 'Open')].forEach(component => {
      const detachedGroup = new VRender.Group({});
      const container = createReconcilerContainer(detachedGroup);
      testReconciler.updateContainer(component, container, null);
      testReconciler.flushSyncWork?.();
      testReconciler.flushPassiveEffects?.();
      testReconciler.updateContainer(null, container, null);
      testReconciler.flushSyncWork?.();
      testReconciler.flushPassiveEffects?.();
    });
  }
};

export default {
  React,
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
