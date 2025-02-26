// TODO: import from '@visactor/vchart'
import type { IDiscreteLegendSpec, IColorLegendSpec, ISizeLegendSpec } from '@visactor/vchart/esm/component/legend';
import type { LegendItemDatum } from '@src/vrender';

export type IDiscreteTableLegendOption = Omit<IDiscreteLegendSpec, 'data'> & { data: LegendItemDatum[] };
export type IColorTableLegendOption = Omit<IColorLegendSpec, 'field' | 'scale'> & {
  value: [number, number];
  min: number;
  max: number;
  colors: string[];
};
export type ISizeTableLegendOption = Omit<ISizeLegendSpec, 'field' | 'scale'> & {
  value: [number, number];
  min: number;
  max: number;
  sizeRange: [number, number];
};
export type ITableLegendOption = IDiscreteTableLegendOption | IColorTableLegendOption | ISizeTableLegendOption;
