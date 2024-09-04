// import type { AnyFunction, EventListenerId } from '../ts-types';
import type { EventTarget as CustomEventTarget } from './EventTarget';
import { debounce } from '../tools/debounce';
import { Env } from '../env';
export type EventListenerId = any; //TODO 类型
let idCount = 1;
type EventHandlerTarget = EventTarget | CustomEventTarget;
type Listener = any; // AnyFunction; TODO 类型
type EventListenerObject = {
  target: EventHandlerTarget;
  type: string;
  listener: Listener;
  options: any[];
};

export type ResizeObserverCallBack = ({
  width,
  height,
  windowSizeNotChange
}: {
  width: number;
  height: number;
  windowSizeNotChange: boolean;
}) => void;

export class ResizeObserver {
  resizeTime = 100;
  element: HTMLElement;
  cb: ResizeObserverCallBack;
  observer?: MutationObserver;
  lastSize: {
    width: number;
    height: number;
  } = {
    width: 0,
    height: 0
  };
  callBackDebounce: () => void;

  constructor(element: HTMLElement, cb: ResizeObserverCallBack, resizeTime?: number) {
    this.element = element;
    this.cb = cb;
    this.lastSize = this.getSize();
    if (resizeTime) {
      this.resizeTime = Math.max(resizeTime, 16);
    }

    this.callBackDebounce = debounce(this.callBack, this.resizeTime);
    //TODO: 这个地方的 addEventListener resize 应该更改到下面的else逻辑中，兼容ResizeObserver不存在的情况
    window?.addEventListener('resize', this.onResize);
    // 优先使用 ResizeObserver
    if ('ResizeObserver' in window) {
      // @ts-ignore
      const ResizeObserverWindow: any = window.ResizeObserver;
      this.observer = new ResizeObserverWindow(this.mutationResize);
      this.observer?.observe(this.element);
    } else if ('MutationObserver' in window) {
      this.observer = new MutationObserver(this.mutationResize);
      this.observer.observe(this.element, {
        attributes: true,
        attributeFilter: ['style']
      });
    }
  }

  mutationResize = () => {
    this.onResize();
  };

  disConnect() {
    window.removeEventListener('resize', this.onResize);
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  callBack = () => {
    const newSize = this.getSize();
    let windowSizeNotChange = false;
    if (newSize.width === this.lastSize.width && newSize.height === this.lastSize.height) {
      windowSizeNotChange = true;
    }
    this.lastSize = newSize;
    this.cb && this.cb({ ...this.lastSize, windowSizeNotChange });
  };

  setSize(size: { width: number; height: number }) {
    this.lastSize = size;
  }

  private onResize = () => {
    // if (this.checkSize()) {
    this.callBackDebounce();
    // }
  };

  private checkSize() {
    const newSize = this.getSize();
    if (newSize.width === this.lastSize.width && newSize.height === this.lastSize.height) {
      return false;
    }
    return true;
  }

  getSize() {
    if (!this.element) {
      return {
        ...this.lastSize
      };
    }
    return {
      width: Math.floor(this.element.clientWidth),
      height: Math.floor(this.element.clientHeight)
    };
  }
}

export class EventHandler {
  resizeTime?: number;

  private listeners: {
    [key: string]: EventListenerObject;
  } = {};

  private reseizeListeners: {
    [key: string]: ResizeObserver;
  } = {};

  on(
    target: HTMLElement | Window | EventHandlerTarget,
    type: string,
    listener: Listener,
    ...options: any[]
  ): EventListenerId {
    if (Env.mode === 'node') {
      return -1;
    }
    const id = idCount++;
    if (target?.addEventListener) {
      if (type !== 'resize' || (target as Window) === window) {
        (target as EventTarget)?.addEventListener(type, listener, ...(options as []));
      } else {
        const resizeObserver = new ResizeObserver(target as HTMLElement, listener, this.resizeTime);
        this.reseizeListeners[id] = resizeObserver;
      }
    }
    const obj = { target, type, listener, options };
    this.listeners[id] = obj;
    return id;
  }
  once(
    target: EventHandlerTarget,
    type: string,
    listener: Listener,
    ...options: (boolean | AddEventListenerOptions)[]
  ): EventListenerId {
    if (Env.mode === 'node') {
      return -1;
    }
    const id = this.on(
      target,
      type,
      (...args: any[]) => {
        this.off(id);
        listener(...args);
      },
      ...options
    );
    return id;
  }
  off(id: EventListenerId | null | undefined): void {
    if (Env.mode === 'node') {
      return;
    }
    if (id == null) {
      return;
    }
    const obj = this.listeners?.[id];
    if (!obj) {
      return;
    }
    delete this.listeners[id];
    if (obj.target.removeEventListener) {
      obj.target.removeEventListener(obj.type, obj.listener, ...(obj.options as []));
    }
  }
  fire(target: EventTarget, type: string, ...args: any[]): void {
    if (Env.mode === 'node') {
      return;
    }
    for (const key in this.listeners) {
      const listener = this.listeners[key];
      if (listener.target === target && listener.type === type) {
        listener.listener.call(listener.target, ...args);
      }
    }
  }
  hasListener(target: EventTarget, type: string): boolean {
    if (Env.mode === 'node') {
      return false;
    }
    let result = false;
    for (const key in this.listeners) {
      const listener = this.listeners[key];
      if (listener.target === target && listener.type === type) {
        result = true;
      }
    }

    return result;
  }
  clear(): void {
    if (Env.mode === 'node') {
      return;
    }
    for (const key in this.listeners) {
      const listener = this.listeners[key];
      if (listener.target.removeEventListener) {
        listener.target.removeEventListener(listener.type, listener.listener, ...(listener.options as []));
      }
    }

    for (const key in this.reseizeListeners) {
      const resizeObserver: ResizeObserver = this.reseizeListeners[key];
      resizeObserver?.disConnect();
    }

    this.listeners = {};
  }
  release(): void {
    if (Env.mode === 'node') {
      return;
    }
    this.clear();
    (this as any).listeners = {};
  }
}
