// import type { ICartesianAxisSpec } from '@visactor/vchart';

// export type ICellAxisOption = Omit<ICartesianAxisSpec, 'type'> &
//   (
//     | {
//         type: 'band';
//         domain: (number | string)[];
//         __vtableChartTheme?: any;
//       }
//     | {
//         type: 'linear' | 'time';
//         range: {
//           min: number;
//           max: number;
//         };
//         __ticksForVTable?: number[];
//         __vtableChartTheme?: any;
//       }
//   );
export type ICellAxisOption = any;
export type ITableAxisOption = ICellAxisOption;
