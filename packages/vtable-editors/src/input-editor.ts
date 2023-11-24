import type { IEditor, Placement, RectProps } from './types';
export interface InputEditorConfig {
  max?: number;
  min?: number;
}

export class InputEditor implements IEditor {
  editorType: string = 'Input';
  editorConfig: InputEditorConfig;
  container: HTMLElement;
  declare element: HTMLInputElement;
  constructor(editorConfig?: InputEditorConfig) {
    this.editorConfig = editorConfig;
  }
  createElement() {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.style.position = 'absolute';
    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    this.element = input;

    this.container.appendChild(input);
  }
  setValue(value: string) {
    this.element.value = typeof value !== 'undefined' ? value : '';
  }
  getValue() {
    return this.element.value;
  }
  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
    console.log('input', 'beginEditing---- ');
    this.container = container;

    this.createElement();
    if (value) {
      this.setValue(value);
    }
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
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

  exit() {
    // do nothing
    this.container.removeChild(this.element);
  }
  targetIsOnEditor(target: HTMLElement) {
    if (target === this.element) {
      return true;
    }
    return false;
  }
}
