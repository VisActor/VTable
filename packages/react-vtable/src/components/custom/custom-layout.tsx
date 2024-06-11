/* eslint-disable react-hooks/rules-of-hooks */
import type { PropsWithChildren } from 'react';
import React, { isValidElement, useCallback, useContext, useLayoutEffect, useRef } from 'react';
import RootTableContext from '../../context/table';
import { Group } from '@visactor/vtable/src/vrender';
import type { ICustomLayoutFuc, CustomRenderFunctionArg } from '@visactor/vtable/src/ts-types';
import type { FiberRoot } from 'react-reconciler';
import { reconcilor } from './reconciler';
import { LegacyRoot } from 'react-reconciler/constants';

type CustomLayoutProps = { componentIndex?: number };

export type CustomLayoutFunctionArg = Partial<CustomRenderFunctionArg> & {
  role?: 'custom-layout' | 'header-custom-layout';
};

export const CustomLayout: React.FC<CustomLayoutProps> = (props: PropsWithChildren<CustomLayoutProps>, ref) => {
  const { componentIndex, children } = props;
  if (!isValidElement(children)) {
    return null;
  }
  const context = useContext(RootTableContext);
  const { table } = context;

  const isHeaderCustomLayout = children.props.role === 'header-custom-layout';

  // react customLayout component container cache
  const container = useRef<Map<string, FiberRoot>>(new Map());

  // customLayout function for vtable
  const createGraphic: ICustomLayoutFuc = useCallback(
    args => {
      const key = `${args.col}-${args.row}`;
      let group;
      if (container.current.has(key)) {
        const currentContainer = container.current.get(key);
        // reconcilor.updateContainer(React.cloneElement(children, { ...args }), currentContainer, null);
        reconcilorUpdateContainer(children, currentContainer, group, args);
        group = currentContainer.containerInfo;
      } else {
        group = new Group({});
        const currentContainer = reconcilor.createContainer(group, LegacyRoot, null, null, null, 'custom', null, null);
        container.current.set(key, currentContainer);
        reconcilorUpdateContainer(children, currentContainer, group, args);
        // const ele = React.cloneElement(children, { ...args });
        // reconcilor.updateContainer(ele, currentContainer, null);
      }

      return {
        rootContainer: group,
        renderDefault: false
      };
    },
    [children]
  );

  const removeContainer = useCallback((col: number, row: number) => {
    const key = `${col}-${row}`;
    if (container.current.has(key)) {
      const currentContainer = container.current.get(key);
      reconcilor.updateContainer(null, currentContainer, null);
      // group = currentContainer.containerInfo;
      container.current.delete(key);
    }
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

    table?.checkReactCustomLayout(); // init reactCustomLayout component
    if (table && !table.reactCustomLayout?.hasReactCreateGraphic(componentIndex, isHeaderCustomLayout)) {
      table.reactCustomLayout?.setReactCreateGraphic(
        componentIndex,
        createGraphic,
        // container.current,
        isHeaderCustomLayout
      ); // set customLayout function
      table.reactCustomLayout?.setReactRemoveGraphic(componentIndex, removeContainer, isHeaderCustomLayout); // set customLayout function
      table.reactCustomLayout?.updateCustomCell(componentIndex, isHeaderCustomLayout); // update cell content
    } else if (table) {
      // update all container
      container.current.forEach((value, key) => {
        const [col, row] = key.split('-').map(Number);
        const width = table.getColWidth(col); // to be fixed: may be merge cell
        const height = table.getRowHeight(row); // to be fixed: may be merge cell
        const currentContainer = value;
        const args = {
          col,
          row,
          dataValue: table.getCellOriginValue(col, row),
          value: table.getCellValue(col, row) || '',
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
        reconcilorUpdateContainer(children, currentContainer, group, args);
        // reconcilor.updateContainer(React.cloneElement(children, { ...args }), currentContainer, null);
        table.scenegraph.updateNextFrame();
      });
    }
  });

  return null;
};

function reconcilorUpdateContainer(children, currentContainer, group, args) {
  reconcilor.updateContainer(React.cloneElement(children, { ...args }), currentContainer, null);
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

function isReactElement(obj) {
  return obj && obj.$$typeof === Symbol.for('react.element');
}
