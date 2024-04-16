/* eslint-env browser */
import { Select, Input } from '@arco-design/web-react';
import React from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import '@arco-design/web-react/dist/css/arco.css';
const Option = Select.Option;

export class ArcoListEditor {
  editorType: string;
  cascaderOptions: null | []; // 全部columns信息
  field: null | string; // 选中的cell的field
  root: null | Root; // 为了挂reactDOM
  container: null | HTMLElement;
  element: null | HTMLElement;
  currentValue: any;
  constructor() {
    this.editorType = 'Cascader';
    this.cascaderOptions = null;
    this.field = null;
    this.root = null;
    this.element = null;
    this.container = null;
  }
  /**
   * @description: 复写editor内置方法
   * @param {HTMLElement} container
   * @param {any} referencePosition
   * @param {string} value
   * @return {*}
   */
  onStart(editorContext: { container: HTMLElement | null; referencePosition: any; value: string }) {
    const { container, referencePosition, value } = editorContext;
    this.container = container;
    this.createElement(value);
    value && this.setValue(value);
    (null == referencePosition ? void 0 : referencePosition.rect) && this.adjustPosition(referencePosition.rect);
  }

  /**
   * @description:复写editor内置方法
   * @param {string} selectMode
   * @param {*} Options
   * @param {*} defaultValue
   * @return {*}
   */
  createElement(defaultValue: (string | string[])[]) {
    const div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.width = '100%';
    div.style.padding = '4px';
    div.style.boxSizing = 'border-box';
    div.style.backgroundColor = '#232324';
    this.container?.appendChild(div);
    this.root = createRoot(div);
    const options = ['Beijing', 'Shanghai', 'Guangzhou'];
    this.root.render(
      <Select
        placeholder="Select city"
        defaultValue={defaultValue}
        onChange={value => {
          this.currentValue = value;
        }}
      >
        {options.map((option, index) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    );
    this.element = div;
  }

  /**
   * @description:复写editor内置方法，targetIsOnEditor为false时执行
   * @param {object} rect
   * @return {*}
   */
  getValue() {
    return this.currentValue;
  }

  /**
   * @description:复写editor内置方法
   * @param {object} rect
   * @return {*}
   */
  setValue(value: string) {
    this.currentValue = value;
  }

  /**
   * @description:复写editor内置方法
   * @param {object} rect
   * @return {*}
   */
  adjustPosition(rect: { top: string; left: string; width: string; height: string }) {
    if (this.element) {
      (this.element.style.top = rect.top + 'px'),
        (this.element.style.left = rect.left + 'px'),
        (this.element.style.width = rect.width + 'px'),
        (this.element.style.height = rect.height + 'px');
    }
  }
  /**
   * @description:复写editor内置方法
   * @param {object} rect
   * @return {*}
   */
  onEnd() {
    this.container.removeChild(this.element);
  }

  /**
   * @description: 每点击一次，都会执行，目的是为了判断当前点击的区域是否是editor范围
   * @param {Node} target 被点击的元素
   * @return {Boolean}
   */
  isEditorElement(target: Node | null) {
    // cascader创建时时在cavas后追加一个dom，而popup append在body尾部。不论popup还是dom，都应该被认为是点击到了editor区域
    return this.element?.contains(target) || this.isClickPopUp(target);
  }

  isClickPopUp(target: { classList: { contains: (arg0: string) => any }; parentNode: any }) {
    while (target) {
      if (target.classList && target.classList.contains('arco-select')) {
        return true;
      }
      // 如果到达了DOM树的顶部，则停止搜索
      target = target.parentNode;
    }
    // 如果遍历结束也没有找到符合条件的父元素，则返回false
    return false;
  }
}
