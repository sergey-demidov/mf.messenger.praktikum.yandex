import EventBus from "./event-bus.js";
import Queue from "./queue.js";
const types = Object.freeze({
    info: 'info',
    error: 'error',
    warn: 'warn',
});
export default class sToaster extends HTMLElement {
    constructor() {
        super();
        this.queue = new Queue();
        this.eventBus = new EventBus();
        this.classList.add('mpy_toaster_wrapper');
        this.timeout = parseInt(this.getAttribute('timeout') || '4000', 10);
    }
    toast(message, type = types.info) {
        this.queue.enqueue({ message, type });
        this.render();
        setTimeout(() => {
            this.queue.dequeue();
            this.render();
        }, this.timeout);
    }
    render() {
        this.innerHTML = '';
        Array.from(this.queue.values()).forEach((t) => {
            const toast = t;
            const toastElement = document.createElement('div');
            toastElement.classList.add('mpy_toaster_toast');
            toastElement.classList.add(`mpy_toaster_toast__${toast.type}`);
            toastElement.innerText = toast.message;
            this.appendChild(toastElement);
            setTimeout(() => {
                toastElement.style.opacity = '0';
            }, this.timeout - 500);
        });
    }
}
//# sourceMappingURL=toaster.js.map