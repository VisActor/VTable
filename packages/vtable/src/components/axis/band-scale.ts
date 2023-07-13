import { BandScale } from '@visactor/vscale';
import { isArray, isValidNumber } from '@visactor/vutils';

type StringOrNumber = string | number;

export class BandAxisScale {
  _scale: BandScale;
  _scales: BandScale[];
  bandPadding?: number | number[];
  paddingInner?: number | number[];
  paddingOuter?: number | number[];

  constructor() {
    this._scale = new BandScale();
    this._scales = [this._scale];
  }

  valueToPosition(value: any): number {
    const bandStart = this._scale.scale(value);
    return bandStart;
  }
  updateGroupScaleRange() {
    let parentScale = this._scale;
    this._scales.forEach((scale, i) => {
      if (i > 0) {
        scale.range([0, parentScale.bandwidth()]);
        parentScale = scale;
      }
    });
  }

  getPosition(values: any[]) {
    let position = 0;
    let bandScale = this._scale;
    // 要不要性能优化？
    // 优化有没有用？
    if (this._scales.length === 1 || values.length === 1) {
      position = this.valueToPosition(values[0]);
    } else {
      const max = Math.min(values.length, this._scales.length);
      for (let i = 0; i < max; i++) {
        position += this._scales[i].scale(values[i]);
      }
      bandScale = this._scales[max - 1];
    }
    return { position, bandScale };
  }
  calcScales(defalutBandInnerPadding: number, defalutBandOuterPadding: number) {
    const { bandPadding, paddingInner, paddingOuter } = this;
    const isBandPaddingArray = isArray(bandPadding);
    const isPaddingInnerArray = isArray(paddingInner);
    const isPaddingOuterArray = isArray(paddingOuter);
    for (let i = 0; i < this._scales.length; i++) {
      const _padding = isBandPaddingArray ? bandPadding[i] : bandPadding;
      const _paddingInner = isPaddingInnerArray ? paddingInner[i] : paddingInner;
      const _paddingOuter = isPaddingOuterArray ? paddingOuter[i] : paddingOuter;

      this._scales[i]
        .paddingInner(_paddingInner ?? _padding ?? defalutBandInnerPadding, true)
        .paddingOuter(_paddingOuter ?? _padding ?? defalutBandOuterPadding);
    }
  }
  computeBandDomain(data: { min: number; max: number; values: any[] }[]): StringOrNumber[] {
    // const values = data.map(d => d.values);
    // return Array.from(new Set(values.flat()));

    // // 性能优化 old
    // const reuslt = {};
    // data.forEach(d => d.values.forEach(v => (reuslt[v] = true)));
    // return Object.keys(reuslt);

    // 性能优化 9.13
    const tempSet = new Set();
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].values.length; j++) {
        tempSet.add(data[i].values[j]);
      }
    }
    return Array.from(tempSet) as StringOrNumber[];
  }

  dataToPosition(values: any[], cfg: any = {}): number {
    if (values.length === 0 || this._scales.length === 0) {
      return 0;
    }
    const { position, bandScale } = this.getPosition(values);

    return position + bandScale.bandwidth() * (cfg.bandPosition ?? 0.5);
  }

  updateScaleDomain(domain: (number | string)[]) {
    for (let i = 0; i < this._scales.length; i++) {
      this._scales[i].domain(domain);
    }
    // this.transformScaleDomain();
  }

  updateRange(newRange: [number, number]) {
    const [start, end] = this._scale.range();
    if (newRange[0] !== start || newRange[1] !== end) {
      this._scale.range(newRange);
    }
  }
}
