import type { CellAddress, EditContext, IEditor, PrepareEditContext, RectProps } from './types';
import type { ValidateEnum } from './types';

export interface InputEditorConfig {
  readonly?: boolean;
}

export class InputEditor implements IEditor {
  editorType: string = 'Input';
  editorConfig: InputEditorConfig;
  container: HTMLElement;
  successCallback?: () => void;
  element?: HTMLInputElement;
  table?: any;
  col?: number;
  row?: number;
  // 存储事件处理器，用于在移除元素前解绑
  protected eventHandlers: Array<{ type: string; handler: EventListener }> = [];
  constructor(editorConfig?: InputEditorConfig) {
    this.editorConfig = editorConfig;
  }
  getInputElement(): HTMLInputElement {
    return this.element;
  }

  createElement() {
    // 清空之前的事件处理器（如果存在）
    this.eventHandlers = [];

    const input = document.createElement('input');
    input.setAttribute('type', 'text');

    if (this.editorConfig?.readonly) {
      input.setAttribute('readonly', `${this.editorConfig.readonly}`);
    }

    input.style.position = 'absolute';
    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.backgroundColor = '#FFFFFF';
    input.style.borderRadius = '0px';
    input.style.border = '2px solid #d9d9d9';
    // #region 为了保证input在focus时，没有圆角
    const focusHandler = () => {
      input.style.borderColor = '#4A90E2';
      input.style.outline = 'none';
    };
    input.addEventListener('focus', focusHandler);
    this.eventHandlers.push({ type: 'focus', handler: focusHandler });

    const blurHandler: EventListener = (e: Event) => {
      input.style.borderColor = '#d9d9d9';
      // input.style.boxShadow = 'none';
      if (this.table && this.element && this.element.style.opacity === '0') {
        const selectCell = this.table.stateManager.select.cellPos;
        if (selectCell.col !== this.col || selectCell.row !== this.row) {
          this.onEnd();
        }
      }
    };
    input.addEventListener('blur', blurHandler);
    this.eventHandlers.push({ type: 'blur', handler: blurHandler });
    // #endregion
    this.element = input;
    this.container.appendChild(input);

    // 监听键盘事件
    const keydownHandler: EventListener = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (
        keyboardEvent.key === 'a' &&
        (keyboardEvent.ctrlKey || keyboardEvent.metaKey) &&
        this.table.editorManager?.editingEditor
      ) {
        // 阻止冒泡  防止处理成表格全选事件
        keyboardEvent.stopPropagation();
      }
    };
    input.addEventListener('keydown', keydownHandler);
    this.eventHandlers.push({ type: 'keydown', handler: keydownHandler });

    // hack for preventing drag touch cause page jump
    const wheelHandler: EventListener = (e: Event) => {
      e.preventDefault();
    };
    input.addEventListener('wheel', wheelHandler);
    this.eventHandlers.push({ type: 'wheel', handler: wheelHandler });

    const pasteHandler: EventListener = (e: Event) => {
      const pasteEvent = e as ClipboardEvent;
      // 在prepare阶段（opacity为'0'时）禁止粘贴
      if (this.element.style.opacity === '0') {
        pasteEvent.preventDefault();
      }
    };
    input.addEventListener('paste', pasteHandler);
    this.eventHandlers.push({ type: 'paste', handler: pasteHandler });
  }

  setValue(value: string) {
    this.element.value = typeof value !== 'undefined' ? value : '';
  }

  getValue() {
    return this.element.value;
  }
  /**
   * 如果表格编辑时机配置editCellTrigger为keydown，则需要调用prepareEdit来准备编辑环境，否则中文输入法第一个字符会被当做英文字符
   * @param param0
   */
  prepareEdit({ referencePosition, container, table, col, row }: PrepareEditContext<string>) {
    this.container = container;
    this.table = table;
    this.col = col;
    this.row = row;
    const selectCell = this.table.stateManager.select.cellPos;
    if (selectCell.col !== this.col || selectCell.row !== this.row) {
      return;
    }
    if (!this.element) {
      this.createElement();
    } else {
      if (!container.contains(this.element)) {
        this.element.parentElement.removeChild(this.element);
        this.container.appendChild(this.element);
      }
    }
    this.element.style.opacity = '0';
    //这个pointerEvents = 'none'很重要，如果没有的话会引起vtable.getElement()元素和这里的element元素的focus和blur的切换，
    //也会引起mouseleave_table mouseleave_cell和mouseenter的切换
    this.element.style.pointerEvents = 'none';
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.element.focus();
  }
  onStart({ value, referencePosition, container, endEdit, table, col, row }: EditContext<string>) {
    this.container = container;
    this.successCallback = endEdit;
    this.table = table;
    this.col = col;
    this.row = row;
    if (!this.element) {
      this.createElement();
      if (referencePosition?.rect) {
        this.adjustPosition(referencePosition.rect);
      }
    } else {
      if (!container.contains(this.element)) {
        this.element.parentElement.removeChild(this.element);
        this.container.appendChild(this.element);
      }
    }
    if (value !== undefined && value !== null) {
      this.setValue(value);
    }
    //防止调用过prepareEdit 后，元素的显示和可操作性被影响
    this.element.style.opacity = '1';
    this.element.style.pointerEvents = 'auto';
    this.element.focus();
    // do nothing
  }

  adjustPosition(rect: RectProps) {
    //使border均分input位置rect的上下左右
    const borderWidth = 2;
    const top = rect.top - borderWidth / 2;
    const left = rect.left - borderWidth / 2;
    const width = rect.width + borderWidth;
    const height = rect.height + borderWidth;

    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
  }

  endEditing() {
    // do nothing
  }

  onEnd() {
    // do nothing
    if (!this.element) {
      return;
    }

    // 保存元素引用，避免在移除过程中被其他代码修改
    const element = this.element;

    // 先移除所有事件监听器，避免在 removeChild 时触发 blur 等事件
    this.eventHandlers.forEach(({ type, handler }) => {
      element.removeEventListener(type, handler);
    });
    this.eventHandlers = [];

    // 检查元素的父节点是否存在，确保元素还在 DOM 中
    const parentNode = element.parentNode;
    if (parentNode) {
      try {
        // 事件监听器已经移除，可以安全地移除元素，不会触发 blur 等事件
        parentNode.removeChild(element);
      } catch (error) {
        // 如果元素已经被移除或移动，忽略 NotFoundError
        if (error instanceof Error && error.name !== 'NotFoundError') {
          throw error;
        }
      }
    }

    // 清空引用
    this.element = undefined;
  }

  isEditorElement(target: HTMLElement) {
    return target === this.element;
  }

  validateValue(newValue?: any, oldValue?: any, position?: CellAddress, table?: any): boolean | ValidateEnum {
    return true;
  }
}
