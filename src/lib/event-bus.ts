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

  on(event: string, callback: (...args: unknown[]) => void): void {
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
      // eslint-disable-next-line no-console
      console.error(`Нет события: ${event}`);
      return;
    }
    this.listeners[event].forEach((listener) => {
      if (typeof listener === 'function') listener(...args);
    });
  }
}

const eventBus = new EventBus();

export default eventBus;
