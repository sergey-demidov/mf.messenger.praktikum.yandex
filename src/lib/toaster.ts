import { CONST, hash8, isJsonString } from './utils';

export const ToasterMessageTypes = Object.freeze({
  info: 'info',
  error: 'error',
  warn: 'warn',
});

type sToast = {
  message: string
  type: string
  id: string
}

export default class Toaster {
  private static instance: Toaster;

  timeout = 5000;

  wrapper = document.createElement('div')

  constructor(timeout = 5000) {
    if (Toaster.instance) {
      return Toaster.instance;
    }
    Toaster.instance = this;
    this.wrapper.classList.add('mpy_toaster_wrapper');
    document.body.appendChild(this.wrapper);
    this.timeout = timeout;
  }

  toast(message: string, type = ToasterMessageTypes.info): void {
    const id = hash8();
    this.wrapper.appendChild(this.makeToast(<sToast>{ message, type, id }));
    setTimeout(() => {
      this.untoast(id);
    }, this.timeout);
  }

  // eslint-disable-next-line class-methods-use-this
  untoast(id: string): void {
    const toastElement = document.getElementById(id);
    if (toastElement) {
      toastElement.style.opacity = '0';
      setTimeout(() => {
        toastElement.remove();
      }, 333);
    }
  }

  bakeError(error: unknown):void {
    let message = '';
    if (!error) {
      message = 'Error: Something wrong';
    } else
    if (error instanceof ProgressEvent) {
      message = 'Error: Internet has broken down';
    } else
    if (isJsonString(error as string)) {
      message = JSON.parse(error as string).reason || error;
    } else
    if (typeof error === CONST.object) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      message = (error as object).toString();
    } else {
      throw new Error(`Can't resolve error ${error}`);
    }
    this.toast(message);
  }

  makeToast(toast: sToast): HTMLElement {
    const toastElement = document.createElement('div');
    toastElement.id = toast.id;
    toastElement.classList.add('mpy_toaster_toast', `mpy_toaster_toast__${toast.type}`, 'unselectable');
    toastElement.innerText = toast.message;
    toastElement.onclick = () => this.untoast(toast.id);
    return toastElement;
  }
}
