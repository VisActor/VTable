import type { ICartesianAxisSpec } from '@visactor/vchart';

export type ICellAxisOption = Omit<ICartesianAxisSpec, 'type'> &
  (
    | {
        type: 'band';
        domain: (number | string)[];
      }
    | {
        type: 'linear' | 'time';
        range: {
          min: number;
          max: number;
        };
        __ticksForVTable?: number[];
      }
  );

export type ITableAxisOption = ICartesianAxisSpec;
