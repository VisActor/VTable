import type { ReactElement } from 'react';
import React, { useContext, useEffect } from 'react';
import { isEqual, isNil, pickWithout } from '@visactor/vutils';

import type { TableContextType } from '../context/table';
import RootTableContext from '../context/table';
import { bindEventsToTable } from '../eventsUtils';
import { uid } from '../util';
import { CustomLayout } from './custom/custom-layout';

export interface BaseComponentProps {
  id?: string | number;
  children?: React.ReactNode;
}

type ComponentProps = BaseComponentProps & { updateId?: number; componentId?: number; componentIndex?: number };

export const createComponent = <T extends ComponentProps>(
  componentName: string,
  optionName: string,
  supportedEvents?: Record<string, string> | null,
  isSingle?: boolean
) => {
  const ignoreKeys = ['id', 'updateId', 'componentId', 'componentIndex', 'children'];
  const notOptionKeys = supportedEvents ? Object.keys(supportedEvents).concat(ignoreKeys) : ignoreKeys;

  const Comp: React.FC<T> = (props: T) => {
    const context = useContext(RootTableContext);
    // const id = React.useRef<string | number>(isNil(props.id) ? uid(optionName) : props.id);

    const eventsBinded = React.useRef<T>(null);
    const updateId = React.useRef<number>(props.updateId);
    // const componentOption = React.useRef<Partial<T>>();

    if (props.updateId !== updateId.current) {
      // update triggered by table when table is rendered
      updateId.current = props.updateId;

      // rebind events after table render
      const hasPrevEventsBinded = supportedEvents
        ? bindEventsToTable(context.table, props, eventsBinded.current, supportedEvents)
        : false;
      if (hasPrevEventsBinded) {
        eventsBinded.current = props;
      }
      // } else {
      //   const newComponentOption: Partial<T> = pickWithout<T>(props, notOptionKeys);

      //   if (!isEqual(newComponentOption, componentOption.current)) {
      //     componentOption.current = newComponentOption;
      //     updateToContext(context, id.current, optionName, isSingle, newComponentOption);
      //   }
    }

    useEffect(() => {
      return () => {
        if (supportedEvents) {
          bindEventsToTable(context.table, null, eventsBinded.current, supportedEvents);
        }
        // deleteToContext(context, id.current, optionName, isSingle);
      };
    }, []);

    // children are all custom layout temply
    // return props.children
    //   ? React.cloneElement(props.children as ReactElement, { componentIndex: props.componentIndex })
    //   : null;
    if (props.children) {
      return React.Children.map(props.children as ReactElement, (child: ReactElement) => {
        return React.createElement(CustomLayout, { componentIndex: props.componentIndex }, child);
      });
    }
    return null;
  };

  Comp.displayName = componentName;

  (Comp as any).parseOption = (props: T & { updateId?: number; componentId?: string }) => {
    const newComponentOption: Partial<T> = pickWithout<T>(props, notOptionKeys);

    // deal width customLayout
    if (props.children) {
      const { children } = props;
      React.Children.map(children as ReactElement, (child: ReactElement) => {
        if (child.props.role === 'custom-layout') {
          (newComponentOption as any).customLayout = 'react-custom-layout';
        }
        if (child.props.role === 'header-custom-layout') {
          (newComponentOption as any).headerCustomLayout = 'react-custom-layout';
        }
      });
    }
    // if (props.children && (props.children as React.ReactElement).props.role === 'custom-layout') {
    //   (newComponentOption as any).customLayout = 'react-custom-layout';
    // }

    return {
      option: newComponentOption,
      optionName,
      isSingle
    };
  };

  return Comp;
};

// const updateToContext = (
//   context: TableContextType,
//   id: string | number,
//   optionName: string,
//   isSingle: boolean,
//   props: Partial<ComponentProps>
// ) => {
//   if (!context.optionFromChildren) {
//     return;
//   }

//   if (isSingle) {
//     context.optionFromChildren[optionName] = { ...props };
//   } else {
//     if (!context.optionFromChildren[optionName]) {
//       context.optionFromChildren[optionName] = [];
//     }

//     const comps = context.optionFromChildren[optionName];
//     const index = comps.findIndex((entry: any) => entry.id === id);

//     if (index >= 0) {
//       comps[index] = {
//         id,
//         ...props
//       };
//     } else {
//       context.optionFromChildren[optionName].push({
//         id,
//         ...props
//       });
//     }
//   }
//   context.isChildrenUpdated = true;
// };

// const deleteToContext = (context: TableContextType, id: string | number, optionName: string, isSingle: boolean) => {
//   if (!context.optionFromChildren) {
//     return;
//   }

//   if (isSingle) {
//     context.optionFromChildren[optionName] = null;
//   } else {
//     const comps = context.optionFromChildren[optionName] ?? [];
//     const index = comps.findIndex((entry: any) => entry.id === id);

//     if (index >= 0) {
//       const newComps = comps.slice(0, index - 1).concat(comps.slice(index + 1));

//       context.optionFromChildren[optionName] = newComps;
//       context.isChildrenUpdated = true;
//     }
//   }
// };
