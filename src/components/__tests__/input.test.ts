// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sInput from '../input';
import { CONST } from '../../lib/const';
import eventBus from '../../lib/event-bus';

let inputInstance;

customElements.define('s-input', sInput);

eventBus.on(CONST.update, jest.fn);
eventBus.on(CONST.validateFinished, jest.fn);

describe('test sInput module constructor', () => {
  test('must set label', async () => {
    const myLabel = 'myLabel';
    const div = document.createElement('div');
    div.innerHTML = `<s-input id="myInputWithLabel" label="${myLabel}"></s-input>`;
    document.body.appendChild(div);
    inputInstance = document.getElementById('myInputWithLabel');
    const labelElement = inputInstance.getElementsByClassName('mpy_text_input_label')[0];

    expect(labelElement.textContent).toEqual(myLabel);
    document.body.innerHTML = '';
  });

  test('must set value', async () => {
    const myValue = 'myValue';
    const div = document.createElement('div');
    div.innerHTML = `<s-input id="myInputWithValue" value="${myValue}"></s-input>`;
    document.body.appendChild(div);
    inputInstance = document.getElementById('myInputWithValue');

    expect(inputInstance.inputElement.value).toEqual(myValue);
    document.body.innerHTML = '';
  });

  test('must set model property', async () => {
    const myModel = 'myModel';
    const div = document.createElement('div');
    div.innerHTML = `<s-input id="myInputWithModel" :model="${myModel}"></s-input>`;
    document.body.appendChild(div);
    inputInstance = document.getElementById('myInputWithModel');

    expect(inputInstance.model).toEqual(myModel);
    document.body.innerHTML = '';
  });

  test('must be invalid by default if validate rule is set', async () => {
    const div = document.createElement('div');
    div.innerHTML = '<s-input id="myInputWithValidate" s-validate="min_8"></s-input>';
    document.body.appendChild(div);
    inputInstance = document.getElementById('myInputWithValidate');

    expect(inputInstance.inputElement.validity.valid).toBeFalsy();
    document.body.innerHTML = '';
  });
});

describe('test sInput module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    inputInstance = new sInput();
    document.body.appendChild(inputInstance);
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must be defined', () => {
    expect(sInput).toBeDefined();
  });

  test('must validate input', () => {
    inputInstance.validateRules = 'min_8';

    inputInstance.inputElement.value = ' '.repeat(7);
    inputInstance.validate();
    expect(inputInstance.inputElement.validity.valid).toBeFalsy();

    inputInstance.inputElement.value = ' '.repeat(8);
    inputInstance.validate();
    expect(inputInstance.inputElement.validity.valid).toBeTruthy();
  });

  test('must set new input value by model attribute', () => {
    const newValue = 'newValue';
    inputInstance.setAttribute('model', newValue);
    expect(inputInstance.inputElement.value).toEqual(newValue);
  });

  test('must validate on focus', async () => {
    inputInstance.validate = jest.fn();
    await inputInstance.inputElement.focus();
    expect(inputInstance.validate).toHaveBeenCalled();
  });

  test('must validate on blur', async () => {
    inputInstance.validate = jest.fn();
    await inputInstance.inputElement.focus();
    await inputInstance.inputElement.blur();
    expect(inputInstance.validate).toHaveBeenCalledTimes(2);
  });

  test('must fire dataChange eventBus event if model prop present', () => {
    inputInstance.inputElement.value = 'value';
    inputInstance.model = 'model';
    let res = [];
    eventBus.on('dataChange', (...e) => { res = e; });
    inputInstance.dataChange();

    expect(res).toEqual([inputInstance.model, inputInstance.inputElement.value]);
  });

  test('must reset input value to default', () => {
    inputInstance.inputElement.value = 'value';
    inputInstance.inputElement.defaultValue = 'defaultValue';
    inputInstance.inputElement.reset();
    expect(inputInstance.inputElement.value).toEqual(inputInstance.inputElement.defaultValue);
  });

  test('must call dataChange on keyUp', async () => {
    inputInstance.dataChange = jest.fn();
    await inputInstance.inputElement.focus();
    await inputInstance.inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));

    expect(inputInstance.dataChange).toHaveBeenCalled();
  });

  test('must fire "enterPressed" eventBus event', async () => {
    eventBus.emit = jest.fn();
    await inputInstance.inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(eventBus.emit).toHaveBeenCalledWith(CONST.enterPressed);
  });
});
