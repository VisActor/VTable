import { BaseEditor } from './base-editor';
export interface ListEditorConfig {
  values?: string[];
}

export class ListEditor extends BaseEditor {
  editorType: string = 'Input';
  editorConfig: ListEditorConfig;
  input: HTMLInputElement;
  constructor(editorConfig: ListEditorConfig) {
    super();
    this.editorConfig = editorConfig;
  }
  createElement() {
    // do nothing
  }
  setValue(value: string) {
    // do nothing
  }
  getValue() {
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
