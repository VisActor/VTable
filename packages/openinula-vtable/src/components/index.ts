import type Inula from 'openinula';
export { ListColumn } from './list/list-column';
export { PivotColumnDimension, PivotRowDimension } from './pivot/pivot-dimension';
export { PivotIndicator } from './pivot/pivot-indicator';
export { PivotColumnHeaderTitle, PivotRowHeaderTitle } from './pivot/pivot-header-title';
export { PivotCorner } from './pivot/pivot-corner';
export { Menu } from './component/menu';
export { Tooltip } from './component/tooltip';

type Props = { updateId?: number };

export interface IMarkElement extends Inula.InulaElement<Props, Inula.JSXElementConstructor<Props>> {
  id: string | number;
}
