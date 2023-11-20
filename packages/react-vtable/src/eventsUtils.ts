import { ListTable } from '@visactor/vtable';
import type { IVTable } from './tables/base-table';

export interface EventsProps {
  onMouseMoveCell?: () => void;
}

export const REACT_TO_VTABLE_EVENTS = {
  onMouseMoveCell: ListTable.EVENT_TYPE.MOUSEMOVE_CELL
};

export const TABLE_EVENTS = {
  ...REACT_TO_VTABLE_EVENTS
};

export const TABLE_EVENTS_KEYS = Object.keys(TABLE_EVENTS);

export const COMMON_EVENTK_KEYS = Object.keys(REACT_TO_VTABLE_EVENTS);

export const VTABLE_TO_REACT_EVENTS = Object.keys(REACT_TO_VTABLE_EVENTS).reduce((res, key) => {
  res[REACT_TO_VTABLE_EVENTS[key]] = key;

  return res;
}, {});

export const findEventProps = <T extends EventsProps>(
  props: T,
  supportedEvents: Record<string, string> = REACT_TO_VTABLE_EVENTS
): EventsProps => {
  const result: EventsProps = {};

  Object.keys(props).forEach(key => {
    if (supportedEvents[key]) {
      result[key] = props[key];
    }
  });

  return result;
};

export const bindEventsToTable = <T>(
  table: IVTable,
  newProps?: T | null,
  prevProps?: T | null,
  supportedEvents: Record<string, string> = REACT_TO_VTABLE_EVENTS
) => {
  if ((!newProps && !prevProps) || !table) {
    return false;
  }

  const prevEventProps = prevProps ? findEventProps(prevProps, supportedEvents) : null;
  const newEventProps = newProps ? findEventProps(newProps, supportedEvents) : null;

  if (prevEventProps) {
    Object.keys(prevEventProps).forEach(eventKey => {
      if (!newEventProps || !newEventProps[eventKey] || newEventProps[eventKey] !== prevEventProps[eventKey]) {
        const res = table.off(supportedEvents[eventKey], prevProps[eventKey]);
      }
    });
  }

  if (newEventProps) {
    Object.keys(newEventProps).forEach(eventKey => {
      if (!prevEventProps || !prevEventProps[eventKey] || prevEventProps[eventKey] !== newEventProps[eventKey]) {
        table.on(supportedEvents[eventKey] as any, newEventProps[eventKey]);
      }
    });
  }

  return true;
};
