import { register } from '@visactor/vtable';
import { isValid } from '@visactor/vutils';
import { DynamicRenderEditor } from './editor';
import { DYNAMIC_RENDER_EDITOR } from '../constants';

/**
 * @description: 校验动态渲染式编辑器
 * @param {any} column
 * @param {any} getEditCustomNode
 * @return {*}
 */
export function checkRenderEditor(column: any, getEditCustomNode?: any) {
  const { editor } = column || {};
  const key = getRenderEditorColumnKeyField(column);
  if (!isValid(key) || editor !== DYNAMIC_RENDER_EDITOR) {
    return false;
  }
  if (typeof getEditCustomNode === 'function') {
    column.getEditCustomNode = getEditCustomNode;
    // 处理子列
    if (Array.isArray(column.columns) && column.columns.length) {
      for (const childColumn of column.columns) {
        checkRenderEditor(childColumn, getEditCustomNode);
      }
    }
    return true;
  }
  return typeof column.getEditCustomNode === 'function';
}

/**
 * @description: 获取渲染式编辑器的列配置主键
 * @param {any} column
 * @return {*}
 */
export function getRenderEditorColumnKeyField(column: any) {
  const { field, key } = column || {};
  // 兼容取 field
  return isValid(key) ? key : field;
}

/**
 * @description: 获取动态渲染式编辑器
 * @param {boolean} create
 * @param {any} currentContext
 * @return {*}
 */
export function getRenderEditor(create?: boolean, currentContext?: any) {
  let renderEditor = register.editor(DYNAMIC_RENDER_EDITOR) as DynamicRenderEditor;
  if (!renderEditor && !!create) {
    // 注册自定义编辑器
    renderEditor = new DynamicRenderEditor(currentContext);
    register.editor(DYNAMIC_RENDER_EDITOR, renderEditor);
  }
  return renderEditor;
}
