import { BaseEditor } from './base-editor';
export interface ListEditorConfig {
  values?: string[];
}

export class ListEditor extends BaseEditor {
  editorType: string = 'Input';
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
  beginEditing(
    container: HTMLElement,
    rect: { top: number; left: number; width: number; height: number },
    value?: string
  ) {
    // do nothing
  }
  endEditing() {
    // do nothing
  }

  exit() {
    // do nothing
  }
}
