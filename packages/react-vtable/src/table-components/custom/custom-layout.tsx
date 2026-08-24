/* eslint-disable react-hooks/rules-of-hooks */
import type { PropsWithChildren, ReactElement } from 'react';
import React, { isValidElement, useCallback, useContext, useLayoutEffect, useRef, useState } from 'react';
import RootTableContext from '../../context/table';
import { Group } from '@visactor/vtable/es/vrender';
import type { ICustomLayoutFuc, CustomRenderFunctionArg } from '@visactor/vtable/es/ts-types';
import type { FiberRoot } from 'react-reconciler';
import type { ReconcilerErrorReporter, ReconcilerErrorType } from './reconciler';

type CustomLayoutProps = { componentId: string };

export type CustomLayoutFunctionArg = Partial<CustomRenderFunctionArg> & {
  role?: 'custom-layout' | 'header-custom-layout';
  renderDefault?: boolean;
};

export const CustomLayout: React.FC<CustomLayoutProps> = (props: PropsWithChildren<CustomLayoutProps>, ref) => {
  const { componentId, children } = props;
  if (!isValidElement(children)) {
    return null;
  }
  const context = useContext(RootTableContext);
  const { table, onError } = context;
  const [reconcilerReady, setReconcilerReady] = useState(false);
  const reconcilerModule = useRef<ReconcilerModule | null>(null);

  const isHeaderCustomLayout = children.props.role === 'header-custom-layout';

  // react customLayout component container cache
  const container = useRef<Map<string, FiberRoot>>(new Map());

  const reportReconcilerError: ReconcilerErrorReporter = useCallback(
    (type, error) => {
      if (!onError) {
        return;
      }
      if (error instanceof Error) {
        const wrapped = new Error(`[react-vtable custom-layout:${type}] ${error.message}`);
        (wrapped as any).stack = error.stack;
        onError(wrapped);
        return;
      }
      const message = typeof error === 'string' ? error : (error as any)?.message ?? String(error);
      onError(new Error(`[react-vtable custom-layout:${type}] ${message}`));
    },
    [onError]
  );

  useLayoutEffect(() => {
    let released = false;
    // Load the custom-layout reconciler only when CustomLayout is actually used.
    import('./reconciler')
      .then(module => {
        if (released) {
          return;
        }
        reconcilerModule.current = module;
        setReconcilerReady(true);
      })
      .catch(error => {
        reportReconcilerError('uncaught', error);
      });
    return () => {
      released = true;
    };
  }, [reportReconcilerError]);

  // customLayout function for vtable
  const createGraphic: ICustomLayoutFuc = useCallback(
    (args: any) => {
      const module = reconcilerModule.current;
      if (!module) {
        return {
          rootContainer: new Group({}),
          renderDefault: !!children.props.renderDefault
        };
      }
      const key = `${args.originCol ?? args.col}-${args.originRow ?? args.row}${
        args.forComputation ? '-forComputation' : ''
      }`;
      let group;
      if (container.current.has(key)) {
        const currentContainer = container.current.get(key);
        reconcilorUpdateContainer(module, children, currentContainer, args);
        group = currentContainer.containerInfo;
      } else {
        group = new Group({});
        const currentContainer = module.createReconcilerContainer(group as any, 'custom', reportReconcilerError);
        container.current.set(key, currentContainer);
        reconcilorUpdateContainer(module, children, currentContainer, args);
      }

      return {
        rootContainer: group,
        renderDefault: !!children.props.renderDefault
      };
    },
    [children, reportReconcilerError]
  );

  const removeContainer = useCallback((col: number, row: number) => {
    const module = reconcilerModule.current;
    if (!module) {
      return;
    }
    const key = `${col}-${row}`;
    if (container.current.has(key)) {
      const currentContainer = container.current.get(key);
      module.reconcilor.updateContainer(null, currentContainer, null);
      // group = currentContainer.containerInfo;
      currentContainer.containerInfo.delete();
      container.current.delete(key);
    }
  }, []);

  const removeAllContainer = useCallback(() => {
    const module = reconcilerModule.current;
    if (!module) {
      container.current.clear();
      return;
    }
    container.current.forEach((value, key) => {
      const currentContainer = value;
      module.reconcilor.updateContainer(null, currentContainer, null);
      currentContainer.containerInfo.delete();
    });
    container.current.clear();
  }, []);

  useLayoutEffect(() => {
    // init and release
    // eslint-disable-next-line no-undef
    console.log('init', props, table);
    // table && (table._reactCreateGraphic = createGraphic); // never go to here
    // table?.renderWithRecreateCells();
    return () => {
      // eslint-disable-next-line no-undef
      console.log('release', props, table);
    };
  }, []);

  useLayoutEffect(() => {
    // update props
    // eslint-disable-next-line no-undef
    console.log('update props', props, table);

    if (!reconcilerReady) {
      return;
    }
    table?.checkReactCustomLayout(); // init reactCustomLayout component
    table?.reactCustomLayout?.setReactRemoveAllGraphic(componentId, removeAllContainer, isHeaderCustomLayout); // set customLayout function

    if (table && !table.reactCustomLayout?.hasReactCreateGraphic(componentId, isHeaderCustomLayout)) {
      table.reactCustomLayout?.setReactCreateGraphic(
        componentId,
        createGraphic,
        // container.current,
        isHeaderCustomLayout
      ); // set customLayout function
      table.reactCustomLayout?.setReactRemoveGraphic(componentId, removeContainer, isHeaderCustomLayout); // set customLayout function
      table.reactCustomLayout?.updateCustomCell(componentId, isHeaderCustomLayout); // update cell content
    } else if (table) {
      table.reactCustomLayout?.setReactCreateGraphic(
        componentId,
        createGraphic,
        // container.current,
        isHeaderCustomLayout
      ); // update customLayout function
      // update all container
      container.current.forEach((value, key) => {
        const module = reconcilerModule.current;
        if (!module) {
          return;
        }
        const [col, row] = key.split('-').map(Number);
        // const width = table.getColWidth(col); // to be fixed: may be merge cell
        // const height = table.getRowHeight(row); // to be fixed: may be merge cell
        const { width, height } = getCellRect(col, row, table);
        const currentContainer = value;
        const args = {
          col,
          row,
          dataValue: table.getCellOriginValue(col, row),
          value: table.getCellValue(col, row),
          rect: {
            left: 0,
            top: 0,
            right: width,
            bottom: height,
            width,
            height
          },
          table
        };
        // update element in container
        const group = currentContainer.containerInfo;
        reconcilorUpdateContainer(module, children, currentContainer, args);
        // reconcilor.updateContainer(React.cloneElement(children, { ...args }), currentContainer, null);
        table.scenegraph.updateNextFrame();
      });
    }
  });

  return null;
};

type ReconcilerModule = {
  reconcilor: any;
  createReconcilerContainer: (
    container: any,
    identifierPrefix?: string,
    reportError?: (type: ReconcilerErrorType, error: unknown) => void
  ) => FiberRoot;
};

function reconcilorUpdateContainer(module: ReconcilerModule, children: ReactElement, currentContainer: any, args: any) {
  const element = React.cloneElement(children, { ...args });
  const { reconcilor } = module;
  const updateContainerSync = (reconcilor as any).updateContainerSync;
  if (typeof updateContainerSync === 'function') {
    updateContainerSync(element, currentContainer, null);
    const flushSyncWork = (reconcilor as any).flushSyncWork;
    if (typeof flushSyncWork === 'function') {
      flushSyncWork();
    }
    return;
  }
  reconcilor.updateContainer(element, currentContainer, null);
  // group = group.firstChild;
  // if (isReactElement(group.attribute.html?.dom)) {
  //   const div = document.createElement('div');
  //   const root = ReactDOM.createRoot(div as HTMLElement);
  //   root.render(group.attribute.html.dom);
  //   group.attribute.html.dom = div;
  //   // debugger;
  //   // group.html.dom = div;
  // }
}

function getCellRect(col: number, row: number, table: any) {
  const range = table.getCellRange(col, row);
  const rect = table.getCellsRect(range.start.col, range.start.row, range.end.col, range.end.row);
  return rect;
}
