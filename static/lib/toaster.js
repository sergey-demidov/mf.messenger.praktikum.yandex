import { hash8, isJsonString } from "./utils.js";
import { CONST } from "./const.js";
export const ToasterMessageTypes = Object.freeze({
    info: 'info',
    error: 'error',
    warn: 'warn',
});
class Toaster {
    constructor() {
        this.timeout = 4000;
        this.wrapper = document.createElement('div');
        if (Toaster.instance) {
            return Toaster.instance;
        }
        Toaster.instance = this;
        this.wrapper.classList.add('mpy_toaster_wrapper');
        document.body.appendChild(this.wrapper);
    }
    toast(message, type = ToasterMessageTypes.info) {
        const id = hash8();
        this.wrapper.appendChild(this.makeToast({ message, type, id }));
        setTimeout(() => {
            this.untoast(id);
        }, this.timeout);
    }
    untoast(id) {
        const toastElement = document.getElementById(id);
        if (toastElement) {
            toastElement.style.opacity = '0';
            setTimeout(() => {
                toastElement.remove();
            }, 333);
        }
    }
    bakeError(error, toast = true) {
        // console.dir(error);
        // console.trace();
        let message = '';
        if (!error) {
            message = 'Error: Something wrong';
        }
        else if (error instanceof ProgressEvent) {
            message = 'Error: Internet has broken down';
        }
        else if (isJsonString(error)) {
            message = JSON.parse(error).reason || error;
        }
        else if (typeof error === CONST.string) {
            message = error;
        }
        else if (error instanceof Error && isJsonString(error.message)) {
            message = JSON.parse(error.message).reason || error.message;
        }
        else if (error instanceof Error) {
            message = error.toString();
        }
        else if (typeof error === CONST.object) {
            // eslint-disable-next-line @typescript-eslint/ban-types
            message = JSON.stringify(error, null, 1)
                .slice(2, -2)
                .split('"').join('')
                .trim();
        }
        else {
            throw new Error(`Can't resolve error ${error}`);
        }
        if (toast) {
            this.toast(message, ToasterMessageTypes.error);
        }
        return message;
    }
    makeToast(toast) {
        const toastElement = document.createElement('div');
        toastElement.id = toast.id;
        toastElement.classList.add('mpy_toaster_toast', `mpy_toaster_toast__${toast.type}`, 'unselectable');
        toastElement.textContent = toast.message;
        toastElement.onclick = () => this.untoast(toast.id);
        return toastElement;
    }
}
const toaster = new Toaster();
export default toaster;
//# sourceMappingURL=toaster.js.map