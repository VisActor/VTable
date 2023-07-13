import { isValidNumber, merge } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ICellAxisOption } from '../../ts-types/component/axis';
import { LineAxis, type LineAxisAttributes } from '@visactor/vrender-components';
import { commonAxis, getAxisAttributes } from './get-axis-attributes';
import { isXAxis, isYAxis } from '../util/orient';
import type { IOrientType } from '../../ts-types/component/util';
import { BandAxisScale } from './band-scale';
import { registerDataSetInstanceParser, registerDataSetInstanceTransform } from '../util/register';
import type { Parser } from '@visactor/vdataset';
import { DataView } from '@visactor/vdataset';
import type { IBaseScale } from '@visactor/vscale';
import { ticks } from '@visactor/vchart/esm/data/transforms/tick-data';

const DEFAULT_BAND_INNER_PADDING = 0.1;
const DEFAULT_BAND_OUTER_PADDING = 0.3;
const scaleParser: Parser = (scale: IBaseScale) => {
  return scale;
};

export class CartesianAxis {
  table: BaseTableAPI;
  option: ICellAxisOption;
  orient: IOrientType;
  visible: boolean;
  type: 'linear' | 'band' | 'time';
  inverse: boolean;
  data?: any[];
  tickData: DataView;
  scale: BandAxisScale;
  component: LineAxis;

  constructor(option: ICellAxisOption, table: BaseTableAPI) {
    this.table = table;
    // this.option = cloneDeep(option);
    this.option = merge({}, option, commonAxis);

    this.orient = option.orient ?? 'left';
    this.visible = option.visible ?? true;
    this.type = option.type ?? 'band';
    this.inverse = 'inverse' in option ? !!option.inverse : false;
    if (option.type === 'band') {
      this.data = option.data;
    }

    this.initScale();
    this.initData();
    this.createComponent();
    this.initEvent();
  }

  initScale() {
    // if (this.type === 'band') {
    this.scale = new BandAxisScale();
    this.scale.bandPadding = (this.option as any).bandPadding;
    this.scale.paddingInner = (this.option as any).paddingInner;
    this.scale.paddingOuter = (this.option as any).paddingOuter;
    this.scale.calcScales(DEFAULT_BAND_INNER_PADDING, DEFAULT_BAND_OUTER_PADDING); // 0.1 0.3
    this.scale.updateScaleDomain(this.data);
    this.updateScaleRange();
    // } else if (this.type === 'linear' || this.type === 'time') {
    //   this.scale = new LinearScale();
    // }
  }
  initData() {
    // this.tickData = [
    //   {
    //     index: 0,
    //     label: 'A',
    //     value: 'A'
    //   },
    //   {
    //     index: 1,
    //     label: 'B',
    //     value: 'B'
    //   },
    //   {
    //     index: 2,
    //     label: 'C',
    //     value: 'C'
    //   }
    // ];
    registerDataSetInstanceParser(this.table.dataSet, 'scale', scaleParser);
    registerDataSetInstanceTransform(this.table.dataSet, 'ticks', ticks);

    const label = this.option.label || {};
    const tick = this.option.tick || {};
    const tickData = new DataView(this.table.dataSet)
      .parse(this.scale._scale, {
        type: 'scale'
      })
      .transform(
        {
          type: 'ticks',
          options: {
            tickCount: tick.tickCount,
            forceTickCount: tick.forceTickCount,
            tickStep: tick.tickStep,

            axisOrientType: this.orient,
            coordinateType: 'cartesian',

            labelStyle: label.style,
            labelFormatter: label.formatMethod,
            // labelGap: label.minGap,

            labelLastVisible: label.lastVisible,
            labelFlush: label.flush
          }
        },
        false
      );
    this.tickData = tickData;

    this.computeData();
  }

  computeData(): void {
    this.tickData.reRunAllTransform();
  }

  initEvent() {
    // to be added
  }

  createComponent() {
    const axisStylrAttrs = getAxisAttributes(this.option);
    const attrs = this.getUpdateAttribute(true);
    this.component = new LineAxis(merge({}, axisStylrAttrs, attrs));
  }

  getLayoutRect() {
    return {
      width: 80,
      height: 40
    };
  }

  getUpdateAttribute(ignoreGrid: boolean) {
    // 获取更新的坐标轴属性
    // let regionHeight = 0;
    // let regionWidth = 0;

    const { width, height } = this.getLayoutRect();
    const isX = isXAxis(this.orient);
    const isY = isYAxis(this.orient);
    let end = { x: 0, y: 0 };
    // let gridLength = 0;
    let axisLength = 0;
    if (isX) {
      end = { x: width, y: 0 };
      // gridLength = regionHeight;
      axisLength = width;
    } else if (isY) {
      end = { x: 0, y: height };
      // gridLength = regionWidth;
      axisLength = height;
    }
    const attrs: LineAxisAttributes = {
      start: { x: 0, y: 0 },
      end,
      // grid: {
      //   type: 'line',
      //   length: gridLength,
      //   visible: this._spec.grid.visible && !ignoreGrid
      // },
      // title: {
      //   text: this._spec.title.text || this._dataFieldText,
      //   maxWidth: this._getTitleLimit(isX)
      // },
      items: this.getLabelItems(axisLength)
    };
    return attrs;
  }

  getLabelItems(length: number) {
    return [
      this.tickData.latestData
        .map((obj: any) => {
          return {
            id: obj.value,
            label: obj.value,
            value: length === 0 ? 0 : this.scale.dataToPosition([obj.value]) / length,
            rawValue: obj.value
          };
        })
        .filter((entry: any) => entry.value >= 0 && entry.value <= 1)
    ];
  }

  updateScaleRange() {
    const { width, height } = this.getLayoutRect();
    // const inverse = this.option.inverse;
    const inverse = false;
    let newRange: [number, number] = [0, 0];
    if (isXAxis(this.orient)) {
      if (isValidNumber(width)) {
        newRange = inverse ? [width, 0] : [0, width];
      }
    } else {
      if (isValidNumber(height)) {
        newRange = inverse ? [0, height] : [height, 0];
      }
    }

    this.scale.updateRange(newRange);
  }
}
