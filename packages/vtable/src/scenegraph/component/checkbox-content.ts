import { Group } from '../graphic/group';
import type { IGroupGraphicAttribute } from '@src/vrender';
import { CheckBox } from '@src/vrender';
import type { Icon, TextIcon } from '../graphic/icon';

interface ICellContentOption {
  autoWidth: boolean;
  autoHeight: boolean;
  cellWidth: number;
  cellHeight: number;
  align: CanvasTextAlign;
  baseline: CanvasTextBaseline;
}

export class CheckboxContent extends Group {
  _leftGroup: Group;
  _rightGroup: Group;
  _checkboxGroup: Group;

  _autoWidth = false;
  _autoHeight = false;
  _cellWidth: number;
  _originCellWidth: number;
  _cellHeight: number;
  _align: CanvasTextAlign;
  _baseline: CanvasTextBaseline;

  constructor(params: IGroupGraphicAttribute) {
    super(params);

    this._leftGroup = new Group({
      pickable: false,
      fill: false,
      stroke: false
    });
    this._leftGroup.role = 'content-left';
    this._rightGroup = new Group({
      pickable: false,
      fill: false,
      stroke: false
    });
    this._rightGroup.role = 'content-right';
    this._checkboxGroup = new Group({
      pickable: false,
      fill: false,
      stroke: false
    });
    this._checkboxGroup.role = 'content-center';

    this.appendChild(this._leftGroup);
    this.appendChild(this._rightGroup);
    this.appendChild(this._checkboxGroup);
  }

  addLeftOccupyingIcon(icon: Icon | TextIcon) {
    icon.setAttribute('x', this._leftGroup.width + (icon.attribute.marginLeft ?? 0));
    this._leftGroup.appendChild(icon);
    this._leftGroup.setDeltaWidth(
      (icon.attribute.marginLeft ?? 0) + (icon.attribute.marginRight ?? 0) + icon.attribute.width
    );
  }

  addRightOccupyingIcon(icon: Icon | TextIcon) {
    icon.setAttribute('x', this._rightGroup.width + (icon.attribute.marginLeft ?? 0));
    this._rightGroup.appendChild(icon);
    this._rightGroup.setDeltaWidth(
      (icon.attribute.marginLeft ?? 0) + (icon.attribute.marginRight ?? 0) + icon.attribute.width
    );
  }

  addCheckbox(checkbox: CheckBox) {
    this._checkboxGroup.appendChild(checkbox);
  }

  setCheckboxContentOption(option: ICellContentOption) {
    this._autoWidth = option.autoWidth;
    this._autoHeight = option.autoHeight;
    this._cellWidth = option.cellWidth;
    this._originCellWidth = option.cellWidth;
    this._cellHeight = option.cellHeight;
    this._align = option.align;
    this._baseline = option.baseline;
  }

  layout() {
    // 计算左侧占位区域尺寸
    let leftOccupyingWidth = this._leftGroup.width;
    if (leftOccupyingWidth === Infinity) {
      leftOccupyingWidth = 0;
    }
    // 计算右侧占位区域尺寸
    let rightOccupyingWidth = this._rightGroup.width;
    if (rightOccupyingWidth === -Infinity) {
      rightOccupyingWidth = 0;
    }

    // 计算中央内容区域尺寸
    if (this._autoWidth) {
      // 计算checkbox本身宽度
      const checkboxWidth = this._checkboxGroup.width;
      // 更新cell宽度
      this._cellWidth = leftOccupyingWidth + rightOccupyingWidth + checkboxWidth;
      this.setAttribute('width', this._cellWidth);
    } else {
      // 计算留给内容的宽度
      const contentWidth = this._cellWidth - leftOccupyingWidth - rightOccupyingWidth;
      // 更新内容宽度
      this.updateCenterLayout(contentWidth);
      const centerWidth = this._checkboxGroup.width;
      this._cellWidth = leftOccupyingWidth + rightOccupyingWidth + centerWidth;
      // this.attribute.width = this._cellWidth;
      this.setAttribute('width', this._cellWidth);
    }

    // 更新水平位置
    this.updateHorizontalPos();
    // if (this._autoHeight) {
    const leftOccupyingHeight = this._leftGroup.height;
    const rightOccupyingHeight = this._rightGroup.height;
    const centerHeight = this._checkboxGroup.height;

    this._cellHeight = Math.max(leftOccupyingHeight, rightOccupyingHeight, centerHeight);
    // this.attribute.height = this._cellHeight;
    this.setAttribute('height', this._cellHeight);
    // }

    // 更新纵向位置
    this.updateVerticalPos();
  }

  updateCenterLayout(contentWidth: number) {
    // 计算留给checkbox的空间
    let checkboxWidth = contentWidth;
    this._checkboxGroup.forEachChildren(child => {
      if (child instanceof CheckBox) {
        checkboxWidth -= child.AABBBounds.width();
      }
    });

    // 更新checkbox宽度
    const checkbox = this._checkboxGroup.getChildByName('checkbox-content');
    if (checkbox instanceof CheckBox) {
      checkbox.setAttribute('width', checkboxWidth);
    }

    // 按顺序更新x
    let x = 0;
    this._checkboxGroup.forEachChildren((child: Group) => {
      child.setAttribute('x', x);
      x += child.AABBBounds.width();
    });
  }

  updateHorizontalPos() {
    this._leftGroup.setAttribute('x', 0);
    this._rightGroup.setAttribute('x', this._cellWidth - this._rightGroup.width);
    this._checkboxGroup.setAttribute('x', 4);
    // 对齐方式由外部处理
    if (this._align === 'left' || this._align === 'start') {
      this.setAttribute('dx', 0);
    } else if (this._align === 'center') {
      this.setAttribute('dx', -this.attribute.width / 2);
    } else if (this._align === 'right' || this._align === 'end') {
      this.setAttribute('dx', -this.attribute.width);
    }
  }

  updateVerticalPos() {
    if (this._baseline === 'top') {
      this._leftGroup.setAttribute('y', 0);
      this._rightGroup.setAttribute('y', 0);
      this._checkboxGroup.setAttribute('y', 0);
    } else if (this._baseline === 'middle') {
      // 处理Group内icon对齐
      this._leftGroup.forEachChildren((icon: Icon | TextIcon) => {
        icon.setAttribute('y', (this._leftGroup.height - icon.AABBBounds.height()) / 2);
      });
      this._rightGroup.forEachChildren((icon: Icon | TextIcon) => {
        icon.setAttribute('y', (this._rightGroup.height - icon.AABBBounds.height()) / 2);
      });

      this._leftGroup.setAttribute('y', this._cellHeight / 2 - this._leftGroup.height / 2);
      this._rightGroup.setAttribute('y', this._cellHeight / 2 - this._rightGroup.height / 2);
      this._checkboxGroup.setAttribute('y', this._cellHeight / 2 - this._checkboxGroup.height / 2);
    } else if (this._baseline === 'bottom') {
      // 处理Group内icon对齐
      this._leftGroup.forEachChildren((icon: Icon | TextIcon) => {
        icon.setAttribute('y', this._leftGroup.height - icon.AABBBounds.height());
      });
      this._rightGroup.forEachChildren((icon: Icon | TextIcon) => {
        icon.setAttribute('y', this._rightGroup.height - icon.AABBBounds.height());
      });

      this._leftGroup.setAttribute('y', this._cellHeight - this._leftGroup.height);
      this._rightGroup.setAttribute('y', this._cellHeight - this._rightGroup.height);
      this._checkboxGroup.setAttribute('y', this._cellHeight - this._checkboxGroup.height);
    }
  }
}
