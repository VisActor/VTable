import type { EditContext, IEditor, RectProps } from './types';

export interface TextAreaEditorConfig {
  readonly?: boolean;
}

export class TextAreaEditor implements IEditor {
  editorType: string = 'TextArea';
  editorConfig: TextAreaEditorConfig;
  container: HTMLElement;
  successCallback?: () => void;
  element?: HTMLTextAreaElement;

  constructor(editorConfig?: TextAreaEditorConfig) {
    this.editorConfig = editorConfig || {};
  }

  createElement() {
    const input = document.createElement('textArea') as HTMLTextAreaElement;
    if (this.editorConfig?.readonly) {
      input.setAttribute('readonly', `${this.editorConfig.readonly}`);
    }
    input.style.resize = 'none';
    input.style.position = 'absolute';
    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.height = '100%';
    input.style.boxSizing = 'border-box';
    input.style.backgroundColor = '#FFFFFF';

    this.element = input;

    this.container.appendChild(input);

    // 监听键盘事件
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      const _isSelectAll = e.key === 'a' && (e.ctrlKey || e.metaKey);
      const _isTextAreaNewLine = e.key === 'Enter' && e.shiftKey;
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
