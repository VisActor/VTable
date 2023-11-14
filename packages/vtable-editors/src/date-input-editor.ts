import { InputEditor } from './input-editor';
export interface DateInputEditorConfig {
  max?: number;
  min?: number;
}

export class DateInputEditor extends InputEditor {
  editorType: string = 'DateInput';
  declare element: HTMLInputElement;
  constructor(editorConfig: DateInputEditorConfig) {
    super(editorConfig);
    this.editorConfig = editorConfig;
  }
  createElement() {
    const input = document.createElement('input');

    input.setAttribute('type', 'date');

    input.style.padding = '4px';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.position = 'absolute';
    this.element = input;
    this.container.appendChild(input);
  }
}
