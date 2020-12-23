import EventBus from '../lib/event-bus';

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
    if (!this.getAttribute('class')) {
      this.classList.add('mpy_button');
    }
    if (this.hasAttribute('block')) {
      this.classList.add('mpy_button__block');
    }
    this.classList.add('unselectable');
    this.addEventListener('keydown', (e) => this.onKeydown(e));
  }

  // eslint-disable-next-line class-methods-use-this
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      (e.target as HTMLElement).click();
    }
  }
}

export default sButton;
