import { isValid } from '@visactor/vutils';
import type { Ref, VNode } from 'vue';
import { h, isVNode, customRef, render } from 'vue';
import { TYPES } from '@visactor/vtable';
import type { RectProps } from '@visactor/vtable/es/ts-types/common';

/** 渲染式编辑器参数 */
export interface DynamicRenderEditorParams {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 值 */
  value: any;
  /** 响应式值 供 v-model 绑定 */
  refValue: Ref<any>;
  /** 行数据 */
  record: any;
  /** 表格实例 */
  table: any;
  /** 设置值方法 */
  onChange: (value: any) => void;
}

/** 渲染式编辑器配置 */
export interface DynamicRenderEditorConfig {
  /** 进入编辑前的校验方法 */
  editBefore?: (editorContext?: any) => boolean | Promise<boolean>;
  /** 禁用时的提示文字 */
  disablePrompt?: string;
  /** 值校验方法 */
  validateValue?: (params?: ValidateValueParams) => boolean | Promise<boolean>;
  /** 值无效时的提示文字 */
  invalidPrompt?: string;
}

/** 值校验方法参数 */
export interface ValidateValueParams {
  /** 行索引 */
  row: number;
  /** 列索引 */
  col: number;
  /** 当前值 */
  value?: any;
  /** 原本值 */
  oldValue?: any;
  /** 表格实例 */
  table?: any;
}

/** 必要列配置 */
interface ColumnDefine {
  /** 列唯一标识 */
  key?: string;
  /** 渲染式编辑器配置 */
  editConfig?: DynamicRenderEditorConfig;
}

/**
 * @description: 自定义渲染式编辑器
 */
export class DynamicRenderEditor {
  /** 包裹容器 */
  wrapContainer: HTMLElement;
  /** 表格容器 */
  tableContainer: HTMLElement | null;
  /** 暂存值 */
  currentValue: string | null;
  /** 节点 map */
  nodeMap?: Map<string | number, Map<string | number, (params: DynamicRenderEditorParams) => any>>;
  /** 当前上下文 */
  currentContext?: any;

  constructor(currentContext?: any) {
    this.currentContext = currentContext;
    this.tableContainer = null;
    this.currentValue = null;
    this.wrapContainer = null;
    this.nodeMap = new Map();
  }

  registerNode(
    tableId?: string | number,
    key?: string | number,
    getNode?: () => (params: DynamicRenderEditorParams) => any
  ) {
    if (!isValid(tableId) || !isValid(key) || typeof getNode !== 'function') {
      return;
    }
    if (!this.nodeMap.has(tableId)) {
      this.nodeMap.set(tableId, new Map());
    }
    this.nodeMap.get(tableId).set(key, getNode);
  }

  getNode(tableId?: string | number, key?: string | number) {
    return this.nodeMap.get(tableId)?.get(key);
  }

  removeNode(tableId: string | number) {
    this.nodeMap.delete(tableId);
  }

  release(tableId?: string | number) {
    if (!isValid(tableId)) {
      this.nodeMap.clear();
    } else {
      this.removeNode(tableId);
    }
  }

  async onStart(editorContext: any) {
    const { value } = editorContext;
    // 先设置初始值(因为校验不通过也会走正常流程)
    this.setValue(value);
    if (!(await this.createElement(editorContext))) {
      return;
    }
  }

  async createElement(editorContext: any) {
    const { row, col, value, table, container, referencePosition } = editorContext;
    if (!container) {
      return false;
    }
    const define = table.getBodyColumnDefine(col, row) as ColumnDefine;
    const { editConfig } = define || {};
    const { id } = table;
    const key = this.getColumnKeyField(define);
    if (!isValid(key) || !isValid(id)) {
      return false;
    }
    if (typeof editConfig?.editBefore === 'function') {
      // 编辑前校验
      const v = await editConfig.editBefore(editorContext);
      if (!v) {
        table.showTooltip(col, row, {
          // TODO 多语言
          content: editConfig.disablePrompt || 'This field is not allowed to be edited',
          referencePosition: { rect: referencePosition?.rect, placement: TYPES.Placement.top },
          style: {
            bgColor: 'black',
            color: 'white',
            arrowMark: true
          },
          disappearDelay: 1000
        });
        return false;
      }
    }
    const record = table?.getCellOriginRecord(col, row);
    const renderVNodeFn = this.getNode(id, key);
    if (!renderVNodeFn) {
      return false;
    }
    const vnode = h(renderVNodeFn, {
      row,
      col,
      value,
      refValue: customRef((track, trigger) => {
        return {
          get: () => {
            track();
            return this.getValue();
          },
          set: value => {
            this.setValue(value);
            trigger();
          }
        };
      }),
      record,
      table,
      onChange: (value: any) => this.setValue(value)
    });
    if (!vnode || !isVNode(vnode)) {
      return false;
    }
    this.checkToPassAppContext(vnode, table);
    // 创建包裹容器
    const wrapContainer = document.createElement('div');
    wrapContainer.style.position = 'absolute';
    wrapContainer.style.width = '100%';
    wrapContainer.style.boxSizing = 'border-box';
    const { bgColor } = table.getCellStyle(col, row) || {};
    wrapContainer.style.backgroundColor = bgColor || '#FFFFFF';
    this.wrapContainer = wrapContainer;
    this.tableContainer = container;
    this.tableContainer.appendChild(wrapContainer);
    render(vnode, wrapContainer);

    // 位置同步
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    return true;
  }
  /**
   * @description: 校验并传递上下文
   * @param {VNode} vnode
   * @param {any} table
   * @return {*}
   */
  checkToPassAppContext(vnode: VNode, table: any) {
    try {
      const userAppContext = table.options?.customConfig?.getVueUserAppContext?.() ?? this.currentContext;
      // 简单校验合法性
      if (!!userAppContext?.components && !!userAppContext?.directives) {
        vnode.appContext = userAppContext;
      }
    } catch (error) {}
  }
  /**
   * @description: 获取渲染式编辑器的列配置主键
   * @param {any} column
   * @return {*}
   */
  getColumnKeyField(column: any) {
    const { field, key } = column || {};
    // 兼容取 field
    return isValid(key) ? key : field;
  }

  getValue() {
    return this.currentValue;
  }

  setValue(value: any) {
    this.currentValue = value;
  }

  adjustPosition(rect: RectProps) {
    if (this.wrapContainer) {
      this.wrapContainer.style.top = `${rect.top}px`;
      this.wrapContainer.style.left = `${rect.left}px`;
      this.wrapContainer.style.width = `${rect.width}px`;
      this.wrapContainer.style.height = `${rect.height}px`;
    }
  }

  async validateValue(
    value?: any,
    oldValue?: any,
    editCell?: { col: number; row: number },
    table?: any
  ): Promise<boolean> {
    const { col, row } = editCell || {};
    if (!isValid(col) || !isValid(row)) {
      return true;
    }
    const define = table.getBodyColumnDefine(col, row) as ColumnDefine;
    const { editConfig } = define || {};
    if (typeof editConfig?.validateValue === 'function') {
      const validate = await editConfig.validateValue({ col, row, value, oldValue, table });
      if (validate === false) {
        const rect = table.getVisibleCellRangeRelativeRect({ col, row });
        table.showTooltip(col, row, {
          content: editConfig.invalidPrompt || 'invalid',
          referencePosition: { rect, placement: TYPES.Placement.top },
          style: {
            bgColor: 'red',
            color: 'white',
            arrowMark: true
          },
          disappearDelay: 1000
        });
        return false;
      }
      return validate;
    }
    return true;
  }

  onEnd() {
    if (this.wrapContainer && this.tableContainer) {
      render(null, this.wrapContainer);
      this.tableContainer.removeChild(this.wrapContainer);
    }
    this.wrapContainer = null;
    this.tableContainer = null;
  }

  isEditorElement(target: HTMLElement) {
    return this.wrapContainer?.contains(target) || this.isClickEditorElement(target);
  }

  isClickEditorElement(target: HTMLElement) {
    while (target) {
      // 约定的类名
      if (target.classList && target.classList.contains('table-editor-element')) {
        return true;
      }
      target = target.parentNode as HTMLElement;
    }
    return false;
  }
}
