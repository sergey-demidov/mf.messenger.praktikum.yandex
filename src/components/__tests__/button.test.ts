// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sButton from '../button';
import { CONST } from '../../lib/const';

let button;

customElements.define('s-button', sButton);

describe('test sButton module constructor', () => {
  test('must set block class', () => {
    const div = document.createElement('div');
    div.innerHTML = '<s-button id="myBlockButton" block> button </s-button>';
    document.body.appendChild(div);
    button = document.getElementById('myBlockButton');
    expect(button.classList.contains('mpy_button__block')).toBeTruthy();
    document.body.innerHTML = '';
  });

  test('must set round class', () => {
    const div = document.createElement('div');
    div.innerHTML = '<s-button id="myRoundedButton" round> button </s-button>';
    document.body.appendChild(div);
    button = document.getElementById('myRoundedButton');
    expect(button.classList.contains('mpy_button__round')).toBeTruthy();
    document.body.innerHTML = '';
  });
});

describe('test sButton module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    button = new sButton();
    document.body.appendChild(button);
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must be defined', () => {
    expect(sButton).toBeDefined();
  });

  test('must be enabled by default', () => {
    expect(button.disabled).toBeFalsy();
  });

  test('must be disabled by setAttribute', () => {
    button.setAttribute('disabled', 'true');
    expect(button.disabled).toBeTruthy();
    expect(button.getAttribute(CONST.disabled)).toBeTruthy();
  });

  test('must be disabled by property', () => {
    button.disabled = true;
    expect(button.disabled).toBeTruthy();
    expect(button.getAttribute(CONST.disabled)).toBeTruthy();
  });

  test('must be enabled by property', () => {
    button.disabled = true;
    expect(button.disabled).toBeTruthy();
    expect(button.getAttribute(CONST.disabled)).toBeTruthy();

    button.disabled = false;
    expect(button.disabled).toBeFalsy();
    expect(button.getAttribute(CONST.disabled)).toBeFalsy();
  });

  test('must be enabled by removeAttribute', () => {
    button.disabled = true;
    expect(button.disabled).toBeTruthy();
    expect(button.getAttribute(CONST.disabled)).toBeTruthy();

    button.removeAttribute('disabled');
    expect(button.disabled).toBeFalsy();
    expect(button.getAttribute(CONST.disabled)).toBeFalsy();
  });

  test('must fire onclick if Enter pressed', async () => {
    button.onclick = jest.fn();
    await button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(button.onclick).toHaveBeenCalled();
  });
});
