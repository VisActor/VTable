import type { CellAddress, EditContext, IEditor, RectProps } from './types';
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

  constructor(editorConfig?: InputEditorConfig) {
    this.editorConfig = editorConfig;
  }

  createElement() {
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
    this.element = input;
    this.container.appendChild(input);

    // 监听键盘事件
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        // 阻止冒泡  防止处理成表格全选事件
        e.stopPropagation();
      }
    });

    // hack for preventing drag touch cause page jump
    input.addEventListener('wheel', e => {
      e.preventDefault();
    });
  }

  setValue(value: string) {
    this.element.value = typeof value !== 'undefined' ? value : '';
  }

  getValue() {
    return this.element.value;
  }

  onStart({ value, referencePosition, container, endEdit }: EditContext<string>) {
    this.container = container;
    this.successCallback = endEdit;
    if (!this.element) {
      this.createElement();

      if (value !== undefined && value !== null) {
        this.setValue(value);
      }
      if (referencePosition?.rect) {
        this.adjustPosition(referencePosition.rect);
      }
    }
    this.element.focus();
    // do nothing
  }

  adjustPosition(rect: RectProps) {
    this.element.style.top = rect.top + 'px';
    this.element.style.left = rect.left + 'px';
    this.element.style.width = rect.width + 'px';
    this.element.style.height = rect.height + 'px';
  }

  endEditing() {
    // do nothing
  }

  onEnd() {
    // do nothing
    if (this.container?.contains(this.element)) {
      this.container.removeChild(this.element);
    }
    this.element = undefined;
  }

  isEditorElement(target: HTMLElement) {
    return target === this.element;
  }

  validateValue(newValue?: any, oldValue?: any, position?: CellAddress, table?: any): boolean | ValidateEnum {
    return true;
  }
}
