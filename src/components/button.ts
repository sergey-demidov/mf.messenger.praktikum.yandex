import EventBus from '../lib/event-bus.js';

class sButton extends HTMLElement {
  get disabled(): boolean {
    return this.hasAttribute('disabled');
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute('tabindex', '-1');
      this.classList.add('mpy_button__disabled');
      this.style.pointerEvents = 'none';
    } else {
      this.setAttribute('tabindex', '0');
      this.classList.remove('mpy_button__disabled');
      this.style.pointerEvents = 'auto';
    }
  }

  eventBus = new EventBus();

  static get observedAttributes(): string[] {
    return ['disabled'];
  }

  constructor() {
    super();
    this.classList.add('mpy_button');
  }
}

export default sButton;
