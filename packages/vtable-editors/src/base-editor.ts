import type { InputEditorConfig } from './input-editor';
import type { ListEditorConfig } from './list-editor';
import type { IEditor } from './types';

export class BaseEditor implements IEditor {
  editorType: string;
  editorConfig: ListEditorConfig | InputEditorConfig;
  constructor() {
    this.editorType = 'base';
  }
  createElement(container: HTMLElement) {
    // do nothing
  }
  setValue(value: string) {
    // do nothing
  }
  getValue() {
    return '';
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

  exit(): void {
    // do nothing
  }
}
