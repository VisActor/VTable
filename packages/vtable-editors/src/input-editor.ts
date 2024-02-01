import type { EditContext, IEditor, Placement, RectProps } from './types';

export interface InputEditorConfig {
  max?: number;
  min?: number;
}

export class InputEditor implements IEditor {
  editorType: string = 'Input';
  editorConfig: InputEditorConfig;
  container: HTMLElement;
  successCallback?: () => void;
  element?: HTMLInputElement;

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

  onStart({ value, referencePosition, container, endEdit }: EditContext<string>) {
    console.log('input', 'beginEditing---- ');
    this.container = container;
    this.successCallback = endEdit;

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

  onEnd() {
    // do nothing
    this.container.removeChild(this.element);
  }

  isEditorElement(target: HTMLElement) {
    return target === this.element;
  }
}
