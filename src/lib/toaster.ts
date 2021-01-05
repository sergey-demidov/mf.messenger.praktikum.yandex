import { hash8, isJsonString } from './utils';
import { CONST } from './const';

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

  timeout = 4000;

  wrapper = document.createElement('div')

  constructor() {
    if (Toaster.instance) {
      return Toaster.instance;
    }
    Toaster.instance = this;
    this.wrapper.classList.add('mpy_toaster_wrapper');
    document.body.appendChild(this.wrapper);
  }

  toast(message: string, type = ToasterMessageTypes.info): void {
    const id = hash8();
    this.wrapper.appendChild(this.makeToast(<sToast>{ message, type, id }));
    setTimeout(() => {
      this.untoast(id);
    }, this.timeout);
  }

  untoast(id: string): void {
    const toastElement = document.getElementById(id);
    if (toastElement) {
      toastElement.style.opacity = '0';
      setTimeout(() => {
        toastElement.remove();
      }, 333);
    }
  }

  bakeError(error: unknown, toast = true): string {
    // eslint-disable-next-line no-console
    console.dir(error);
    console.trace();
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
    if (typeof error === CONST.string) {
      message = <string>error;
    } else
    if (error instanceof Error && isJsonString(error.message)) {
      message = JSON.parse(error.message).reason || error.message;
    } else
    if (error instanceof Error) {
      message = error.toString();
    } else
    if (typeof error === CONST.object) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      message = JSON.stringify(error, null, 1)
        .slice(2, -2)
        .split('"').join('')
        .trim();
    } else {
      throw new Error(`Can't resolve error ${error}`);
    }
    if (toast) {
      this.toast(message, ToasterMessageTypes.error);
    }
    return message;
  }

  makeToast(toast: sToast): HTMLElement {
    const toastElement = document.createElement('div');
    toastElement.id = toast.id;
    toastElement.classList.add('mpy_toaster_toast', `mpy_toaster_toast__${toast.type}`, 'unselectable');
    toastElement.textContent = toast.message;
    toastElement.onclick = () => this.untoast(toast.id);
    return toastElement;
  }
}
