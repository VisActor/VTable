import { isNumber } from '../../tools/util';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { DirectionKey } from './direction';
import { DIRECTION_KEY } from './direction';
import type { ElementOptions } from './element';
import { BaseElement } from './element';
import { Line } from './line';
import type { percentCalcObj } from './percent-calc';
import { Rect } from './rect';

type containerOptions = {
  width?: number | percentCalcObj;
  height?: number | percentCalcObj;
  direction?: 'row' | 'column'; // 布局主方向
  justifyContent?: 'start' | 'end' | 'center'; // 布局方向上的对齐方式
  alignItems?: 'start' | 'end' | 'center'; // 布局交叉方向上的对齐方式
  alignContent?: 'start' | 'end' | 'center'; // 布局交叉方向上多根轴线的对齐方式
  showBounds?: boolean; // 是否显示bounds
} & ElementOptions;

export class Container extends BaseElement {
  type: 'container' = 'container';
  declare width: number;
  _widthObj: percentCalcObj;
  declare height: number;
  _heightObj: percentCalcObj;
  needCalcSize = false;
  direction: 'row' | 'column'; // 布局主方向
  justifyContent: 'start' | 'end' | 'center'; // 布局方向上的对齐方式
  alignItems: 'start' | 'end' | 'center'; // 布局交叉方向上的对齐方式
  alignContent: 'start' | 'end' | 'center'; // 布局交叉方向上多根轴线的对齐方式
  lines: Line[] = [];
  currentLine?: Line;
  currentLineY = 0;
  table: BaseTableAPI;
  directionKey: DirectionKey;
  showBounds: boolean;
  offsetY = 0;
  isRoot?: boolean;

  constructor(options: containerOptions) {
    super(options);
    this.direction = options.direction || 'row';
    this.justifyContent = options.justifyContent || 'start';
    this.alignItems = options.alignItems || 'start';
    this.alignContent = options.alignContent || 'start';

    if (isNumber(options.width)) {
      this.width = options.width as number;
    } else {
      this._widthObj = options.width as percentCalcObj;
      this.needCalcSize = true;
    }
    if (isNumber(options.height)) {
      this.height = options.height as number;
    } else {
      this._heightObj = options.height as percentCalcObj;
      this.needCalcSize = true;
    }

    this.directionKey = DIRECTION_KEY[this.direction];

    this.showBounds = options.showBounds || false;

    this.initLayoutSize();
  }

  add(element: BaseElement) {
    if (this.needCalcSize) {
      throw new Error('Need to specify a parent element before adding a child element when use percent size!');
    }

    if (element.type === 'container') {
      (element as Container).calcSize(this.width, this.height);
    }

    if (this.currentLine && this.currentLine.canAdd(element)) {
      this.currentLine.add(element);
    } else {
      if (this.currentLine) {
        this.currentLine.addAble = false; // 关闭当前行
        this.currentLineY += this.currentLine[this.directionKey.height]; // 更新目前line y位置
        this.currentLine.lineFinish();
      }
      // this.currentLine = new Line(this.width);
      this.currentLine = new Line(this[this.directionKey.width], this.direction, this.justifyContent, this.alignItems);
      this.currentLine[this.directionKey.y] = this.currentLineY;
      this.currentLine.add(element);
      this.lines.push(this.currentLine);
    }
  }

  // 交叉方向上多根轴线的对齐方式
  updateYAlign() {
    const offsetY = this[this.directionKey.height] - this.currentLineY;
    if (this.alignContent === 'center') {
      this.offsetY = offsetY / 2;
    } else if (this.alignContent === 'start') {
      this.offsetY = 0;
    } else {
      this.offsetY = offsetY;
    }
  }

  getSize() {
    const result = {
      width: 0,
      height: 0
    };
    if (this.currentLine && this.currentLine.addAble) {
      result[this.directionKey.height] = this.currentLineY + this.currentLine[this.directionKey.height];
    } else {
      result[this.directionKey.height] = this.currentLineY;
    }

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      if (result[this.directionKey.width] < line[this.directionKey.width]) {
        result[this.directionKey.width] = line[this.directionKey.width];
      }
    }
    return result;
  }

  getContentSize() {
    const result = {
      width: 0,
      height: 0
    };

    const calcFlag = {
      width: true,
      height: true
    };

    if (!this.isRoot && !this._heightObj) {
      calcFlag.height = false;
      result.height = this.height;
    }
    if (!this.isRoot && !this._widthObj) {
      calcFlag.width = false;
      result.width = this.width;
    }

    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      const size = line.getContentSize();
      if (calcFlag[this.directionKey.width] && result[this.directionKey.width] < size[this.directionKey.width]) {
        result[this.directionKey.width] = size[this.directionKey.width];
      }

      if (calcFlag[this.directionKey.height]) {
        result[this.directionKey.height] += size[this.directionKey.height];
      }
    }

    return result;
  }

  calcSize(parentWidth: number, parentHeight: number) {
    if (this._heightObj) {
      this.height = (parentHeight * this._heightObj.percent) / 100 + this._heightObj.delta;
      this.needCalcSize = false;
      this.initLayoutSize();
    }
    if (this._widthObj) {
      this.width = (parentWidth * this._widthObj.percent) / 100 + this._widthObj.delta;
      this.needCalcSize = false;
      this.initLayoutSize();
    }
  }

  // 获取平坦后的全部子图元，更新子图元xy位置信息
  getElements(
    parentPos: { parentX: number; parentY: number } = { parentX: 0, parentY: 0 },
    isHover = false,
    isSelect = false
  ) {
    // 关闭最后一行
    if (this.currentLine && this.currentLine.addAble) {
      this.currentLine.addAble = false; // 关闭当前行
      this.currentLineY += this.currentLine[this.directionKey.height]; // 更新目前line y位置
      this.currentLine.lineFinish();
    }

    // 处理alignContent
    this.updateYAlign();

    const elements = [];
    if (this.showBounds) {
      const boundsRect = new Rect({
        width: this.width,
        height: this.height,
        borderRadius: 0,
        stroke: 'red',
        fill: 'rgba(255, 0, 0, 0.2)',
        lineWidth: 4
      });
      boundsRect.x += this.x + parentPos.parentX;
      boundsRect.y += this.y + parentPos.parentY;
      elements.push(boundsRect);
    }
    // const parentPos = { parentX, parentY };
    for (let i = 0; i < this.lines.length; i++) {
      const line = this.lines[i];
      line[this.directionKey.y] += this.offsetY;
      // const linesElements = line.getElements(table, this.x + parentX, this.y + parentY);
      const linesElements = line.getElements(
        {
          [this.directionKey.parentX]: this.x + parentPos.parentX,
          [this.directionKey.parentY]: this.y + parentPos.parentY
        } as any,
        isHover,
        isSelect
      );
      elements.push(...linesElements);
    }

    return elements;
  }
}
