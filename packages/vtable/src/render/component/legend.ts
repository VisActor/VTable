import { cloneDeep, get, merge } from '@visactor/vutils';
import type { ITableLegendOption } from '../../ts-types/component/legend';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { DiscreteLegend, LegendEvent } from '@visactor/vrender-components';
import { getLegendAttributes } from './util/get-legend-attributes';
import { TABLE_EVENT_TYPE } from '../../core/TABLE_EVENT_TYPE';

export class TableLegend {
  table: BaseTableAPI;
  option: ITableLegendOption;
  orient: 'left' | 'top' | 'right' | 'bottom' | 'z';
  visible: boolean;
  position: 'start' | 'middle' | 'end';
  selectedData: (string | number)[];
  legendComponent: DiscreteLegend;

  constructor(option: ITableLegendOption, table: BaseTableAPI) {
    this.table = table;
    this.option = cloneDeep(option);
    this.orient = option.orient ?? 'left';
    this.visible = option.visible ?? true;
    this.position = option.position ?? 'middle';
    this.selectedData = option.defaultSelected ?? [];

    this.createComponent();
    this.initEvent();
  }

  createComponent() {
    const attrs = this.getLegendAttributes({
      width: this.table.tableNoFrameWidth,
      height: this.table.tableNoFrameHeight
    });
    const legend = new DiscreteLegend(
      merge({}, attrs, {
        defaultSelected: this.selectedData
      })
    );
    legend.name = 'legend';
    this.legendComponent = legend;
    this.table.scenegraph.stage.defaultLayer.appendChild(legend);

    // 调整位置
    const width = isFinite(this.legendComponent.AABBBounds.width()) ? this.legendComponent.AABBBounds.width() : 0;
    const height = isFinite(this.legendComponent.AABBBounds.height()) ? this.legendComponent.AABBBounds.height() : 0;
    const rectWidth = this.table.tableNoFrameWidth;
    const rectHeight = this.table.tableNoFrameHeight;

    let x = 0;
    let y = 0;
    if (this.orient === 'left') {
      x = 0;
      y = 0;
    } else if (this.orient === 'top') {
      x = 0;
      y = 0;
    } else if (this.orient === 'right') {
      x = rectWidth - width;
      y = 0;
    } else if (this.orient === 'bottom') {
      x = 0;
      y = rectHeight - height;
    }

    const layout = this.orient === 'bottom' || this.orient === 'top' ? 'horizontal' : 'vertical';
    const position = this.position;
    // const { width: rectWidth, height: rectHeight } = fullSpace;
    let offsetX = 0;
    let offsetY = 0;
    if (layout === 'horizontal') {
      if (position === 'middle') {
        offsetX = (rectWidth - width) / 2;
      } else if (position === 'end') {
        offsetX = rectWidth - width;
      }
    } else {
      if (position === 'middle') {
        offsetY = (rectHeight - height) / 2;
      } else if (position === 'end') {
        offsetY = rectHeight - height;
      }
    }

    this.legendComponent.setAttributes({
      dx: offsetX,
      dy: offsetY,
      x,
      y
    });
  }

  getLegendAttributes(rect: any) {
    const layout = this.orient === 'bottom' || this.orient === 'top' ? 'horizontal' : 'vertical';
    const attrs = {
      layout,
      items: this.getLegendItems(),
      // zIndex: this.layoutZIndex,
      maxWidth: rect.width,
      maxHeight: rect.height,
      ...getLegendAttributes(this.option, rect)
    };
    return attrs;
  }

  getLegendItems() {
    return this.option.data;
  }

  initEvent() {
    if (this.legendComponent) {
      this.legendComponent.addEventListener(LegendEvent.legendItemClick, (e: any) => {
        const selectedData = get(e, 'detail.currentSelected');
        this.table.fireListeners(TABLE_EVENT_TYPE.LEGEND_ITEM_CLICK, { model: this, value: selectedData, event: e });
      });

      this.legendComponent.addEventListener(LegendEvent.legendItemHover, (e: any) => {
        const detail = get(e, 'detail');
        this.table.fireListeners(TABLE_EVENT_TYPE.LEGEND_ITEM_HOVER, { model: this, value: detail, event: e });
      });

      this.legendComponent.addEventListener(LegendEvent.legendItemUnHover, (e: any) => {
        const detail = get(e, 'detail');
        this.table.fireListeners(TABLE_EVENT_TYPE.LEGEND_ITEM_UNHOVER, { model: this, value: detail, event: e });
      });
    }
  }

  getLegendBounds() {
    const width = isFinite(this.legendComponent.AABBBounds.width()) ? this.legendComponent.AABBBounds.width() : 0;
    const height = isFinite(this.legendComponent.AABBBounds.height()) ? this.legendComponent.AABBBounds.height() : 0;

    return {
      width: width,
      height: height
    };
  }
}
