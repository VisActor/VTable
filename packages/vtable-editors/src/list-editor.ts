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
    const select = document.createElement('select');
    select.setAttribute('type', 'text');
    select.style.position = 'absolute';
    select.style.padding = '4px';
    select.style.width = '100%';
    select.style.boxSizing = 'border-box';
    const { values } = this.editorConfig;
    let opsStr = '';
    values.forEach(item => {
      opsStr +=
        item === value ? `<option value=${item} selected>${item}</option>` : `<option value=${item} >${item}</option>`;
    });
    select.innerHTML = opsStr;

    this.element = select;

    this.container.appendChild(select);
  }
  setValue(value: string) {
    // do nothing
  }
  getValue() {
    return this.element.value;
  }
  beginEditing(container: HTMLElement, referencePosition: { rect: RectProps; placement?: Placement }, value?: string) {
    console.log('input', 'beginEditing');
    console.log('value', value);
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
    // do nothing
  }
  targetIsOnEditor(target: HTMLElement) {
    console.log('target', target);
    if (target === this.element) {
      return true;
    }
    return false;
  }
  bindSuccessCallback(success: Function) {
    this.successCallback = success;
  }
}
