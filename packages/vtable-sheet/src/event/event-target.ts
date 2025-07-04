type EventHandler = (...args: any[]) => void;

interface EventRecord {
  [key: string]: EventHandler[];
}

/**
 * Basic event target implementation for handling event subscriptions
 */
export class EventTarget {
  private events: EventRecord = {};

  /**
   * Adds an event listener for the specified event type
   * @param type Event type
   * @param handler Event handler function
   * @returns this, for chaining
   */
  on(type: string, handler: EventHandler): this {
    if (!this.events[type]) {
      this.events[type] = [];
    }

    this.events[type].push(handler);
    return this;
  }

  /**
   * Removes an event listener for the specified event type
   * @param type Event type
   * @param handler Event handler function to remove
   * @returns this, for chaining
   */
  off(type: string, handler?: EventHandler): this {
    if (!this.events[type]) {
      return this;
    }

    if (!handler) {
      // Remove all handlers for this event type
      delete this.events[type];
    } else {
      // Remove specific handler
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
   * Fires an event of the specified type
   * @param type Event type
   * @param args Arguments to pass to the event handlers
   * @returns this, for chaining
   */
  fire(type: string, ...args: any[]): this {
    if (!this.events[type]) {
      return this;
    }

    // Create a copy of the handlers array to prevent issues if handlers are added/removed during execution
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
   * Adds a one-time event listener that is automatically removed after it's called
   * @param type Event type
   * @param handler Event handler function
   * @returns this, for chaining
   */
  once(type: string, handler: EventHandler): this {
    const onceHandler = (...args: any[]) => {
      this.off(type, onceHandler);
      handler(...args);
    };

    return this.on(type, onceHandler);
  }

  /**
   * Removes all event listeners
   * @returns this, for chaining
   */
  removeAllListeners(): this {
    this.events = {};
    return this;
  }

  /**
   * Gets all registered event types
   * @returns Array of event types
   */
  eventNames(): string[] {
    return Object.keys(this.events);
  }

  /**
   * Gets the number of listeners for a specific event type
   * @param type Event type
   * @returns Number of listeners
   */
  listenerCount(type: string): number {
    return this.events[type]?.length || 0;
  }
}
