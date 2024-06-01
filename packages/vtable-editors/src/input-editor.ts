import type { EditContext, IEditor, Placement, RectProps } from './types';

type InputEditorType = 'input' | 'textArea';

export interface InputEditorConfig {
  max?: number;
  min?: number;
  readonly?: boolean;
  editorType?: InputEditorType;
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
    let _editorType = 'input';
    if (this.editorConfig?.editorType === 'textArea') {
      _editorType = 'textarea';
    }
    const input = document.createElement(_editorType) as HTMLInputElement;
    input.setAttribute('type', 'text');
    if ('readonly' in this.editorConfig) {
      input.setAttribute('readonly', `${this.editorConfig.readonly}`);
    }
    if (this.editorConfig?.editorType === 'textArea') {
      input.style.height = '100%';
      input.style.resize = 'none';
    }
    input.style.position = 'absolute';
    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    this.element = input;

    this.container.appendChild(input);

    // 监听键盘事件
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      const _isSelectAll = e.key === 'a' && (e.ctrlKey || e.metaKey);
      const _isTextAreaNewLine = e.key === 'Enter' && e.shiftKey && this.editorConfig?.editorType === 'textArea';
      if (_isSelectAll || _isTextAreaNewLine) {
        // 阻止冒泡  防止处理成表格全选事件
        e.stopPropagation();
      }
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
    this.container.removeChild(this.element);
    this.element = undefined;
  }

  isEditorElement(target: HTMLElement) {
    return target === this.element;
  }
}
