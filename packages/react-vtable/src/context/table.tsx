import React from 'react';
import type { ListTable, PivotTable, PivotChart } from '@visactor/vtable';

export interface TableContextType {
  table?: ListTable | PivotTable | PivotChart;
  // optionFromChildren: any;
  isChildrenUpdated?: boolean;
}

const TableContext = React.createContext<TableContextType>(null);
TableContext.displayName = 'TableContext';

export function withTableInstance<T>(Component: typeof React.Component) {
  const Com = React.forwardRef<any, T>((props: T, ref) => {
    return (
      <TableContext.Consumer>
        {(ctx: TableContextType) => <Component ref={ref} table={ctx.table} {...props} />}
      </TableContext.Consumer>
    );
  });
  Com.displayName = Component.name;
  return Com;
}

export default TableContext;
