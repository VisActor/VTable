export class BaseEditor {
  editorType: string;
  constructor() {
    this.editorType = 'base';
  }
  createElement() {
    // do nothing
  }
  setValue(value: string) {
    // do nothing
  }
  getEditorValue() {
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
