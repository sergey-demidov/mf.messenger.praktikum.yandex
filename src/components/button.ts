import { CONST } from '../lib/const';

class sButton extends HTMLElement {
  get disabled(): boolean {
    return this.hasAttribute(CONST.disabled);
  }

  set disabled(val: boolean) {
    if (val) {
      this.setAttribute(CONST.disabled, 'true');
      this.setAttribute('tabindex', '-1');
      this.classList.add('mpy_button__disabled');
      this.style.pointerEvents = CONST.none;
    } else {
      this.removeAttribute(CONST.disabled);
      this.setAttribute('tabindex', '0');
      this.classList.remove('mpy_button__disabled');
      this.style.pointerEvents = CONST.auto;
    }
  }

  constructor() {
    super();
    if (!this.getAttribute(CONST.class)) {
      this.classList.add('mpy_button');
    }
    if (this.hasAttribute('block')) {
      this.classList.add('mpy_button__block');
    } else if (this.hasAttribute('round')) {
      this.classList.add('mpy_button__round');
    }
    this.classList.add('unselectable');
    this.addEventListener('keydown', (e) => this.onKeydown(e));
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      (e.target as HTMLElement).click();
    }
  }
}

export default sButton;
