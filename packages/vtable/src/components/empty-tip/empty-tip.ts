import { EmptyTip as EmptyTipComponents } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import type { EmptyTipAttributes } from '@visactor/vrender-components';
import type { IEmptyTip } from '../../ts-types/component/empty-tip';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { isEqual } from '@visactor/vutils';
import type { ListTable } from '../../ListTable';
import type { PivotTable } from '../../PivotTable';
export class EmptyTip {
  table: BaseTableAPI;
  _emptyTipOption: IEmptyTip;
  isReleased: boolean = false;
  private _emptyTipComponent: EmptyTipComponents;
  private _cacheAttrs: EmptyTipAttributes;
  constructor(emptyTipOption: IEmptyTip | true, table: BaseTableAPI) {
    this.table = table;
    this._emptyTipOption = emptyTipOption === true ? {} : emptyTipOption;

    this._emptyTipComponent = this._createOrUpdateEmptyTipComponent(this._getEmptyTipAttrs());
  }

  private _createOrUpdateEmptyTipComponent(attrs: EmptyTipAttributes): EmptyTipComponents {
    if (this._emptyTipComponent) {
      if (!isEqual(attrs, this._cacheAttrs)) {
        this._emptyTipComponent.setAttributes(attrs);
      }
    } else {
      const emptyTip = new EmptyTipComponents(attrs);
      emptyTip.name = 'emptyTip';
      this.table.scenegraph.stage.defaultLayer.appendChild(emptyTip);
      this._emptyTipComponent = emptyTip;
      // 代理 emptyTip 组件上的事件
      // emptyTip.on('*', (event: any, type: string) => this._delegateEvent(emptyTip as unknown as INode, event, type));
    }
    // update table size
    // this._adjustTableSize(this._emptyTipComponent.attribute);
    return this._emptyTipComponent;
  }

  resize() {
    if (!this._emptyTipComponent) {
      return;
    }
    const leftHeaderWidth =
      (this.table as ListTable).transpose || (this.table as PivotTable).options.indicatorsAsCol === false
        ? this.table.getFrozenColsWidth()
        : 0;
    const topHeaderHeight =
      !(this.table as ListTable).transpose || (this.table as PivotTable).options.indicatorsAsCol
        ? this.table.getFrozenRowsHeight()
        : 0;
    const width =
      (this.table.columnHeaderLevelCount > 0 ? this.table.getDrawRange().width : this.table.tableNoFrameWidth) -
      leftHeaderWidth;
    const height =
      (this.table.rowHeaderLevelCount > 0 ? this.table.getDrawRange().height : this.table.tableNoFrameHeight) -
      topHeaderHeight;
    this._emptyTipComponent.setAttributes({
      spaceBetweenTextAndIcon: this._emptyTipOption.spaceBetweenTextAndIcon,
      x: this.table.tableX + leftHeaderWidth,
      y: this.table.tableY + topHeaderHeight,
      width,
      height,
      text: {
        text: this._emptyTipOption.text,
        ...this._emptyTipOption.textStyle,
        fill: this._emptyTipOption.textStyle?.color
      },
      icon: {
        ...this._emptyTipOption.icon
      }
    });
  }

  release(): void {
    this._emptyTipComponent && this.table.scenegraph.stage.defaultLayer.removeChild(this._emptyTipComponent);
    this._emptyTipComponent = null;
    this.isReleased = true;
  }
  resetVisible() {
    if (!this.table.recordsCount || this.table.recordsCount === 0) {
      this._emptyTipComponent.setAttributes({
        visible: true
      });
      this._emptyTipComponent.showAll();
    } else {
      this._emptyTipComponent.setAttributes({
        visible: false
      });
      this._emptyTipComponent.hideAll();
    }
  }

  private _getEmptyTipAttrs() {
    const leftHeaderWidth =
      (this.table as ListTable).transpose || (this.table as PivotTable).options.indicatorsAsCol === false
        ? this.table.getFrozenColsWidth()
        : 0;
    const topHeaderHeight =
      !(this.table as ListTable).transpose || (this.table as PivotTable).options.indicatorsAsCol
        ? this.table.getFrozenRowsHeight()
        : 0;
    const width =
      (this.table.columnHeaderLevelCount > 0 ? this.table.getDrawRange().width : this.table.tableNoFrameWidth) -
      leftHeaderWidth;
    const height =
      (this.table.rowHeaderLevelCount > 0 ? this.table.getDrawRange().height : this.table.tableNoFrameHeight) -
      topHeaderHeight;

    return {
      spaceBetweenTextAndIcon: this._emptyTipOption.spaceBetweenTextAndIcon,
      x: this.table.tableX + leftHeaderWidth,
      y: this.table.tableY + topHeaderHeight,
      width,
      height,
      text: {
        text: this._emptyTipOption.text,
        ...this._emptyTipOption.textStyle,
        fill: this._emptyTipOption.textStyle?.color
      },
      icon: {
        ...this._emptyTipOption.icon
      }
      // visible:this.table.recordsCount === 0?true:false
    } as EmptyTipAttributes;
  }
}
