import { BaseEditor } from './base-editor';
export interface InputEditorConfig {
  max?: number;
  min?: number;
}

export class InputEditor extends BaseEditor {
  editorType: string = 'Input';
  editorConfig: InputEditorConfig;
  input: HTMLInputElement;
  constructor(editorConfig: InputEditorConfig) {
    super();
    this.editorConfig = editorConfig;
  }
  createElement() {
    const input = document.createElement('input');

    input.setAttribute('type', 'text');

    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    this.input = input;
  }
  setValue(value: string) {
    this.input.value = typeof value !== 'undefined' ? value : '';
  }
  getEditorValue() {
    return this.input.value;
  }
  beginEditing() {
    // do nothing
  }
  endEditing() {
    // do nothing
  }

  exit() {
    // do nothing
  }
}
