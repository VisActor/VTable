import { LinearScale, LogScale, SymlogScale } from '@visactor/vscale';
import { isNil, isValid, maxInArray, minInArray } from '@visactor/vutils';

const e10 = Math.sqrt(50);
const e5 = Math.sqrt(10);
const e2 = Math.sqrt(2);

type IRange = { max?: number; min?: number };
export class LinearAxisScale {
  protected _extend: { [key: string]: number } = {};
  _scale: LinearScale | LogScale | SymlogScale;
  _scales: (LinearScale | LogScale | SymlogScale)[];
  nice: boolean;
  zero: boolean;
  domain: Required<IRange>;
  expand?: IRange;
  forceTickCount?: number;
  tickCount?: number;
  niceType?: 'tickCountFirst' | 'accurateFirst';
  type?: 'linear' | 'time' | 'log' | 'symlog';

  constructor(type?: 'linear' | 'time' | 'log' | 'symlog') {
    this.type = type ?? 'linear';
    if (type === 'log') {
      this._scale = new LogScale();
    } else if (type === 'symlog') {
      this._scale = new SymlogScale();
    } else {
      this._scale = new LinearScale();
    }
    this._scales = [this._scale];
  }

  setExtraAttrFromSpec(
    nice: boolean,
    zero: boolean,
    range: Required<IRange>,
    expand?: IRange,
    base?: number,
    constant?: number
  ) {
    // this.nice = nice;
    this.nice = false; // nice deal in getAxisDomainRangeAndLabels()
    this.zero = zero;
    // this.domain = range;
    if (this.zero) {
      range.min = Math.min(range.min, 0);
      range.max = Math.max(range.max, 0);
    }
    this.domain = range;
    this.expand = expand;

    if (this.type === 'log') {
      (this._scale as LogScale).base(base ?? 10);
    } else if (this.type === 'symlog') {
      (this._scale as SymlogScale).constant(constant ?? 10);
    }
  }

  transformScaleDomain() {
    if (this.type === 'symlog' || this.type === 'log') {
      // do nothing
    } else {
      this.setScaleNice();
    }
  }

  setScaleNice() {
    if (this.type === 'log') {
      this.setLogScaleNice();
    } else {
      this.setLinearScaleNice();
    }
  }

  setLogScaleNice() {
    if (isNil(this.domain?.min) && isNil(this.domain?.max)) {
      this.nice && this._scale.nice();
    } else if (isValid(this.domain?.min) && isNil(this.domain?.max)) {
      this.nice && this._scale.niceMax();
    } else if (isNil(this.domain?.min) && isValid(this.domain?.max)) {
      this.nice && this._scale.niceMin();
    }
  }

  setLinearScaleNice() {
    let tickCount = this.forceTickCount ?? this.tickCount ?? 10;
    // 如果配置了精度优先，那么最低是10
    // 否则就直接使用tickCount即可
    if (this.niceType === 'accurateFirst') {
      tickCount = Math.max(10, tickCount);
    }

    if (isNil(this.domain?.min) && isNil(this.domain?.max)) {
      this.nice && this._scale.nice(tickCount);
    } else if (isValid(this.domain?.min) && isNil(this.domain?.max)) {
      this.nice && this._scale.niceMax(tickCount);
    } else if (isNil(this.domain?.min) && isValid(this.domain?.max)) {
      this.nice && this._scale.niceMin(tickCount);
    } else {
      this.nice && this._scale.nice(tickCount);
    }
  }
  dataToPosition(values: any[]): number {
    return this.valueToPosition(values[0]);
  }

  valueToPosition(value: any): number {
    return this._scale.scale(value);
  }

  computeLinearDomain(data: { min: number; max: number }[]): number[] {
    const domain: number[] = [];
    data.forEach(d => {
      const { min, max } = d;
      domain[0] = domain[0] === undefined ? min : Math.min(domain[0] as number, min as number);
      domain[1] = domain[1] === undefined ? max : Math.max(domain[1] as number, max as number);
    });
    this.expandDomain(domain);
    this.includeZero(domain);
    this.setDomainMinMax(domain);
    return domain;
  }

  protected expandDomain(domain: number[]): void {
    if (!this.expand) {
      return;
    }
    const domainMin = domain[0];
    const domainMax = domain[domain.length - 1];
    if (isValid(this.expand.min)) {
      domain[0] = domainMin - (domainMax - domainMin) * this.expand.min;
    }
    if (isValid(this.expand.max)) {
      domain[domain.length - 1] = domainMax + (domainMax - domainMin) * this.expand.max;
    }
  }

  protected niceDomain(domain: number[]) {
    if (isValid(domain[0]) || isValid(domain[1]) || this.type !== 'linear') {
      // 如果用户设置了 min 或者 max 则按照用户设置的为准
      // 如果是非 linear 类型也不处理
      return domain;
    }
    if (Math.abs(minInArray(domain) - maxInArray(domain)) <= 1e-12) {
      let num: number = domain[0];
      const flag = num >= 0 ? 1 : -1;
      num = Math.abs(num);
      if (num < 1) {
        domain[0] = 0;
        domain[1] = 1; // 在[0, 1) 区间变成[0, 1]
      } else {
        let step = num / 5; // 默认5个ticks
        const power = Math.floor(Math.log(step) / Math.LN10);
        const err = step / Math.pow(10, power);
        step = (err >= e10 ? 10 : err >= e5 ? 5 : err >= e2 ? 2 : 1) * Math.pow(10, power);

        domain[0] = 0;
        domain[1] = step * 10;
      }
      if (flag < 0) {
        domain.reverse();
        domain[0] *= -1;
        domain[1] *= -1;
      }
    }
    return domain;
  }

  protected niceMinMax() {
    if (this.nice) {
      let tickCount = this.forceTickCount ?? this.tickCount ?? 10;
      // 如果配置了精度优先，那么最低是10
      // 否则就直接使用tickCount即可
      if (this.niceType === 'accurateFirst') {
        tickCount = Math.max(10, tickCount);
      }
      if (isNil(this.domain?.min) && isNil(this.domain?.max)) {
        this._scale.nice(tickCount);
      } else if (isValid(this.domain?.min) && isNil(this.domain?.max)) {
        this._scale.niceMax(tickCount);
      } else if (isNil(this.domain?.min) && isValid(this.domain?.max)) {
        this._scale.niceMin(tickCount);
      } else {
        this._scale.nice(tickCount);
      }
    }
  }

  protected includeZero(domain: number[]): void {
    if (this.zero) {
      domain[0] = Math.min(domain[0], 0);
      domain[domain.length - 1] = Math.max(domain[domain.length - 1], 0);
    }
  }

  // 用户其他模块扩充轴scale的区间
  setExtendDomain(key: string, value: number | undefined) {
    if (value === undefined) {
      delete this._extend[key];
      return;
    }
    this._extend[key] = value;
    const domain = this._scale.domain();
    this.extendDomain(domain);
    this.includeZero(domain);
    this.setDomainMinMax(domain);
    this.niceDomain(domain);
    this._scale.domain(domain, this.nice);
    this.niceMinMax();

    // this.event.emit(ChartEvent.scaleUpdate, { model: this as any });
  }

  protected extendDomain(domain: number[]) {
    let temp;
    const domainLast = domain.length - 1;
    const reverse = domain[0] - domain[domainLast] > 0;
    const min = reverse ? domainLast : 0;
    const max = reverse ? 0 : domainLast;
    for (const key in this._extend) {
      temp = this._extend[key];
      temp > domain[max] && (domain[max] = temp);
      temp < domain[min] && (domain[min] = temp);
    }
  }

  protected setDomainMinMax(domain: number[]): void {
    if (!this.domain) {
      return;
    }
    const { min, max } = this.domain;
    isValid(min) && (domain[0] = min);
    isValid(max) && (domain[1] = max);
  }

  setZero(zero: boolean) {
    if (this.zero !== zero) {
      this.zero = zero;
      this.updateScaleDomain();
    }
  }
  /**
   * @override
   * TODO event.emit是否可以考虑用decorator
   */
  updateScaleDomain() {
    const domain: number[] = this.computeDomain([this.domain]) as number[];
    this.updateScaleDomainByModel(domain);
  }

  computeDomain(data: { min: number; max: number }[]): number[] {
    return this.computeLinearDomain(data);
  }

  /**
   * TODO event.emit是否可以考虑用decorator
   * 数据逻辑外，模块的设置更新对scale-domain的修改操作
   */
  protected updateScaleDomainByModel(domain?: number[]) {
    domain = domain ?? this._scale.domain();
    // 其他模块的设置 domain
    this.extendDomain(domain);
    this.includeZero(domain);
    // 用户 spec 的 min-max
    this.setDomainMinMax(domain);
    // nice 优先级最高
    this.niceDomain(domain);
    this._scale.domain(domain, this.nice);
    // 设置scale的nice-min-max
    this.niceMinMax();

    // this.event.emit(ChartEvent.scaleUpdate, { model: this as any });
  }

  updateRange(newRange: [number, number]) {
    const [start, end] = this._scale.range();
    if (newRange[0] !== start || newRange[1] !== end) {
      this._scale.range(newRange);
    }
  }
}
