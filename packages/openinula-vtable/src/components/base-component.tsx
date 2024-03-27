import Inula, { useContext, useEffect } from 'openinula';
import { isEqual, isNil, pickWithout } from '@visactor/vutils';

import type { TableContextType } from '../context/table';
import RootTableContext from '../context/table';
import { bindEventsToTable } from '../eventsUtils';
import { uid } from '../util';

export interface BaseComponentProps {
  id?: string | number;
}

type ComponentProps = BaseComponentProps & { updateId?: number; componentId?: number };

export const createComponent = <T extends ComponentProps>(
  componentName: string,
  optionName: string,
  supportedEvents?: Record<string, string> | null,
  isSingle?: boolean
) => {
  const ignoreKeys = ['id', 'updateId', 'componentId'];
  const notOptionKeys = supportedEvents ? Object.keys(supportedEvents).concat(ignoreKeys) : ignoreKeys;

  const Comp: Inula.FC<T> = (props: T) => {
    const context = useContext(RootTableContext);
    // const id = Inula.useRef<string | number>(isNil(props.id) ? uid(optionName) : props.id);

    const eventsBinded = Inula.useRef<T>(null);
    const updateId = Inula.useRef<number>(props.updateId);
    // const componentOption = Inula.useRef<Partial<T>>();

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

    return null;
  };

  Comp.displayName = componentName;

  (Comp as any).parseOption = (props: T & { updateId?: number; componentId?: string }) => {
    const newComponentOption: Partial<T> = pickWithout<T>(props, notOptionKeys);

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
