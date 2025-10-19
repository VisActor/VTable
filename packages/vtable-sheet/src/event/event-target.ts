type EventHandler = (...args: any[]) => void;

interface EventRecord {
  [key: string]: EventHandler[];
}

export class EventTarget {
  /** 事件记录 */
  private events: EventRecord = {};

  /**
   * 添加事件监听器
   * @param type 事件类型
   * @param handler 事件处理函数
   * @returns 返回this，用于链式调用
   */
  on(type: string, handler: EventHandler): this {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    this.events[type].push(handler);
    return this;
  }

  /**
   * 移除事件监听器
   * @param type 事件类型
   * @param handler 事件处理函数
   * @returns 返回this，用于链式调用
   */
  off(type: string, handler?: EventHandler): this {
    if (!this.events[type]) {
      return this;
    }

    if (!handler) {
      // 移除所有事件处理函数
      delete this.events[type];
    } else {
      // 移除特定事件处理函数
      const idx = this.events[type].indexOf(handler);
      if (idx >= 0) {
        this.events[type].splice(idx, 1);
      }

      if (this.events[type].length === 0) {
        delete this.events[type];
      }
    }

    return this;
  }

  /**
   * 触发事件
   * @param type 事件类型
   * @param args 传递给事件处理函数的参数
   * @returns 返回this，用于链式调用
   */
  fire(type: string, ...args: any[]): this {
    if (!this.events[type]) {
      return this;
    }

    // 创建一个处理函数的副本，以防止在执行期间添加/移除处理函数时出现问题
    const handlers = [...this.events[type]];

    for (const handler of handlers) {
      try {
        handler(...args);
      } catch (e) {
        console.error(`Error in event handler for ${type}:`, e);
      }
    }

    return this;
  }

  /**
   * 添加一次性事件监听器，在调用后自动移除
   * @param type 事件类型
   * @param handler 事件处理函数
   * @returns 返回this，用于链式调用
   */
  once(type: string, handler: EventHandler): this {
    const onceHandler = (...args: any[]) => {
      this.off(type, onceHandler);
      handler(...args);
    };

    return this.on(type, onceHandler);
  }

  /**
   * 移除所有事件监听器
   * @returns 返回this，用于链式调用
   */
  removeAllListeners(): this {
    this.events = {};
    return this;
  }

  /**
   * 获取所有注册的事件类型
   * @returns 事件类型数组
   */
  eventNames(): string[] {
    return Object.keys(this.events);
  }

  /**
   * 获取特定事件类型的监听器数量
   * @param type 事件类型
   * @returns 监听器数量
   */
  listenerCount(type: string): number {
    return this.events[type]?.length || 0;
  }
}
