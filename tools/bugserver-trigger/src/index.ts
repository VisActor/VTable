import * as VTable from '@visactor/vtable';
import * as VRender from '@visactor/vtable/es/vrender';
import { createStageFromVRenderApp } from '@visactor/vtable/es/vrender-app';
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
const currentBundleUrl = (window.document.currentScript as HTMLScriptElement | null)?.src;
// Invoked by Bugserver photo case 6ab1ded722ae4f0047df39bd before its required screenshot.
// @ts-ignore
window.ReactVTableTest = {
  bundleUrl: currentBundleUrl,
  runDetachedCustomLayoutComponents() {
    const testReconciler = reconcilor as typeof reconcilor & {
      flushSyncWork?: () => unknown;
      flushPassiveEffects?: () => unknown;
    };

    [React.createElement(Link, null, 'View'), React.createElement(Button, null, 'Open')].forEach(component => {
      const detachedGroup = new VRender.Group({});
      const container = createReconcilerContainer(detachedGroup);
      const canvas = window.document.createElement('canvas');
      const { stage, releaseAppRef } = createStageFromVRenderApp(
        {
          canvas,
          width: 200,
          height: 80
        },
        { mode: 'browser', scope: 'react-custom-layout-components' }
      );

      try {
        testReconciler.updateContainer(component, container, null);
        testReconciler.flushSyncWork?.();
        testReconciler.flushPassiveEffects?.();

        const graphic = detachedGroup.firstChild;
        if (!graphic) {
          throw new Error('Custom layout component did not create a graphic');
        }
        if (graphic.stage) {
          throw new Error('Custom layout component was attached to a stage before its group was mounted');
        }

        stage.defaultLayer.add(detachedGroup as unknown as Parameters<typeof stage.defaultLayer.add>[0]);
        stage.render();

        if (graphic.stage !== stage) {
          throw new Error('Custom layout component was not attached to the rendered stage');
        }
      } finally {
        testReconciler.updateContainer(null, container, null);
        testReconciler.flushSyncWork?.();
        testReconciler.flushPassiveEffects?.();
        stage.release();
        releaseAppRef();
      }
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
