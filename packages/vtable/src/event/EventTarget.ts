/* Adapted from cheetah-grid by yosuke ota
 *url:https://github.com/future-architect/cheetah-grid/blob/master/packages/cheetah-grid/src/js/core/EventTarget.ts
 *License: https://github.com/future-architect/cheetah-grid/blob/master/LICENSE
 * @license
 */
import type { AnyListener, EventListenerId } from '../ts-types';
import { isValid } from '../tools/util';

let idCount = 1;

export class EventTarget {
  private listenersData: {
    listeners: { [type: string]: AnyListener[] };
    listenerData: {
      [id: number]: {
        type: string;
        listener: AnyListener;
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
  listen(type: string, listener: AnyListener): EventListenerId {
    const list = this.listenersData.listeners[type] || (this.listenersData.listeners[type] = []);
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

  unlisten(id: EventListenerId): void {
    if (!this.listenersData) {
      return;
    }
    this.listenersData.listenerData[id].remove();
  }

  addEventListener(type: string, listener: AnyListener, option?: any): void {
    this.listen(type, listener);
  }

  removeEventListener(type: string, listener: AnyListener): void {
    if (!this.listenersData) {
      return;
    }
    for (const key in this.listenersData.listenerData) {
      const listenerData = this.listenersData.listenerData[key];
      if (listenerData.type === type && listenerData.listener === listener) {
        this.unlisten(key as unknown as number);
      }
    }
  }

  hasListeners(type: string): boolean {
    if (!this.listenersData) {
      return false;
    }
    return !!this.listenersData.listeners[type];
  }

  fireListeners(type: string, ...args: any[]): any {
    if (!this.listenersData) {
      return [];
    }
    const list = this.listenersData.listeners[type];
    if (!list) {
      return [];
    }
    return list.map(listener => listener.call(this, ...args)).filter(r => isValid(r));
  }

  dispose(): void {
    delete this.listenersData;
  }
}
