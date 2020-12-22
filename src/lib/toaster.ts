import EventBus from './event-bus';
import Queue from './queue';

export const ToasterMessageTypes = Object.freeze({
  info: 'info',
  error: 'error',
  warn: 'warn',
});

type sToast = {
  message: string,
  type: string
}

export default class Toaster {
  private static instance: Toaster;

  queue = new Queue();

  eventBus = new EventBus();

  timeout = 4000;

  wrapper = document.createElement('div')

  constructor(timeout = 4000) {
    if (Toaster.instance) {
      return Toaster.instance;
    }
    Toaster.instance = this;
    this.wrapper.classList.add('mpy_toaster_wrapper');
    document.body.appendChild(this.wrapper);
    this.timeout = timeout;
  }

  toast(message: string, type = ToasterMessageTypes.info): void {
    this.queue.enqueue(<sToast>{ message, type });
    this.render();
    setTimeout(() => {
      this.queue.dequeue();
      this.render();
    }, this.timeout);
  }

  render(): void {
    this.wrapper.innerHTML = '';
    Array.from(this.queue.values()).forEach((t) => {
      const toast = <sToast>t;
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
