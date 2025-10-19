import type { Ref } from 'vue';
import { computed, onBeforeUnmount, watchEffect, getCurrentInstance } from 'vue';
import { isArray, isObject, isValid } from '@visactor/vutils';
import { checkRenderEditor, getRenderEditor, getRenderEditorColumnKeyField } from '../edit';

/**
 * 编辑渲染器
 * @param props
 * @param tableRef
 */
export function useEditorRender(props: any, tableRef: Ref) {
  /** 当前实例 */
  const instance = getCurrentInstance();
  /** 需要渲染编辑器的列 */
  const validColumns = computed(() => {
    const columns = flattenColumns(props.options?.columns || []);
    if (!isArray(columns)) {
      return [];
    }
    return (columns as any[]).filter(col => !!isObject(col) && !!checkRenderEditor(col));
  });
  watchEffect(() => {
    resolveRenderEditor();
  });
  onBeforeUnmount(() => {
    releaseRenderEditor();
  });
  /**
   * @description: 动态渲染式编辑器
   * @return {*}
   */
  function resolveRenderEditor() {
    const id = getTableId();
    if (!isValid(id)) {
      return;
    }
    // 移除原本已存在的编辑器
    let renderEditor = getRenderEditor();
    if (renderEditor) {
      renderEditor.removeNode(id);
    } else if (validColumns.value.length > 0) {
      // 注册编辑器
      renderEditor = getRenderEditor(true, instance?.appContext);
    }
    validColumns.value.forEach(column => {
      const { getEditCustomNode } = column;
      const key = getRenderEditorColumnKeyField(column);
      renderEditor.registerNode(id, key, getEditCustomNode);
      delete column.editCustomNode;
    });
  }
  /**
   * @description: 释放动态渲染式编辑器
   * @return {*}
   */
  function releaseRenderEditor() {
    const id = getTableId();
    if (!isValid(id)) {
      return;
    }
    const renderEditor = getRenderEditor();
    renderEditor?.release(id);
  }
  /**
   * @description: 获取表格 id
   * @return {*}
   */
  function getTableId() {
    return tableRef.value?.id;
  }
}

/**
 * @description: 获取所有扁平化的 columns
 * @param {any} columns
 */
function flattenColumns(columns: any[]): any[] {
  return columns.flatMap(column => (Array.isArray(column.columns) ? flattenColumns(column.columns) : column));
}
