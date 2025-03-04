import { cloneDeep, get, merge } from '@visactor/vutils';
import type { IColorTableLegendOption, ISizeTableLegendOption } from '../../../ts-types/component/legend';
import type { BaseTableAPI } from '../../../ts-types/base-table';
import { ColorContinuousLegend, SizeContinuousLegend, LegendEvent } from '@src/vrender';
import { getContinuousLegendAttributes } from './get-continue-legend-attributes';
import { TABLE_EVENT_TYPE } from '../../../core/TABLE_EVENT_TYPE';
import { getQuadProps } from '../../../scenegraph/utils/padding';
import type { IOrientType } from '../../../ts-types/component/util';

export class ContinueTableLegend {
  table: BaseTableAPI;
  option: IColorTableLegendOption | ISizeTableLegendOption;
  orient: IOrientType;
  visible: boolean;
  position: 'start' | 'middle' | 'end';
  selectedData: (string | number)[];
  legendComponent: ColorContinuousLegend | SizeContinuousLegend;

  constructor(option: IColorTableLegendOption | ISizeTableLegendOption, table: BaseTableAPI) {
    this.table = table;
    this.option = cloneDeep(option);
    this.orient = option.orient ?? 'left';
    this.visible = option.visible ?? true;
    this.position = option.position ?? 'middle';
    this.selectedData = option.defaultSelected ?? null;

    this.createComponent();
    this.initEvent();
  }

  createComponent() {
    const attrs = this.getLegendAttributes({
      width: this.table.tableNoFrameWidth,
      height: this.table.tableNoFrameHeight
    });

    let legend;
    if (this.option.type === 'color') {
      legend = new ColorContinuousLegend(
        merge({}, attrs, {
          slidable: true
          // defaultSelected: this.selectedData
        })
      );
    } else {
      legend = new SizeContinuousLegend(
        merge({}, attrs, {
          slidable: true
          // defaultSelected: this.selectedData
        })
      );
    }
    legend.name = 'legend';
    this.legendComponent = legend;
    if (this.visible === false) {
      legend.setAttributes({
        visible: false,
        visibleAll: false
      });
      legend.hideAll();
    }
    this.table.scenegraph.stage.defaultLayer.appendChild(legend);

    this.adjustTableSize(attrs);
  }

  resize() {
    if (!this.legendComponent || this.visible === false) {
      return;
    }

    this.legendComponent.setAttributes({
      width: this.table.tableNoFrameWidth,
      height: this.table.tableNoFrameHeight
    });

    this.adjustTableSize(this.legendComponent.attribute);
  }

  adjustTableSize(attrs: any) {
    if (!this.legendComponent || this.visible === false) {
      return;
    }
    // 调整位置
    let width = isFinite(this.legendComponent.AABBBounds.width()) ? this.legendComponent.AABBBounds.width() : 0;
    let height = isFinite(this.legendComponent.AABBBounds.height()) ? this.legendComponent.AABBBounds.height() : 0;
    if (width <= 0 || height <= 0) {
      return;
    }
    const rectWidth = this.table.tableNoFrameWidth;
    const rectHeight = this.table.tableNoFrameHeight;
    const padding = getQuadProps(attrs.padding ?? this.option.padding ?? 10);

    let x = 0;
    let y = 0;
    if (this.orient === 'left') {
      x = padding[3];
      y = 0;
      width += padding[1] + padding[3];
    } else if (this.orient === 'top') {
      x = 0;
      y = padding[0];
      height += padding[0] + padding[2];
    } else if (this.orient === 'right') {
      x = rectWidth - width - padding[1];
      y = 0;
      width += padding[1] + padding[3];
    } else if (this.orient === 'bottom') {
      x = 0;
      y = rectHeight - height - padding[2];
      height += padding[0] + padding[2];
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
        offsetX = rectWidth - width - padding[1];
      } else {
        offsetX = padding[3];
      }
    } else {
      if (position === 'middle') {
        offsetY = (rectHeight - height) / 2;
      } else if (position === 'end') {
        offsetY = rectHeight - height - padding[2];
      } else {
        offsetY = padding[0];
      }
    }

    this.legendComponent.setAttributes({
      dx: offsetX,
      dy: offsetY,
      x,
      y
    });

    // update table size
    if (this.orient === 'left') {
      this.table.tableNoFrameWidth = this.table.tableNoFrameWidth - Math.ceil(width);
      this.table.tableX += Math.ceil(width);
    } else if (this.orient === 'top') {
      this.table.tableNoFrameHeight = this.table.tableNoFrameHeight - Math.ceil(height);
      this.table.tableY += Math.ceil(height);
    } else if (this.orient === 'right') {
      this.table.tableNoFrameWidth = this.table.tableNoFrameWidth - Math.ceil(width);
    } else if (this.orient === 'bottom') {
      this.table.tableNoFrameHeight = this.table.tableNoFrameHeight - Math.ceil(height);
    }
  }

  getLegendAttributes(rect: any) {
    const layout = this.orient === 'bottom' || this.orient === 'top' ? 'horizontal' : 'vertical';
    const align = layout === 'horizontal' ? 'bottom' : this.orient;

    const attrs = {
      ...getContinuousLegendAttributes(this.option, rect),
      layout,
      align,
      // zIndex: this.layoutZIndex,
      min: this.option.min,
      max: this.option.max,
      value: this.option.value,
      [this.option.type === 'color' ? 'colors' : 'sizeRange']:
        this.option.type === 'color'
          ? (this.option as IColorTableLegendOption).colors
          : (this.option as ISizeTableLegendOption).sizeRange
    };
    return attrs;
  }

  initEvent() {
    if (this.legendComponent) {
      this.legendComponent.addEventListener('change', (e: any) => {
        const selectedData = get(e, 'detail.value');
        this.table.fireListeners(TABLE_EVENT_TYPE.LEGEND_CHANGE, { model: this, value: selectedData, event: e });
        this.table.scenegraph.updateNextFrame();
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
  release() {
    this.legendComponent && this.table.scenegraph.stage.defaultLayer.removeChild(this.legendComponent);
    this.legendComponent = null;
  }
}
