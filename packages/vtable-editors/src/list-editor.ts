import type { EditContext, IEditor, Placement, RectProps } from './types';
export interface ListEditorConfig {
  values: string[];
}

export class ListEditor implements IEditor {
  editorType: string = 'Input';
  input?: HTMLInputElement;
  editorConfig?: ListEditorConfig;
  container?: HTMLElement;
  element?: HTMLSelectElement;
  successCallback?: () => void;

  constructor(editorConfig: ListEditorConfig) {
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
    select.style.backgroundColor = '#FFFFFF';
    select.style.borderRadius = '0px';
    select.style.border = '2px solid #d9d9d9';
    // #region 为了保证input在focus时，没有圆角
    select.addEventListener('focus', () => {
      select.style.borderColor = '#4A90E2';
      select.style.outline = 'none';
    });

    select.addEventListener('blur', () => {
      select.style.borderColor = '#d9d9d9';
      // input.style.boxShadow = 'none';
    });

    this.element = select;

    // create option tags
    const { values } = this.editorConfig;
    let opsStr = '';
    values.forEach(item => {
      opsStr +=
        item === value
          ? `<option value="${item}" selected>${item}</option>`
          : `<option value="${item}" >${item}</option>`;
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

  onStart({ container, value, referencePosition, endEdit }: EditContext) {
    this.container = container;
    this.successCallback = endEdit;

    this.createElement(value);

    if (value !== undefined && value !== null) {
      this.setValue(value);
    }
    if (referencePosition?.rect) {
      this.adjustPosition(referencePosition.rect);
    }
    this.element.focus();
  }

  adjustPosition(rect: RectProps) {
    //使border均分input位置rect的上下左右
    const borderWidth = 2;
    const top = rect.top - borderWidth / 2;
    const left = rect.left - borderWidth / 2;
    const width = rect.width + borderWidth;
    const height = rect.height + borderWidth;

    this.element.style.top = top + 'px';
    this.element.style.left = left + 'px';
    this.element.style.width = width + 'px';
    this.element.style.height = height + 'px';
  }

  endEditing() {
    // do nothing
  }

  onEnd() {
    this.container.removeChild(this.element);
  }

  isEditorElement(target: HTMLElement) {
    return target === this.element;
  }
}
