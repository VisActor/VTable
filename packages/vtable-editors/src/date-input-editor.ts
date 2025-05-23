import type { InputEditorConfig } from './input-editor';
import { InputEditor } from './input-editor';
import type { IEditor } from './types';
export class DateInputEditor extends InputEditor implements IEditor {
  editorType: string = 'DateInput';
  constructor(editorConfig?: InputEditorConfig) {
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
    input.style.backgroundColor = '#FFFFFF';

    input.style.borderRadius = '0px';
    input.style.border = '2px solid #d9d9d9';
    // #region 为了保证input在focus时，没有圆角
    input.addEventListener('focus', () => {
      input.style.borderColor = '#4A90E2';
      input.style.outline = 'none';
    });

    input.addEventListener('blur', () => {
      input.style.borderColor = '#d9d9d9';
      // input.style.boxShadow = 'none';
    });

    this.element = input;
    this.container.appendChild(input);
    // 测试successCallback 调用是否正确
    // input.ondblclick = () => {
    //   debugger;
    //   this.successCallback();
    // };

    // 监听键盘事件
    input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        // 阻止冒泡  防止处理成表格全选事件
        e.stopPropagation();
      }
    });

    // hack for preventing drag touch cause page jump
    input.addEventListener('wheel', e => {
      e.preventDefault();
    });
  }
}
