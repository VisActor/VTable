import Inula from 'openinula';
import type { ListTable, PivotTable, PivotChart } from '@visactor/vtable';

const React = Inula; // hack for createElement, wait for fixed in gulp config

export interface TableContextType {
  table?: ListTable | PivotTable | PivotChart;
  // optionFromChildren: any;
  isChildrenUpdated?: boolean;
}

const TableContext = Inula.createContext<TableContextType>(null);
TableContext.displayName = 'TableContext';

export function withTableInstance<T>(Component: typeof Inula.Component) {
  const Com = Inula.forwardRef<any, T>((props: T, ref) => {
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
