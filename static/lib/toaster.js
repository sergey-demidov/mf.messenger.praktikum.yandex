import { hash8 } from "./utils.js";
export const ToasterMessageTypes = Object.freeze({
    info: 'info',
    error: 'error',
    warn: 'warn',
});
export default class Toaster {
    constructor(timeout = 5000) {
        this.timeout = 5000;
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
        const id = hash8();
        this.wrapper.appendChild(this.makeToast({ message, type, id }));
        setTimeout(() => {
            this.untoast(id);
        }, this.timeout);
    }
    // eslint-disable-next-line class-methods-use-this
    untoast(id) {
        const toastElement = document.getElementById(id);
        if (toastElement) {
            toastElement.style.opacity = '0';
            setTimeout(() => {
                toastElement.remove();
            }, 333);
        }
    }
    makeToast(toast) {
        const toastElement = document.createElement('div');
        toastElement.id = toast.id;
        toastElement.classList.add('mpy_toaster_toast', `mpy_toaster_toast__${toast.type}`, 'unselectable');
        toastElement.innerText = toast.message;
        toastElement.onclick = () => this.untoast(toast.id);
        return toastElement;
    }
}
//# sourceMappingURL=toaster.js.map