import type { BaseTable } from '../core';
import type { Rect } from '../tools/Rect';
import { Env } from '../tools/env';
/**
 * editCellTrigger === 'keydown' 时，使用这个类来处理键盘事件。否则当键盘按下再创建input就晚了，中文输入法第一个字符会被当做英文字符
 */
export class EditorInputElement extends EventTarget {
  private _container: HTMLDivElement;
  private _table: BaseTable;
  private _input: HTMLInputElement;
  constructor(table: BaseTable, parentElement: HTMLElement) {
    super();
    this._table = table;
    if (Env.mode === 'node') {
      return;
    }
    const div = document.createElement('div'); //再加一层 C360插件逻辑中用的window.getSelection()来判断的滚动
    // div.style.position = 'fixed';//定位不能使用fixed 在父级transform非none的时候 都会有问题
    div.style.opacity = '0';
    div.style.pointerEvents = 'none';
    div.id = 'vtable_editor_input_element';
    div.style.position = 'absolute';
    // div.classList.add('input-container');
    const input = (this._input = document.createElement('input'));
    div.appendChild(input);
    input.style.position = 'relative';
    input.style.padding = '0';
    input.style.margin = '0';
    input.style.float = 'none';
    input.style.boxSizing = 'border-box';
    // input.classList.add('table-focus-control');
    parentElement.appendChild(div);
    this._container = div;
    this.bindEvent();
  }

  show(): void {
    this._container.style.pointerEvents = 'auto';
    this._container.style.opacity = '1';
    // this._input.style.opacity = '1';
    // this._input.style.zIndex = '99999999';
    // this._input.style.pointerEvents = 'auto';
    // this._input.readOnly = false;
  }
  hide(): void {
    this._container.style.pointerEvents = 'none';
    this._container.style.opacity = '0';
    // this._input.style.opacity = '0';
    // this._input.style.zIndex = '0';
    // this._input.style.pointerEvents = 'none';
    // this._input.readOnly = true;
  }
  bindEvent(): void {
    this._input.addEventListener('keydown', (e: KeyboardEvent) => {
      if (
        e.key === 'Enter' ||
        e.key === 'Escape' ||
        e.key === 'Tab' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.key === 'PageUp' ||
        e.key === 'PageDown' ||
        e.key === 'Insert'
      ) {
        this._input.blur();
      } else if (!(e.ctrlKey || e.metaKey)) {
        if (this._table.editorManager.editingEditor) {
          return;
        }
        const allowedKeys = /^[a-zA-Z0-9+\-*\/%=.,\s]$/; // 允许的键值正则表达式
        if (e.key.match(allowedKeys)) {
          this.show();
          this._table.editorManager.startEditCell(
            this._table.stateManager.select.cellPos.col,
            this._table.stateManager.select.cellPos.row,
            undefined,
            this._input
          );
        }
      }
    });
  }

  focus(): void {
    this._input.focus({ preventScroll: true });
  }

  setRect(rect: Rect, value: string): void {
    const input = this._input;
    input.value = value;
    const top = rect.top - this._table.scrollTop;
    const left = rect.left - this._table.scrollLeft;
    input.style.top = `${top.toFixed()}px`;
    input.style.left = `${left.toFixed()}px`;
    input.style.width = `${rect.width.toFixed()}px`;
    input.style.height = `${rect.height.toFixed()}px`;
  }
  get input(): HTMLInputElement {
    return this._input;
  }
  release(): void {
    this._container.parentElement?.removeChild(this._container);
  }
}
