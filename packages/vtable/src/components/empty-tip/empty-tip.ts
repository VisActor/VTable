import { EmptyTip as EmptyTipComponents } from '@src/vrender';
// eslint-disable-next-line no-duplicate-imports
import type { EmptyTipAttributes, FederatedPointerEvent } from '@src/vrender';
import type { IEmptyTip } from '../../ts-types/component/empty-tip';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { AABBBounds, isBoolean, isEqual, isValid } from '@visactor/vutils';
import type { ListTable } from '../../ListTable';
import type { PivotTable } from '../../PivotTable';
import type { BaseTable } from '../../core';
const emptyTipSvg =
  '<svg t="1716726614852" class="icon" viewBox="0 0 1194 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2621" width="200" height="200"><path d="M1038.694079 367.237067c13.265507 23.342857-16.633865-40.004445-63.05621-40.004446H219.018794c-26.558738 0-46.46393 13.334815-63.05621 40.004446S0.006238 607.277601 0.006238 650.608819V940.647979a82.351494 82.351494 0 0 0 82.961402 83.349526H1111.702885a82.337632 82.337632 0 0 0 82.975264-83.349526V650.608819c0-43.331218-155.970208-283.371753-155.970208-283.371752zM730.066575 667.284269a136.328386 136.328386 0 0 1-132.738243 133.33429 133.417459 133.417459 0 0 1-132.738243-133.33429v-6.681269a40.6698 40.6698 0 0 0-36.497473-26.66963H73.015044l119.458874-220.02445s23.231965-40.004445 53.103614-40.004446h713.481918c26.544876 0 29.871649 10.008042 46.436207 40.004446L1128.33675 633.947231H769.904682c-26.184476 0-39.838107 7.623855-39.838107 33.337038zM338.505391 210.559919l-89.601086-86.69016a22.178487 22.178487 0 0 1 0-33.26773 21.984425 21.984425 0 0 1 33.170699 0l89.601087 86.676299a22.317102 22.317102 0 0 1 0 33.26773 24.950798 24.950798 0 0 1-33.1707 0z m252.197118-40.059891a25.532983 25.532983 0 0 1-6.639685-16.633865l-3.326773-126.694606A28.263709 28.263709 0 0 1 603.995739 0.515788c13.251646-3.326773 23.204242 10.021904 26.544877 23.342858V153.866163a28.249847 28.249847 0 0 1-23.259688 26.66963c-6.611961-3.312911-13.279369-3.312911-16.578419-10.035765z m235.646421 33.337038a22.372548 22.372548 0 0 1 0-33.337038l86.288175-90.030795a22.039871 22.039871 0 0 1 33.170699 0 22.289379 22.289379 0 0 1 0 33.364761l-82.961401 90.003072a25.962691 25.962691 0 0 1-36.483611 0z" fill="#8a8a8a" p-id="2622"></path></svg>';

export interface IEmptyTipComponent {
  new (emptyTipOption: IEmptyTip | true, table: BaseTableAPI): EmptyTip;
}

export class EmptyTip {
  table: BaseTableAPI;
  _emptyTipOption: IEmptyTip = {
    spaceBetweenTextAndIcon: 20,
    text: 'no data',
    textStyle: {
      fontSize: 14,
      color: '#000'
    },
    icon: {
      image: emptyTipSvg,
      width: 100,
      height: 100
    }
  };
  isReleased: boolean = false;
  private _emptyTipComponent: EmptyTipComponents;
  private _cacheAttrs: EmptyTipAttributes;
  constructor(emptyTipOption: IEmptyTip | true, table: BaseTableAPI) {
    this.table = table;
    this._emptyTipOption = Object.assign(this._emptyTipOption, emptyTipOption === true ? {} : emptyTipOption);
    // deal with displayMode
    if (!isValid(this._emptyTipOption.displayMode)) {
      // for list table and pivot table current display effect
      if (this.table.isListTable()) {
        this._emptyTipOption.displayMode = 'basedOnTable';
      } else {
        this._emptyTipOption.displayMode = 'basedOnContainer';
      }
    }
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

      // bind events
      this.bindEvents();
    }
    // update table size
    // this._adjustTableSize(this._emptyTipComponent.attribute);
    return this._emptyTipComponent;
  }

  bindEvents() {
    this._emptyTipComponent.on('click', (e: FederatedPointerEvent) => {
      const bounds = new AABBBounds();
      this._emptyTipComponent.forEachChildren((child: any) => {
        bounds.union(child.globalAABBBounds);
      });
      if (bounds.contains(e.x, e.y)) {
        this.table.fireListeners('empty_tip_click', e);
        return;
      }
    });
    this._emptyTipComponent.on('dblclick', (e: FederatedPointerEvent) => {
      const bounds = new AABBBounds();
      this._emptyTipComponent.forEachChildren((child: any) => {
        bounds.union(child.globalAABBBounds);
      });
      if (bounds.contains(e.x, e.y)) {
        this.table.fireListeners('empty_tip_dblclick', e);
        return;
      }
    });
  }

  resize() {
    if (!this._emptyTipComponent) {
      return;
    }
    const { leftHeaderWidth, topHeaderHeight, width, height } = this.getWidthAndHeight();
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
    if (
      ((!this.table.recordsCount || this.table.recordsCount === 0) &&
        this.table.internalProps.layoutMap.rowCount === this.table.internalProps.layoutMap.columnHeaderLevelCount) ||
      this.table.internalProps.layoutMap.colCount === this.table.internalProps.layoutMap.rowHeaderLevelCount
    ) {
      // this._emptyTipComponent.setAttributes({
      //   visible: true
      // });
      // this._emptyTipComponent.showAll();
      if (!this.table.scenegraph.stage.defaultLayer.children.includes(this._emptyTipComponent)) {
        this.table.scenegraph.stage.defaultLayer.appendChild(this._emptyTipComponent);
      }
    } else {
      // this._emptyTipComponent.setAttributes({
      //   visible: false
      // });
      // this._emptyTipComponent.hideAll();
      if (this.table.scenegraph.stage.defaultLayer.children.includes(this._emptyTipComponent)) {
        this.table.scenegraph.stage.defaultLayer.removeChild(this._emptyTipComponent);
      }
    }
  }

  getWidthAndHeight() {
    const leftHeaderWidth =
      (this.table as ListTable).transpose || (this.table as PivotTable).options.indicatorsAsCol === false
        ? this.table.getFrozenColsWidth()
        : 0;
    const topHeaderHeight =
      !(this.table as ListTable).transpose || (this.table as PivotTable).options.indicatorsAsCol
        ? this.table.getFrozenRowsHeight()
        : 0;
    const width =
      (this._emptyTipOption.displayMode !== 'basedOnContainer' &&
      this.table.columnHeaderLevelCount > 0 &&
      this.table.colCount > this.table.rowHeaderLevelCount
        ? this.table.getDrawRange().width
        : this.table.tableNoFrameWidth) -
      leftHeaderWidth -
      (this.table as BaseTable).getTheme().scrollStyle.width;
    const height =
      (this._emptyTipOption.displayMode !== 'basedOnContainer' &&
      this.table.rowHeaderLevelCount > 0 &&
      this.table.rowCount > this.table.columnHeaderLevelCount
        ? this.table.getDrawRange().height
        : this.table.tableNoFrameHeight) -
      topHeaderHeight -
      (this.table as BaseTable).getTheme().scrollStyle.width;
    return {
      leftHeaderWidth,
      topHeaderHeight,
      width,
      height
    };
  }

  private _getEmptyTipAttrs() {
    const { leftHeaderWidth, topHeaderHeight, width, height } = this.getWidthAndHeight();

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
