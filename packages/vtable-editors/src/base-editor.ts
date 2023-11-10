import type { IEditor } from './types';

export class BaseEditor implements IEditor {
  editorType: string;
  editorConfig: any;
  constructor() {
    this.editorType = 'base';
  }
  createElement() {
    // do nothing
  }
  setValue(value: string) {
    // do nothing
  }
  getValue() {
    return '';
  }
  beginEditing() {
    // do nothing
  }
  endEditing() {
    // do nothing
  }

  exit(): void {
    // do nothing
  }
}
