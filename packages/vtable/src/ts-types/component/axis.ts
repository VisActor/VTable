import type { ICartesianAxisSpec } from '@visactor/vchart';

export type ICellAxisOption = Omit<ICartesianAxisSpec, 'type'> & {
  type: 'linear' | 'band' | 'time';
};
