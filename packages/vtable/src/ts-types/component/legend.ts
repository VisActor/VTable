// TODO: import from '@visactor/vchart'
import type { IDiscreteLegendSpec } from '@visactor/vchart/esm/component/legend';
import type { LegendItemDatum } from '@visactor/vrender-components';

export type ITableLegendOption = Omit<IDiscreteLegendSpec, 'data'> & { data: LegendItemDatum[] };
