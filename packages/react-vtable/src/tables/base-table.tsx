/* eslint-disable react/display-name */
// import * as VTable from '@visactor/vtable';
// import { VTable } from '../vtable';
import React, { useState, useEffect, useRef, useImperativeHandle, useCallback } from 'react';
import type { ContainerProps } from '../containers/withContainer';
import withContainer from '../containers/withContainer';
import type { TableContextType } from '../context/table';
import RootTableContext from '../context/table';
import { isEqual, isNil, isNumber, pickWithout } from '@visactor/vutils';
import { toArray } from '../util';
import { REACT_PRIVATE_PROPS } from '../constants';
import type { IMarkElement } from '../table-components';
import type {
  EventsProps
  // LegendEventProps,
  // ScrollBarEventProps,
  // BrushEventProps,
  // DataZoomEventProps,
  // PlayerEventProps,
  // DimensionEventProps,
  // HierarchyEventProps,
  // TableLifeCycleEventProps
} from '../eventsUtils';
import { bindEventsToTable, TABLE_EVENTS_KEYS, TABLE_EVENTS } from '../eventsUtils';
import { VTableReactAttributePlugin } from '../table-components/custom/vtable-react-attribute-plugin';
import { reactEnvModule } from '../table-components/custom/vtable-browser-env-contribution';
import { container, isBrowserEnv } from '@visactor/vtable/es/vrender';
import type {
  ListTable,
  PivotTable,
  PivotChart,
  ListTableConstructorOptions,
  PivotTableConstructorOptions,
  PivotChartConstructorOptions
} from '@visactor/vtable';
import type { TYPES } from '@visactor/vtable';

export type IVTable = ListTable | PivotTable | PivotChart;
export type IOption = ListTableConstructorOptions | PivotTableConstructorOptions | PivotChartConstructorOptions;

export type BaseTableProps = EventsProps &
  IOption & {
    vtableConstrouctor?: any;
    type?: string;
    /** 上层container */
    container?: HTMLDivElement;
    /** option */
    option?: IOption;
    /** 数据 */
    records?: Record<string, unknown>[];
    /** 画布宽度 */
    width?: number | string;
    /** 画布高度 */
    height?: number | string;
    skipFunctionDiff?: boolean;
    keepColumnWidthChange?: boolean;

    ReactDOM?: any;

    /** 表格渲染完成事件 */
    onReady?: (instance: IVTable, isInitial: boolean) => void;
    /** throw error when chart run into an error */
    onError?: (err: Error) => void;
  };

// for react-vtable
if (isBrowserEnv()) {
  container.load(reactEnvModule);
}

type Props = React.PropsWithChildren<BaseTableProps>;

const notOptionKeys = [
  ...REACT_PRIVATE_PROPS,
  ...TABLE_EVENTS_KEYS,
  'skipFunctionDiff',
  'onError',
  'onReady',
  'option',
  'records',
  'container',
  'vtableConstrouctor'
];

const getComponentId = (child: React.ReactNode, index: number) => {
  const componentName = child && (child as any).type && ((child as any).type.displayName || (child as any).type.name);
  return `${componentName}-${index}`;
};

const parseOptionFromChildren = (props: Props) => {
  const optionFromChildren: Omit<IOption, 'type' | 'data' | 'width' | 'height'> = {} as any;

  toArray(props.children).map((child, index) => {
    const parseOption = child && (child as any).type && (child as any).type.parseOption;

    if (parseOption && (child as any).props) {
      const childProps = isNil((child as any).props.componentId)
        ? {
            ...(child as any).props,
            componentId: getComponentId(child, index)
          }
        : (child as any).props;

      const optionResult = parseOption(childProps) as {
        optionName: keyof Omit<IOption, 'type' | 'data' | 'width' | 'height'>;
        isSingle: boolean;
        option: any;
      };

      if ((child as React.ReactElement).key) {
        optionResult.option.key = (child as React.ReactElement).key;
      }

      if (optionResult.isSingle) {
        optionFromChildren[optionResult.optionName] = optionResult.option as never;
      } else {
        if (!optionFromChildren[optionResult.optionName]) {
          optionFromChildren[optionResult.optionName] = [] as never;
        }

        optionFromChildren[optionResult.optionName].push(optionResult.option);
      }
    }
  });

  return optionFromChildren;
};

const BaseTable: React.FC<Props> = React.forwardRef((props, ref) => {
  const [updateId, setUpdateId] = useState<number>(0);
  const tableContext = useRef<TableContextType>({});
  useImperativeHandle(ref, () => tableContext.current?.table);
  const hasOption = !!props.option;
  const hasRecords = !!props.records;
  const isUnmount = useRef<boolean>(false);
  const prevOption = useRef(pickWithout(props, notOptionKeys));
  const optionFromChildren = useRef<Omit<IOption, 'records'>>(null);
  const prevRecords = useRef(props.records);
  const eventsBinded = React.useRef<BaseTableProps>(null);
  const skipFunctionDiff = !!props.skipFunctionDiff;
  const keepColumnWidthChange = !!props.keepColumnWidthChange;
  const columnWidths = useRef<Map<string, number>>(new Map());
  const pivotColumnWidths = useRef<{ dimensions: TYPES.IDimensionInfo[]; width: number }[]>([]);
  const pivotHeaderColumnWidths = useRef<number[]>([]);

  const parseOption = useCallback(
    (props: Props) => {
      if (hasOption && props.option) {
        if (hasRecords && props.records) {
          return {
            ...props.option,
            clearDOM: false,
            records: props.records
          };
        }
        return {
          ...props.option,
          clearDOM: false
        };
      }

      return {
        records: props.records,
        ...prevOption.current,
        ...optionFromChildren.current,
        clearDOM: false,
        customConfig: {
          ...prevOption.current.customConfig,
          createReactContainer: true
        }
        // ...tableContext.current?.optionFromChildren
      };
    },
    [hasOption, hasRecords]
  );

  const createTable = useCallback(
    (props: Props) => {
      const vtable = new props.vtableConstrouctor(props.container, parseOption(props));
      vtable.scenegraph.stage.reactAttribute = props.ReactDOM;
      vtable.scenegraph.stage.pluginService.register(new VTableReactAttributePlugin());
      vtable.scenegraph.stage.params.ReactDOM = props.ReactDOM;
      tableContext.current = { ...tableContext.current, table: vtable };
      isUnmount.current = false;

      columnWidths.current.clear();
      pivotColumnWidths.current = [];
      pivotHeaderColumnWidths.current = [];

      vtable.on('resize_column_end', (args: { col: number; colWidths: number[] }) => {
        const table = tableContext.current.table;
        if (!keepColumnWidthChange) {
          return;
        }
        const { col, colWidths } = args;
        const width = colWidths[col];
        if (vtable.isPivotTable()) {
          const path = (table as PivotTable).getCellHeaderPaths(col, table.columnHeaderLevelCount);
          let dimensions;
          if (path.cellLocation === 'rowHeader') {
            dimensions = path.rowHeaderPaths as TYPES.IDimensionInfo[];
          } else {
            dimensions = path.colHeaderPaths as TYPES.IDimensionInfo[];
          }

          let found = false;
          pivotColumnWidths.current.forEach(item => {
            if (JSON.stringify(item.dimensions) === JSON.stringify(dimensions)) {
              item.width = width;
              found = true;
            }
          });
          if (!found) {
            pivotColumnWidths.current.push({ dimensions, width });
          }
        } else {
          const define = table.getBodyColumnDefine(col, 0);
          if ((define as any)?.key) {
            columnWidths.current.set((define as any).key, width);
          }
        }
      });
    },
    [parseOption]
  );

  const handleTableRender = useCallback(() => {
    if (!isUnmount.current) {
      if (!tableContext.current || !tableContext.current.table) {
        return;
      }
      // rebind events after render
      bindEventsToTable(tableContext.current.table, props, eventsBinded.current, TABLE_EVENTS);

      // to be fixed
      // will cause another useEffect
      setUpdateId(updateId + 1);
      if (props.onReady) {
        props.onReady(tableContext.current.table, updateId === 0);
      }
    }
  }, [updateId, setUpdateId, props]);

  const renderTable = useCallback(() => {
    if (tableContext.current.table) {
      // eslint-disable-next-line promise/catch-or-return
      tableContext.current.table.render();
      handleTableRender();
    }
  }, [handleTableRender]);

  useEffect(() => {
    const newOptionFromChildren = hasOption ? null : parseOptionFromChildren(props);

    if (!tableContext.current?.table) {
      if (!hasOption) {
        optionFromChildren.current = newOptionFromChildren;
      }

      createTable(props);
      renderTable();
      // bindEventsToTable(tableContext.current.table, props, null, TABLE_EVENTS);
      // tableContext.current = {
      //   ...tableContext.current,
      //   isChildrenUpdated: false
      // };
      eventsBinded.current = props;
      return;
    }

    if (hasOption) {
      if (!isEqual(eventsBinded.current.option, props.option, { skipFunction: skipFunctionDiff })) {
        const option = parseOption(props);
        if (keepColumnWidthChange) {
          const columnWidthConfig = updateWidthCache(
            columnWidths.current,
            pivotColumnWidths.current,
            tableContext.current.table
          );
          (option as any).columnWidthConfig = columnWidthConfig;
          (option as any).columnWidthConfigForRowHeader = columnWidthConfig;
        }
        // eslint-disable-next-line promise/catch-or-return
        tableContext.current.table.updateOption(option as any);
        handleTableRender();
        eventsBinded.current = props;
      } else if (
        hasRecords &&
        !isEqual(eventsBinded.current.records, props.records, { skipFunction: skipFunctionDiff })
      ) {
        if (keepColumnWidthChange) {
          const columnWidthConfig = updateWidthCache(
            columnWidths.current,
            pivotColumnWidths.current,
            tableContext.current.table
          );
          (tableContext.current.table.internalProps as any).columnWidthConfig = columnWidthConfig;
          (tableContext.current.table.internalProps as any).columnWidthConfigForRowHeader = columnWidthConfig;
        }
        tableContext.current.table.setRecords(props.records as any[]);
        handleTableRender();
        eventsBinded.current = props;
      }
      return;
    }

    const newOption = pickWithout(props, notOptionKeys);

    if (
      !isEqual(newOption, prevOption.current, { skipFunction: skipFunctionDiff }) ||
      // tableContext.current.isChildrenUpdated
      !isEqual(newOptionFromChildren, optionFromChildren.current, { skipFunction: skipFunctionDiff })
    ) {
      prevOption.current = newOption;
      optionFromChildren.current = newOptionFromChildren;

      const option = parseOption(props);
      if (keepColumnWidthChange) {
        const columnWidthConfig = updateWidthCache(
          columnWidths.current,
          pivotColumnWidths.current,
          tableContext.current.table
        );
        (option as any).columnWidthConfig = columnWidthConfig;
        (option as any).columnWidthConfigForRowHeader = columnWidthConfig;
      }
      tableContext.current.table.updateOption(option as any);

      // columnWidths.current = [];
      handleTableRender();
      eventsBinded.current = props;
    } else if (hasRecords && !isEqual(props.records, prevRecords.current, { skipFunction: skipFunctionDiff })) {
      prevRecords.current = props.records;

      if (keepColumnWidthChange) {
        const columnWidthConfig = updateWidthCache(
          columnWidths.current,
          pivotColumnWidths.current,
          tableContext.current.table
        );
        (tableContext.current.table.internalProps as any).columnWidthConfig = columnWidthConfig;
        (tableContext.current.table.internalProps as any).columnWidthConfigForRowHeader = columnWidthConfig;
      }

      tableContext.current.table.setRecords(props.records);
      handleTableRender();
      eventsBinded.current = props;
    }
    // tableContext.current = {
    //   ...tableContext.current,
    //   isChildrenUpdated: false
    // };
  }, [createTable, hasOption, hasRecords, parseOption, handleTableRender, renderTable, skipFunctionDiff, props]);

  useEffect(() => {
    return () => {
      if (tableContext) {
        if (tableContext.current && tableContext.current.table) {
          tableContext.current.table.release();
          tableContext.current = null;
        }
      }
      eventsBinded.current = null;
      isUnmount.current = true;
    };
  }, []);

  return (
    <RootTableContext.Provider value={tableContext.current}>
      {toArray(props.children).map((child: React.ReactNode, index: number) => {
        if (typeof child === 'string') {
          return;
        }

        const childId = getComponentId(child, index);

        // const componentName =
        //   child && (child as any).type && ((child as any).type.displayName || (child as any).type.name);
        // const childId = `${componentName}-${index}`;

        return (
          // <React.Fragment key={(child as any)?.props?.id ?? (child as any)?.id ?? `child-${index}`}>
          //   {React.cloneElement(child as IMarkElement, {
          //     updateId: updateId
          //   })}
          // </React.Fragment>
          <React.Fragment key={childId}>
            {React.cloneElement(child as React.ReactElement<any, React.JSXElementConstructor<any>>, {
              updateId: updateId,
              componentId: childId,
              componentIndex: index
            })}
          </React.Fragment>
        );
      })}
    </RootTableContext.Provider>
  );
});

export const createTable = <T extends Props>(
  componentName: string,
  defaultProps?: Partial<T>,
  callback?: (props: T) => T
) => {
  const Com = withContainer<ContainerProps, T>(BaseTable as any, componentName, (props: T) => {
    // props.type = type;

    if (defaultProps) {
      return Object.assign(props, defaultProps);
    }

    // if (callback) {
    //   return callback(props);
    // }

    // if (type) {
    //   return { ...props, type };
    // }
    return props;
  });
  Com.displayName = componentName;
  return Com;
};

function updateWidthCache(
  columnWidths: Map<string, number>,
  pivotColumnWidths: { dimensions: TYPES.IDimensionInfo[]; width: number }[],
  table: IVTable
) {
  if (table.isPivotTable()) {
    return pivotColumnWidths;
  }
  const columnWidthConfig: { key: string; width: number }[] = [];
  columnWidths.forEach((width, key) => {
    columnWidthConfig.push({
      key,
      width
    });
  });
  return columnWidthConfig;
}
