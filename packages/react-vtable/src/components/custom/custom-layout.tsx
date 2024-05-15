import React, { useCallback, useContext, useLayoutEffect, useRef } from 'react';
import RootTableContext from '../../context/table';
import { Group } from '@visactor/vtable/src/vrender';
import type { ICustomLayoutFuc, CustomRenderFunctionArg } from '@visactor/vtable/src/ts-types';
import type { FiberRoot } from 'react-reconciler';
import { reconcilor } from './reconciler';
import { LegacyRoot } from 'react-reconciler/constants';

type CustomLayoutProps = { componentIndex?: number; children: React.ReactElement };

export type CustomLayoutFunctionArg = Partial<CustomRenderFunctionArg>;

export const CustomLayout: React.FC<CustomLayoutProps> = (props: CustomLayoutProps, ref) => {
  const { componentIndex, children } = props;
  const context = useContext(RootTableContext);
  const { table } = context;

  // react customLayout component container cache
  const container = useRef<Map<string, FiberRoot>>(new Map());

  // customLayout function for vtable
  const createGraphic: ICustomLayoutFuc = useCallback(
    args => {
      const key = `${args.col}-${args.row}`;
      let group;
      if (container.current.has(key)) {
        const currentContainer = container.current.get(key);
        reconcilor.updateContainer(React.cloneElement(children, { ...args }), currentContainer, null);
        group = currentContainer.containerInfo;
      } else {
        group = new Group({});
        const currentContainer = reconcilor.createContainer(group, LegacyRoot, null, null, null, 'custom', null, null);
        container.current.set(key, currentContainer);
        reconcilor.updateContainer(React.cloneElement(children, { ...args }), currentContainer, null);
      }

      return {
        rootContainer: group,
        renderDefault: false
      };
    },
    [children]
  );

  useLayoutEffect(() => {
    // init and release
    // eslint-disable-next-line no-undef
    console.log('init/release', props, table);
    // table && (table._reactCreateGraphic = createGraphic); // never go to here
    // table?.renderWithRecreateCells();
  }, []);

  useLayoutEffect(() => {
    // update props
    // eslint-disable-next-line no-undef
    console.log('update props', props, table);

    table?.checkReactCustomLayout(); // init reactCustomLayout component
    if (table && !table.reactCustomLayout?.hasReactCreateGraphic(componentIndex)) {
      table.reactCustomLayout?.setReactCreateGraphic(componentIndex, createGraphic, container.current); // set customLayout function
      table.reactCustomLayout?.updateCustomCell(componentIndex); // update cell content
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
        reconcilor.updateContainer(React.cloneElement(props.children, { ...args }), currentContainer, null);
        table.scenegraph.updateNextFrame();
      });
    }
  });

  return null;
};
