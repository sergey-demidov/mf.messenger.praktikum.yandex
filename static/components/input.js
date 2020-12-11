import Validate from '../lib/validate.js';
import EventBus from '../lib/event-bus.js';
const css = Object.freeze({
    wrapper: 'mpy_text_input_wrapper',
    label: 'mpy_text_input_label',
    label_alert: 'mpy_text_input_label__invalid',
    input: 'mpy_text_input',
    input_alert: 'mpy_text_input__invalid',
});
class sInput extends HTMLElement {
    constructor() {
        super();
        this.eventBus = new EventBus();
        this.innerText = '';
        this.validateInstance = new Validate();
        this.classList.add(css.wrapper);
        this.defaultLabel = this.getAttribute('label') || this.getAttribute('name') || 'label';
        this.labelElement = document.createElement('label');
        this.labelElement.classList.add(css.label);
        this.labelElement.innerText = this.defaultLabel;
        this.model = this.getAttribute(':model') || '';
        this.inputElement = document.createElement('input');
        this.inputElement.classList.add(css.input);
        this.inputElement.type = this.getAttribute('type') || 'text';
        this.inputElement.name = this.getAttribute('name') || '';
        this.inputElement.value = this.getAttribute('value') || '';
        this.inputElement.spellcheck = false;
        this.inputElement.autocomplete = 'off';
        this.inputElement.autofocus = this.autofocus;
        this.autofocus = false;
        this.validateRules = this.getAttribute('s-validate') || 'pass';
        if (this.validateRules !== 'pass') {
            this.inputElement.setCustomValidity('XXX'); // make invalid by default
        }
        this.appendChild(this.labelElement);
        this.appendChild(this.inputElement);
        this.inputElement.addEventListener('focus', () => this.validate());
        this.inputElement.addEventListener('blur', () => this.validate());
        this.inputElement.addEventListener('keyup', (e) => this.onKeyup(e));
        this.inputElement.addEventListener('keydown', (e) => this.onKeydown(e));
        this.eventBus.on('reset', () => this.reset());
    }
    reset() {
        this.inputElement.value = this.inputElement.defaultValue;
        this.dataChange();
    }
    onKeyup(e) {
        this.dataChange();
        e.stopPropagation();
    }
    // eslint-disable-next-line class-methods-use-this
    onKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    setLabel(message) {
        if (this.labelElement.innerText === message)
            return;
        this.labelElement.innerText = message;
    }
    validate() {
        const result = this.validateInstance.validate(this.inputElement.value, this.validateRules);
        this.inputElement.setCustomValidity(result.valid ? '' : result.message);
        this.eventBus.emit('update');
        if (!result.valid) {
            this.inputElement.classList.add(css.input_alert);
            this.labelElement.classList.add(css.label_alert);
            this.setLabel(result.message);
            return;
        } // else
        this.inputElement.classList.remove(css.input_alert);
        this.labelElement.classList.remove(css.label_alert);
        this.setLabel(this.defaultLabel);
    }
    static get observedAttributes() {
        return ['label', 'value', 'model'];
    }
    dataChange() {
        if (this.model) {
            this.eventBus.emit('dataChange', this.model, this.inputElement.value);
        }
        this.validate();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'model' && this.inputElement.value !== newValue) {
            if (oldValue === null && !this.inputElement.defaultValue) {
                this.inputElement.defaultValue = newValue; // need for reset forms
            }
            this.inputElement.value = newValue;
        }
    }
}
export default sInput;
//# sourceMappingURL=input.js.map