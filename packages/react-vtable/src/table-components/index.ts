import type React from 'react';
export { ListColumn } from './list/list-column';
export { PivotColumnDimension, PivotRowDimension } from './pivot/pivot-dimension';
export { PivotIndicator } from './pivot/pivot-indicator';
export { PivotColumnHeaderTitle, PivotRowHeaderTitle } from './pivot/pivot-header-title';
export { PivotCorner } from './pivot/pivot-corner';
export { Menu } from './component/menu';
export { Tooltip } from './component/tooltip';
export { EmptyTip } from './component/emptyTip';
export { Title } from './component/title';

export { CustomComponent } from './custom-component';
export { CustomLayout, type CustomLayoutFunctionArg } from './custom/custom-layout';
export * from './custom/graphic';

type Props = { updateId?: number };

export interface IMarkElement extends React.ReactElement<Props, React.JSXElementConstructor<Props>> {
  id: string | number;
}
