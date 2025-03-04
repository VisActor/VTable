/*
 * @Author: lym
 * @Date: 2025-02-28 16:55:22
 * @LastEditors: lym
 * @LastEditTime: 2025-03-03 20:17:33
 * @Description: 集成编辑器工具方法
 */

import { VTable } from '..';
import { DynamicRenderEditor } from './editor';
import { isValid } from '@visactor/vutils';

/** 动态渲染编辑器名称 */
const DYNAMIC_RENDER_EDITOR = 'dynamic-render-editor';

/**
 * @description: 动态渲染式编辑器
 * @param {any} table
 * @param {VTable} option
 * @return {*}
 */
export function resolveRenderEditor(table: any, option: VTable.ListTableConstructorOptions) {
  if (!isValid(table?.id) || !option?.columns?.length) {
    return;
  }
  const { id } = table;
  // 移除原本已存在的编辑器
  const rawRenderEditor = getRenderEditor();
  if (rawRenderEditor) {
    rawRenderEditor.removeNode(id);
  }
  if (option.columns.some(x => checkRenderEditor(x))) {
    // 需要注册编辑器
    const renderEditor = rawRenderEditor || getRenderEditor(true);
    option.columns.forEach((column: any) => {
      if (!checkRenderEditor(column)) {
        return;
      }
      const { key, getEditCustomNode } = column;
      renderEditor.registerNode(id, key, getEditCustomNode);
      delete column.editCustomNode;
    });
  }
}

/**
 * @description: 校验动态渲染式编辑器
 * @param {any} column
 * @param {any} getEditCustomNode
 * @return {*}
 */
export function checkRenderEditor(column: any, getEditCustomNode?: any) {
  const { key, editor } = column || {};
  if (!isValid(key) || editor !== DYNAMIC_RENDER_EDITOR) {
    return false;
  }
  if (typeof getEditCustomNode === 'function') {
    column.getEditCustomNode = getEditCustomNode;
    return true;
  }
  return typeof column.getEditCustomNode === 'function';
}

/**
 * @description: 获取动态渲染式编辑器
 * @param {boolean} create
 * @return {*}
 */
function getRenderEditor(create?: boolean) {
  let renderEditor = VTable.register.editor(DYNAMIC_RENDER_EDITOR) as DynamicRenderEditor;
  if (!renderEditor && !!create) {
    // 注册自定义编辑器
    renderEditor = new DynamicRenderEditor();
    VTable.register.editor(DYNAMIC_RENDER_EDITOR, renderEditor);
  }
  return renderEditor;
}

/**
 * @description: 释放动态渲染式编辑器
 * @param {number} tableId
 * @return {*}
 */
export function releaseRenderEditor(tableId?: number | string) {
  const renderEditor = getRenderEditor();
  renderEditor?.release(tableId);
}
