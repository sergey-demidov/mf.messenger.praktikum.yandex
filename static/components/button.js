import EventBus from "../lib/event-bus.js";
class sButton extends HTMLElement {
    constructor() {
        super();
        this.eventBus = new EventBus();
        if (!this.getAttribute('class')) {
            this.classList.add('mpy_button');
        }
        if (this.hasAttribute('block')) {
            this.classList.add('mpy_button__block');
        }
        this.classList.add('unselectable');
        this.addEventListener('keydown', (e) => this.onKeydown(e));
    }
    get disabled() {
        return this.hasAttribute('disabled');
    }
    set disabled(val) {
        if (val) {
            this.setAttribute('tabindex', '-1');
            this.classList.add('mpy_button__disabled');
            this.style.pointerEvents = 'none';
        }
        else {
            this.setAttribute('tabindex', '0');
            this.classList.remove('mpy_button__disabled');
            this.style.pointerEvents = 'auto';
        }
    }
    static get observedAttributes() {
        return ['disabled'];
    }
    // eslint-disable-next-line class-methods-use-this
    onKeydown(e) {
        if (e.key === 'Enter') {
            e.target.click();
        }
    }
}
export default sButton;
//# sourceMappingURL=button.js.map