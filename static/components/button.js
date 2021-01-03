import { CONST } from "../lib/const.js";
class sButton extends HTMLElement {
    get disabled() {
        // return this.hasAttribute(CONST.disabled);
        return this.hasAttribute(CONST.disabled);
    }
    set disabled(val) {
        if (val) {
            this.setAttribute(CONST.disabled, 'true');
            this.setAttribute('tabindex', '-1');
            this.classList.add('mpy_button__disabled');
            this.style.pointerEvents = CONST.none;
        }
        else {
            this.removeAttribute(CONST.disabled);
            this.setAttribute('tabindex', '0');
            this.classList.remove('mpy_button__disabled');
            this.style.pointerEvents = CONST.auto;
        }
    }
    // static get observedAttributes(): string[] {
    //   return ['disabled'];
    // }
    constructor() {
        super();
        if (!this.getAttribute(CONST.class)) {
            this.classList.add('mpy_button');
        }
        if (this.hasAttribute('block')) {
            this.classList.add('mpy_button__block');
        }
        else if (this.hasAttribute('round')) {
            this.classList.add('mpy_button__round');
        }
        this.classList.add('unselectable');
        this.addEventListener('keydown', (e) => this.onKeydown(e));
    }
    onKeydown(e) {
        if (e.key === 'Enter') {
            e.target.click();
        }
    }
}
export default sButton;
//# sourceMappingURL=button.js.map