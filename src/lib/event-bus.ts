interface listeners {
  [key: string]: { (...args : unknown[]): void; }[];
}

class EventBus {
  protected listeners: listeners = {};

  private static instance: EventBus;

  constructor() {
    if (EventBus.instance) {
      return EventBus.instance;
    }
    EventBus.instance = this;
  }

  on(event: string, callback: () => void): void {
    // console.dir(typeof event);
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: () => void): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback,
    );
  }

  emit(event: string, ...args: string[]): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event].forEach((listener) => {
      listener(...args);
    });
  }
}

export default EventBus;