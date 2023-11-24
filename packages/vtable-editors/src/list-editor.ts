import type { IEditor, Placement, RectProps } from './types';
export interface ListEditorConfig {
  values: string[];
}

export class ListEditor implements IEditor {
  editorType: string = 'Input';
  input: HTMLInputElement;
  editorConfig: ListEditorConfig;
  container: HTMLElement;
  element: HTMLSelectElement;
  successCallback: Function;

  constructor(editorConfig: ListEditorConfig) {
    console.log('listEditor constructor');
    this.editorConfig = editorConfig;
  }

  createElement(value: string) {
    // create select tag
    const select = document.createElement('select');
    select.setAttribute('type', 'text');
    select.style.position = 'absolute';
    select.style.padding = '4px';
    select.style.width = '100%';
    select.style.boxSizing = 'border-box';

    this.element = select;

    // create option tags
    const { values } = this.editorConfig;
    let opsStr = '';
    values.forEach(item => {
      opsStr +=
        item === value ? `<option value=${item} selected>${item}</option>` : `<option value=${item} >${item}</option>`;
    });
    select.innerHTML = opsStr;

    this.container.appendChild(select);
    // this._bindSelectChangeEvent();
  }

  _bindSelectChangeEvent() {
    this.element.addEventListener('change', () => {
      // this.successCallback();
    });
  }

  setValue(value: string) {
    // do nothing
  }

  getValue() {
    return this.element.value;
  }

  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
    this.container = container;

    this.createElement(value);

    if (value) {
      this.setValue(value);
    }
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.element.focus();
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
    this.container.removeChild(this.element);
  }

  targetIsOnEditor(target: HTMLElement) {
    if (target === this.element) {
      return true;
    }
    return false;
  }

  bindSuccessCallback(success: Function) {
    this.successCallback = success;
  }
}
