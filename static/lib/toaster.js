import EventBus from "./event-bus.js";
import Queue from "./queue.js";
export const ToasterMessageTypes = Object.freeze({
    info: 'info',
    error: 'error',
    warn: 'warn',
});
export default class Toaster {
    constructor(timeout = 4000) {
        this.queue = new Queue();
        this.eventBus = new EventBus();
        this.timeout = 4000;
        this.wrapper = document.createElement('div');
        if (Toaster.instance) {
            return Toaster.instance;
        }
        Toaster.instance = this;
        this.wrapper.classList.add('mpy_toaster_wrapper');
        document.body.appendChild(this.wrapper);
        this.timeout = timeout;
    }
    toast(message, type = ToasterMessageTypes.info) {
        this.queue.enqueue({ message, type });
        this.render();
        setTimeout(() => {
            this.queue.dequeue();
            this.render();
        }, this.timeout);
    }
    render() {
        this.wrapper.innerHTML = '';
        Array.from(this.queue.values()).forEach((t) => {
            const toast = t;
            const toastElement = document.createElement('div');
            toastElement.classList.add('mpy_toaster_toast');
            toastElement.classList.add(`mpy_toaster_toast__${toast.type}`);
            toastElement.innerText = toast.message;
            this.wrapper.appendChild(toastElement);
            setTimeout(() => {
                toastElement.style.opacity = '0';
            }, this.timeout - 500);
        });
    }
}
//# sourceMappingURL=toaster.js.map