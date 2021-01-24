// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sInput from '../input';
import { CONST } from '../../lib/const';
import eventBus from '../../lib/event-bus';
import mocks from '../../lib/mock-utils';

let input;

customElements.define('s-input', sInput);

eventBus.on(CONST.update, jest.fn);
eventBus.on(CONST.validateFinished, jest.fn);

describe('test sInput module constructor', () => {
  test('must set label', async () => {
    const myLabel = 'myLabel';
    const div = document.createElement('div');
    div.innerHTML = `<s-input id="myInputWithLabel" label="${myLabel}"></s-input>`;
    document.body.appendChild(div);
    input = document.getElementById('myInputWithLabel');
    const labelElement = input.getElementsByClassName('mpy_text_input_label')[0];

    expect(labelElement.textContent).toEqual(myLabel);
    document.body.innerHTML = '';
  });

  test('must set value', async () => {
    const myValue = 'myValue';
    const div = document.createElement('div');
    div.innerHTML = `<s-input id="myInputWithValue" value="${myValue}"></s-input>`;
    document.body.appendChild(div);
    input = document.getElementById('myInputWithValue');

    expect(input.inputElement.value).toEqual(myValue);
    document.body.innerHTML = '';
  });

  test('must set model property', async () => {
    const myModel = 'myModel';
    const div = document.createElement('div');
    div.innerHTML = `<s-input id="myInputWithModel" :model="${myModel}"></s-input>`;
    document.body.appendChild(div);
    input = document.getElementById('myInputWithModel');

    expect(input.model).toEqual(myModel);
    document.body.innerHTML = '';
  });

  test('must be invalid by default if validate rule is set', async () => {
    const div = document.createElement('div');
    div.innerHTML = '<s-input id="myInputWithValidate" s-validate="min_8"></s-input>';
    document.body.appendChild(div);
    input = document.getElementById('myInputWithValidate');

    expect(input.inputElement.validity.valid).toBeFalsy();
    document.body.innerHTML = '';
  });
});

describe('test sInput module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    input = new sInput();
    document.body.appendChild(input);
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must be defined', () => {
    expect(sInput).toBeDefined();
  });

  test('must validate input', () => {
    input.validateRules = 'min_8';

    input.inputElement.value = ' '.repeat(7);
    input.validate();
    expect(input.inputElement.validity.valid).toBeFalsy();

    input.inputElement.value = ' '.repeat(8);
    input.validate();
    expect(input.inputElement.validity.valid).toBeTruthy();
  });

  test('must set new input value by model attribute', () => {
    const newValue = 'newValue';
    input.setAttribute('model', newValue);
    expect(input.inputElement.value).toEqual(newValue);
  });

  test('must validate on focus', async () => {
    input.validate = jest.fn();
    await input.inputElement.focus();
    expect(input.validate).toHaveBeenCalled();
  });

  test('must validate on blur', async () => {
    input.validate = jest.fn();
    await input.inputElement.focus();
    await input.inputElement.blur();
    expect(input.validate).toHaveBeenCalledTimes(2);
  });

  test('must fire dataChange eventBus event if model prop present', () => {
    input.inputElement.value = 'value';
    input.model = 'model';
    let res = [];
    eventBus.on('dataChange', (...e) => { res = e; });
    input.dataChange();

    expect(res).toEqual([input.model, input.inputElement.value]);
  });

  test('must reset input value to default', () => {
    input.inputElement.value = 'value';
    input.inputElement.defaultValue = 'defaultValue';
    input.inputElement.reset();
    expect(input.inputElement.value).toEqual(input.inputElement.defaultValue);
  });

  test('must call dataChange on keyUp', async () => {
    input.dataChange = jest.fn();
    await input.inputElement.focus();
    await input.inputElement.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));

    expect(input.dataChange).toHaveBeenCalled();
  });

  test('must fire "enterPressed" eventBus event', async () => {
    eventBus.emit = jest.fn();
    await input.inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(eventBus.emit).toHaveBeenCalledWith(CONST.enterPressed);
  });

  //
  // test('must be disabled by setAttribute', () => {
  //   input.setAttribute('disabled', 'true');
  //   expect(input.disabled).toBeTruthy();
  //   expect(input.getAttribute(CONST.disabled)).toBeTruthy();
  // });
  //
  // test('must be disabled by property', () => {
  //   input.disabled = true;
  //   expect(input.disabled).toBeTruthy();
  //   expect(input.getAttribute(CONST.disabled)).toBeTruthy();
  // });
  //
  // test('must be enabled by property', () => {
  //   input.disabled = true;
  //   expect(input.disabled).toBeTruthy();
  //   expect(input.getAttribute(CONST.disabled)).toBeTruthy();
  //
  //   input.disabled = false;
  //   expect(input.disabled).toBeFalsy();
  //   expect(input.getAttribute(CONST.disabled)).toBeFalsy();
  // });
  //
  // test('must be enabled by removeAttribute', () => {
  //   input.disabled = true;
  //   expect(input.disabled).toBeTruthy();
  //   expect(input.getAttribute(CONST.disabled)).toBeTruthy();
  //
  //   input.removeAttribute('disabled');
  //   expect(input.disabled).toBeFalsy();
  //   expect(input.getAttribute(CONST.disabled)).toBeFalsy();
  // });
  //
  // test('must fire onclick if Enter pressed', async () => {
  //   input.onclick = jest.fn();
  //   await input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
  //   expect(input.onclick).toHaveBeenCalled();
  // });
});
