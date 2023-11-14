import { BaseEditor } from './base-editor';
import type { Placement, RectProps } from './types';
export interface ListEditorConfig {
  values: string[];
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
  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
    // do nothing
  }
  endEditing() {
    // do nothing
  }

  exit() {
    // do nothing
  }
  targetIsOnEditor(target: HTMLElement) {
    //
    return false;
  }
}
