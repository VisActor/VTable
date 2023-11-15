import type { IEditor, Placement, RectProps } from './types';
export interface ListEditorConfig {
  values: string[];
}

export class ListEditor implements IEditor {
  editorType: string = 'Input';
  input: HTMLInputElement;
  editorConfig: ListEditorConfig;
  container: HTMLElement;
  successCallback: Function;
  constructor(editorConfig: ListEditorConfig) {
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
  bindSuccessCallback(success: Function) {
    this.successCallback = success;
  }
}
