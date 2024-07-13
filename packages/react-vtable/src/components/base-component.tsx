import type { ReactElement, ReactNode } from 'react';
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

type ComponentProps = BaseComponentProps & { updateId?: number; componentId?: string; componentIndex?: number };

export const createComponent = <T extends ComponentProps>(
  componentName: string,
  optionName: string,
  supportedEvents?: Record<string, string> | null,
  isSingle?: boolean
) => {
  const ignoreKeys = ['id', 'updateId', 'componentIndex', 'children'];
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
    // if (props.children) {
    //   return React.Children.map(props.children as ReactElement, (child: ReactElement) => {
    //     if (child.props.role === 'custom-layout' || child.props.role === 'header-custom-layout') {
    //       return React.createElement(CustomLayout, { componentId: props.componentId }, child);
    //     }
    //   });
    // }
    return parseCustomChildren(props.children, props.componentId);
  };

  Comp.displayName = componentName;

  (Comp as any).parseOption = (props: T & { updateId?: number; componentId?: string }) => {
    const newComponentOption: Partial<T> = pickWithout<T>(props, notOptionKeys);
    // deal width customLayout
    if (props.children) {
      const { children } = props;
      React.Children.map(children as ReactElement, (child: ReactElement, index) => {
        parseChild(child, props, newComponentOption, notOptionKeys, props.componentId + '-' + index);
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

function parseChild(
  child: ReactElement,
  componentProps: any,
  newComponentOption: any,
  notOptionKeys: string[],
  componentId: string
) {
  if (child.props.role === 'custom-layout') {
    (newComponentOption as any).customLayout = 'react-custom-layout';
    (newComponentOption as any).customLayoutComponentId = componentId;
  }
  if (child.props.role === 'header-custom-layout') {
    (newComponentOption as any).headerCustomLayout = 'react-custom-layout';
    (newComponentOption as any).headerCustomLayoutComponentId = componentId;
  }
  if ((child.type as any).displayName === 'ListColumn') {
    if (!newComponentOption.columns) {
      newComponentOption.columns = [];
    }
    const childOption = pickWithout(child.props, notOptionKeys);
    newComponentOption.columns.push(childOption);
    childOption.componentId = componentId;
    if (child.props.children) {
      React.Children.map(child.props.children as ReactElement, (child: ReactElement, index) => {
        parseChild(child, componentProps, childOption, notOptionKeys, componentId + '-' + index);
      });
    }
  }
}

function parseCustomChildren(children: ReactNode, componentId: string): ReactNode | undefined {
  if (isReactElement(children) || Array.isArray(children)) {
    return React.Children.map(children as ReactElement, (child: ReactElement, index) => {
      if (child.props.children) {
        return parseCustomChildren(child.props.children as ReactElement, componentId + '-' + index);
      } else if (child.props.role === 'custom-layout' || child.props.role === 'header-custom-layout') {
        return React.createElement(CustomLayout, { componentId: componentId }, child);
      }
      return null;
    });
  }
  return null;
}

function isReactElement(obj: any) {
  return obj && obj.$$typeof === Symbol.for('react.element');
}
