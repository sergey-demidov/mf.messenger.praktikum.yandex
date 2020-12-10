class EventBus {
    constructor() {
        this.listeners = {};
        if (EventBus.instance) {
            return EventBus.instance;
        }
        EventBus.instance = this;
    }
    on(event, callback) {
        // console.dir(typeof event);
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
    }
    emit(event, ...args) {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`);
        }
        this.listeners[event].forEach((listener) => {
            listener(...args);
        });
    }
}
export default EventBus;
//# sourceMappingURL=event-bus.js.map