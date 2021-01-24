import Validate from '../lib/validate';
import eventBus from '../lib/event-bus';
import { sHTMLInputElement } from '../lib/types';
import { CONST } from '../lib/const';

const css = Object.freeze({
  wrapper: 'mpy_text_input_wrapper',
  label: 'mpy_text_input_label',
  label_invalid: 'mpy_text_input_label__invalid',
  input: 'mpy_text_input',
  input_invalid: 'mpy_text_input__invalid',
});

class sInput extends HTMLElement {
  eventBus = eventBus;

  inputElement: HTMLInputElement;

  labelElement: HTMLLabelElement;

  validateInstance: Validate;

  validateRules: string;

  defaultLabel: string;

  model: string;

  constructor() {
    super();
    this.textContent = '';
    this.validateInstance = new Validate();
    this.classList.add(css.wrapper);

    this.defaultLabel = this.getAttribute('label') || this.getAttribute('name') || 'label';

    this.labelElement = document.createElement('label');
    this.labelElement.classList.add(css.label);
    this.labelElement.textContent = this.defaultLabel;

    this.model = this.getAttribute(':model') || '';
    this.inputElement = document.createElement('input');
    this.inputElement.classList.add(css.input);
    this.inputElement.type = this.getAttribute('type') || 'text';
    this.inputElement.name = this.getAttribute('name') || '';
    this.inputElement.value = this.getAttribute('value') || '';
    this.inputElement.setAttribute('list', this.getAttribute('list') || '');
    this.inputElement.spellcheck = false;
    this.inputElement.autocomplete = 'off';

    this.validateRules = this.getAttribute('s-validate') || CONST.pass;
    if (this.validateRules !== CONST.pass && !this.hasAttribute('valid')) {
      this.inputElement.setCustomValidity('invalid'); // make invalid
    }

    this.appendChild(this.labelElement);
    this.appendChild(this.inputElement);

    this.inputElement.addEventListener('focus', () => this.validate());
    this.inputElement.addEventListener('blur', () => this.validate());
    this.inputElement.addEventListener('keyup', (e) => this.onKeyup(e));
    this.inputElement.addEventListener('select', (e) => this.onSelect(e));
    this.inputElement.addEventListener('keydown', (e) => this.onKeydown(e));

    (this.inputElement as sHTMLInputElement).reset = (): void => {
      this.inputElement.value = this.inputElement.defaultValue;
      this.dataChange();
    };
  }

  onSelect(e: Event): void {
    this.dataChange();
    e.stopPropagation();
  }

  onKeyup(e: KeyboardEvent): void {
    this.dataChange();
    e.stopPropagation();
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.eventBus.emit(CONST.enterPressed);
    }
  }

  setLabel(message: string): void {
    if (this.labelElement.textContent === message) return;
    this.labelElement.textContent = message;
  }

  validate(): void {
    if (this.validateRules === CONST.pass) return;
    const result = this.validateInstance.validate(this.inputElement.value, this.validateRules);
    this.inputElement.setCustomValidity(result.valid ? '' : result.message);
    this.eventBus.emit(CONST.update);

    if (!result.valid) {
      this.inputElement.classList.add(css.input_invalid);
      this.labelElement.classList.add(css.label_invalid);
      this.setLabel(result.message);
      return;
    }
    this.inputElement.classList.remove(css.input_invalid);
    this.labelElement.classList.remove(css.label_invalid);
    this.setLabel(this.defaultLabel);
  }

  static get observedAttributes(): string[] {
    return ['label', 'value', 'model', 's-validate'];
  }

  dataChange(): void {
    if (this.model) {
      this.eventBus.emit('dataChange', this.model, this.inputElement.value);
    }
    this.validate();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (name === 'model' && this.inputElement.value !== newValue) {
      if (oldValue === null && !this.inputElement.defaultValue) {
        this.inputElement.defaultValue = newValue; // need for reset forms
      }
      this.inputElement.value = newValue;
      this.validate();
    }
    if (name === 's-validate') {
      this.validateRules = newValue;
    }
  }

  connectedCallback():void {
    if (this.autofocus) {
      this.inputElement.focus();
    }
  }
}

export default sInput;
