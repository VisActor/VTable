/* eslint-disable react/display-name */
import * as VTable from '@visactor/vtable';
import React, { useState, useEffect, useRef, useImperativeHandle, useCallback } from 'react';
import type { ContainerProps } from '../containers/withContainer';
import withContainer from '../containers/withContainer';
import type { TableContextType } from '../context/table';
import RootTableContext from '../context/table';
import { isEqual, pickWithout } from '@visactor/vutils';
import { toArray } from '../util';
import { REACT_PRIVATE_PROPS } from '../constants';
import type { IMarkElement } from '../components';
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

export type IVTable = VTable.ListTable | VTable.PivotTable | VTable.PivotChart;

export interface BaseTableProps extends EventsProps {
  type?: string;
  /** 上层container */
  container?: HTMLDivElement;
  /** option */
  option?: any;
  /** 数据 */
  records?: any;
  /** 画布宽度 */
  width?: number;
  /** 画布高度 */
  height?: number;
  skipFunctionDiff?: boolean;

  /** 表格渲染完成事件 */
  onReady?: (instance: IVTable, isInitial: boolean) => void;
  /** throw error when chart run into an error */
  onError?: (err: Error) => void;
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
  'container'
];

const BaseTable: React.FC<Props> = React.forwardRef((props, ref) => {
  const [updateId, setUpdateId] = useState<number>(0);
  const tableContext = useRef<TableContextType>({
    optionFromChildren: {}
  });
  useImperativeHandle(ref, () => tableContext.current?.table);
  const hasOption = !!props.option;
  const hasRecords = !!props.records;
  const isUnmount = useRef<boolean>(false);
  const prevOption = useRef(pickWithout(props, notOptionKeys));
  const prevRecords = useRef(props.records);
  const eventsBinded = React.useRef<BaseTableProps>(null);
  const skipFunctionDiff = !!props.skipFunctionDiff;

  const parseOption = useCallback(
    (props: Props) => {
      if (hasOption && props.option) {
        if (hasRecords && props.records) {
          return {
            ...props.option,
            records: props.records
          };
        }
        return props.option;
      }
      return {
        records: props.records,
        ...prevOption.current,
        ...tableContext.current?.optionFromChildren
      };
    },
    [hasOption, hasRecords]
  );

  const createTable = useCallback(
    (props: Props) => {
      let vtable;
      if (props.type === 'pivot-table') {
        vtable = new VTable.PivotTable(props.container, parseOption(props));
      } else if (props.type === 'pivot-chart') {
        vtable = new VTable.PivotChart(props.container, parseOption(props));
      } else {
        vtable = new VTable.ListTable(props.container, parseOption(props));
      }
      tableContext.current = { ...tableContext.current, table: vtable };
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
    if (!tableContext.current?.table) {
      createTable(props);
      renderTable();
      bindEventsToTable(tableContext.current.table, props, null, TABLE_EVENTS);
      tableContext.current = {
        ...tableContext.current,
        isChildrenUpdated: false
      };
      eventsBinded.current = props;
      return;
    }

    if (hasOption) {
      if (!isEqual(eventsBinded.current.option, props.option, { skipFunction: skipFunctionDiff })) {
        eventsBinded.current = props;
        // eslint-disable-next-line promise/catch-or-return
        tableContext.current.table.updateOption(parseOption(props));
        handleTableRender();
      } else if (
        hasRecords &&
        !isEqual(eventsBinded.current.records, props.records, { skipFunction: skipFunctionDiff })
      ) {
        eventsBinded.current = props;
        tableContext.current.table.setRecords(props.records);
        handleTableRender();
      }
      return;
    }

    const newOption = pickWithout(props, notOptionKeys);

    if (
      !isEqual(newOption, prevOption.current, { skipFunction: skipFunctionDiff }) ||
      tableContext.current.isChildrenUpdated
    ) {
      prevOption.current = newOption;
      // eslint-disable-next-line promise/catch-or-return
      tableContext.current.table.updateOption(parseOption(props));
      handleTableRender();
    } else if (hasRecords && !isEqual(props.records, prevRecords.current, { skipFunction: skipFunctionDiff })) {
      prevRecords.current = props.records;
      tableContext.current.table.setRecords(props.records);
      handleTableRender();
    }
    tableContext.current = {
      ...tableContext.current,
      isChildrenUpdated: false
    };
  }, [createTable, hasOption, hasRecords, parseOption, handleTableRender, renderTable, skipFunctionDiff, props]);

  useEffect(() => {
    return () => {
      if (tableContext) {
        if (tableContext.current.table) {
          tableContext.current.table.release();
        }
        tableContext.current = null;
      }
      isUnmount.current = true;
    };
  }, []);

  return (
    <RootTableContext.Provider value={tableContext.current}>
      {toArray(props.children).map((child: React.ReactNode, index: number) => {
        return (
          <React.Fragment key={(child as any)?.props?.id ?? (child as any)?.id ?? `child-${index}`}>
            {React.cloneElement(child as IMarkElement, {
              updateId: updateId
            })}
          </React.Fragment>
        );
      })}
    </RootTableContext.Provider>
  );
});

export const createTable = <T extends Props>(componentName: string, type?: string, callback?: (props: T) => T) => {
  const Com = withContainer<ContainerProps, T>(BaseTable as any, componentName, (props: T) => {
    props.type = type;

    if (callback) {
      return callback(props);
    }

    if (type) {
      return { ...props, type };
    }
    return props;
  });
  Com.displayName = componentName;
  return Com;
};
