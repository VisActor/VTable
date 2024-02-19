import type { BaseTable } from '../core';
import type { Rect } from '../tools/Rect';
import { Env } from '../tools/env';

export class FocusInput extends EventTarget {
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
    div.dataset.vtable = 'vtable'; //这里不能变 C360取元素的依据
    div.style.pointerEvents = 'none';
    div.classList.add('input-container');
    const input = (this._input = document.createElement('input'));
    div.appendChild(input);
    input.classList.add('table-focus-control');
    input.dataset.vtable = 'vtable';
    input.readOnly = true;
    parentElement.appendChild(div);
    this._container = div;
  }

  focus(): void {
    this._input.focus({ preventScroll: true });
  }
  setFocusRect(rect: Rect, value: string): void {
    const input = this._input;
    input.value = value;
    // input.focus({ preventScroll: true });
    input.select();
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
    // document.removeChild(this._input);
    this._container.parentElement?.removeChild(this._container);
  }
}
