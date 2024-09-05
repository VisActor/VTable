/* Adapted from cheetah-grid by yosuke ota
 *url:https://github.com/future-architect/cheetah-grid/blob/master/packages/cheetah-grid/src/js/core/EventTarget.ts
 *License: https://github.com/future-architect/cheetah-grid/blob/master/LICENSE
 * @license
 */
import type {
  TableEventListener,
  EventListenerId,
  TableEventHandlersEventArgumentMap,
  TableEventHandlersReturnMap
} from '../ts-types';
import { isValid } from '@visactor/vutils';

let idCount = 1;

export class EventTarget {
  private listenersData: {
    listeners: { [TYPE in keyof TableEventHandlersEventArgumentMap]?: TableEventListener<TYPE>[] };
    listenerData: {
      [id: number]: {
        type: string;
        listener: TableEventListener<keyof TableEventHandlersEventArgumentMap>;
        remove: () => void;
      };
    };
  } = {
    listeners: {},
    listenerData: {}
  };

  /**
   * 监听事件
   * @param type 事件类型
   * @param listener 事件监听器
   * @returns 事件监听器id
   */
  on<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    listener: TableEventListener<TYPE>
  ): EventListenerId {
    const list: TableEventListener<TYPE>[] =
      this.listenersData.listeners[type] || (this.listenersData.listeners[type] = []);
    list.push(listener);

    const id = idCount++;
    this.listenersData.listenerData[id] = {
      type,
      listener,
      remove: (): void => {
        delete this.listenersData.listenerData[id];
        const index = list.indexOf(listener);
        list.splice(index, 1);
        if (!this.listenersData.listeners[type].length) {
          delete this.listenersData.listeners[type];
        }
      }
    };
    return id;
  }

  off(type: string, listener: TableEventListener<keyof TableEventHandlersEventArgumentMap>): void;
  off(id: EventListenerId): void;
  off(
    idOrType: EventListenerId | string,
    listener?: TableEventListener<keyof TableEventHandlersEventArgumentMap>
  ): void {
    if (listener) {
      const type = idOrType as string;
      this.removeEventListener(type, listener);
    } else {
      const id = idOrType as EventListenerId;
      if (!this.listenersData) {
        return;
      }
      this.listenersData.listenerData[id]?.remove();
    }
  }

  addEventListener<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    listener: TableEventListener<TYPE>,
    option?: any
  ): void {
    this.on(type, listener);
  }

  removeEventListener(type: string, listener: TableEventListener<keyof TableEventHandlersEventArgumentMap>): void {
    if (!this.listenersData) {
      return;
    }
    for (const key in this.listenersData.listenerData) {
      const listenerData = this.listenersData.listenerData[key];
      if (listenerData.type === type && listenerData.listener === listener) {
        this.off(key as unknown as number);
      }
    }
  }

  hasListeners(type: string): boolean {
    if (!this.listenersData) {
      return false;
    }
    return !!this.listenersData.listeners[type];
  }

  // fireListeners(type: string, ...args: any[]): any {
  //   if (!this.listenersData) {
  //     return [];
  //   }
  //   const list = this.listenersData.listeners[type];
  //   if (!list) {
  //     return [];
  //   }
  //   return list.map(listener => listener.call(this, ...args)).filter(r => isValid(r));
  // }
  fireListeners<TYPE extends keyof TableEventHandlersEventArgumentMap>(
    type: TYPE,
    event: TableEventHandlersEventArgumentMap[TYPE]
  ): TableEventHandlersReturnMap[TYPE][] {
    if (!this.listenersData) {
      return [];
    }
    const list = this.listenersData.listeners[type];
    if (!list) {
      return [];
    }
    return list.map(listener => listener.call(this, event)).filter(r => isValid(r));
  }
  release(): void {
    delete this.listenersData;
  }
}
