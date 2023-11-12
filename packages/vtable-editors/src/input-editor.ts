import { BaseEditor } from './base-editor';
export interface InputEditorConfig {
  max?: number;
  min?: number;
}

export class InputEditor extends BaseEditor {
  editorType: string = 'Input';
  input: HTMLInputElement;
  constructor(editorConfig: InputEditorConfig) {
    super();
    this.editorConfig = editorConfig;
  }
  createElement(container: HTMLElement) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.style.position = 'absolute';
    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    this.input = input;

    container.appendChild(input);
  }
  setValue(value: string) {
    this.input.value = typeof value !== 'undefined' ? value : '';
  }
  getValue() {
    return this.input.value;
  }
  beginEditing(
    container: HTMLElement,
    rect: { top: number; left: number; width: number; height: number },
    value?: string
  ) {
    console.log('input', 'beginEditing');
    this.createElement(container);
    if (value) {
      this.setValue(value);
    }
    this.adjustPosition(rect);
    // do nothing
  }
  adjustPosition(rect: { top: number; left: number; width: number; height: number }) {
    this.input.style.top = rect.top + 'px';
    this.input.style.left = rect.left + 'px';
    this.input.style.width = rect.width + 'px';
    this.input.style.height = rect.height + 'px';
  }
  endEditing() {
    // do nothing
  }

  exit() {
    // do nothing
  }
}
