import type { ICartesianAxisSpec } from '@visactor/vchart';

export type ICellAxisOption = Omit<ICartesianAxisSpec, 'type'> &
  (
    | {
        type: 'band';
        data: (number | string)[];
      }
    | {
        type: 'linear' | 'time';
        range: {
          min: number;
          max: number;
        };
      }
  );
