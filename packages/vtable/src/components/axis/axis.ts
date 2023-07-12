import { cloneDeep, merge } from '@visactor/vutils';
import { BandScale, LinearScale } from '@visactor/vscale';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ICellAxisOption } from '../../ts-types/component/axis';
import { LineAxis, type LineAxisAttributes } from '@visactor/vrender-components';
import { getAxisAttributes } from './get-axis-attributes';
import { isXAxis, isYAxis } from '../util/orient';
import type { IOrientType } from '../../ts-types/component/util';

export class CartesianAxis {
  table: BaseTableAPI;
  option: ICellAxisOption;
  orient: IOrientType;
  visible: boolean;
  type: 'linear' | 'band' | 'time';
  inverse: boolean;
  data: any[];
  tickData: any[];
  scale: BandScale | LinearScale;
  component: LineAxis;

  constructor(option: ICellAxisOption, data: any[], table: BaseTableAPI) {
    this.table = table;
    this.option = cloneDeep(option);
    this.orient = option.orient ?? 'left';
    this.visible = option.visible ?? true;
    this.type = option.type ?? 'band';
    this.inverse = 'inverse' in option ? !!option.inverse : false;
    this.data = data;

    this.initScale();
    this.initData();
    this.createComponent();
    this.initEvent();
  }

  initScale() {
    if (this.type === 'band') {
      this.scale = new BandScale();
      // this.scale.paddingInner(0.1, true).paddingOuter(0.3);
    } else if (this.type === 'linear' || this.type === 'time') {
      this.scale = new LinearScale();
    }
  }

  initData() {
    this.tickData = [
      {
        id: 'A',
        label: 'A',
        value: 0.2,
        rawValue: 'A'
      },
      {
        id: 'E',
        label: 'E',
        value: 0.5,
        rawValue: 'E'
      },
      {
        id: 'H',
        label: 'H',
        value: 0.8,
        rawValue: 'H'
      }
    ];
    // registerDataSetInstanceParser(this._option.dataSet, 'scale', scaleParser);
    // registerDataSetInstanceTransform(this._option.dataSet, 'ticks', ticks);

    // const label = this._spec.label || {};
    // const tick = this._tick || {};
    // const tickData = new DataView(this._option.dataSet)
    //   .parse(this._scale, {
    //     type: 'scale'
    //   })
    //   .transform(
    //     {
    //       type: 'ticks',
    //       options: {
    //         tickCount: tick.tickCount,
    //         forceTickCount: tick.forceTickCount,
    //         tickStep: tick.tickStep,

    //         axisOrientType: this._orient,
    //         coordinateType: 'cartesian',

    //         labelStyle: label.style,
    //         labelFormatter: label.formatMethod,
    //         labelGap: label.minGap,

    //         labelLastVisible: label.lastVisible,
    //         labelFlush: label.flush
    //       } as ICartesianTickDataOpt
    //     },
    //     false
    //   );
    // tickData.target.addListener('change', this._forceLayout.bind(this));

    // this._tickData = new CompilableData(this._option, tickData);
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

  getLabelItems(axisLength: number) {
    return [this.tickData];
  }
}
