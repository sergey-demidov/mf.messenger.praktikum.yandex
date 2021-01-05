// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test,
} from '@jest/globals';
import sue from '../sue';
import { hash8 } from '../utils';
import { CONST } from '../const';

describe('test Sue', () => {
  const root = document.body;
  let name: string;

  const createPage = (template = '<div></div>', data = () => ({}), methods = {}) => {
    name = `s-page-${hash8()}`;
    sue({
      name, template, data, methods,
    });
    const element = document.createElement(name);
    root.appendChild(element);
    return element;
  };

  test('must be defined', () => {
    expect(sue).toBeDefined();
  });

  test('name must set to custom element name', () => {
    const el = createPage();
    el.show();
    expect(el.name).toEqual(name);
    expect(window.customElements.get(name)).toBeTruthy();
  });

  test('must render :s-text to text content', () => {
    const el = createPage('<span :s-text="greeting"></span>', () => ({ greeting: 'Hello' }));
    el.show();
    expect(el.textContent).toEqual('Hello');
  });

  test('must dynamic set disabled attribute', () => {
    const el = createPage('<span :disabled="greeting"></span>', () => ({ greeting: true }));
    el.show();
    expect(el.firstChild.disabled).toBeTruthy();
  });

  test('must call user defined functions', () => {
    const el = createPage('<span :s-text="greeting()"></span>', () => ({}), { greeting: () => 'Hello' });
    el.show();
    expect(el.textContent).toEqual('Hello');
  });

  test('must dynamic set props', () => {
    const el = createPage('<span :title="greeting"></span>', () => ({ greeting: 'Hello' }));
    el.show();
    expect(el.innerHTML).toEqual('<span :title="greeting" title="Hello"></span>');
    el.data.greeting = 'World';
    expect(el.innerHTML).toEqual('<span :title="greeting" title="World"></span>');
  });

  test('must set inline event handlers', () => {
    const el = createPage('<span @click="greeting()"></span>', () => ({}), { greeting: () => 'Hello' });
    el.show();
    expect(typeof el.firstChild.onclick).toEqual(CONST.function);
    expect(el.firstChild.onclick()).toEqual('Hello');
  });

  test('must render lists', () => {
    const el = createPage('<span s-for="variable in array" s-key="any"><a :s-text="array[variable]"></span>', () => ({ array: [1, 2, 3] }));
    el.show();
    expect(el.firstChild.childNodes.length).toEqual(3);
    expect(el.firstChild.childNodes[0].textContent).toEqual('1');
    expect(el.firstChild.childNodes[1].textContent).toEqual('2');
    expect(el.firstChild.childNodes[2].textContent).toEqual('3');
  });

  test('must validate user defined params', () => {
    const el = createPage('<span :s-text="Any*Fake*Text"></span>', () => ({}), { greeting: () => 'Hello' });
    expect(el.show).toThrow('Cant parse string \'Any*Fake*Text\'');
  });

  test('must validate user defined functions', () => {
    const el = createPage('<span :s-text="undefinedFunction()"></span>');
    expect(el.show).toThrow('Method \'undefinedFunction\' is not defined');
  });

  test('must validate user defined variables', () => {
    const el = createPage('<span :s-text="undefinedValue"></span>');
    expect(el.show).toThrow('property \'undefinedValue\' undefined');
  });

  test('must validate user defined event handlers', () => {
    const el = createPage('<span @click="undefinedMethod()"></span>');
    expect(el.show).toThrow('Method \'undefinedMethod\' does not exist');
  });

  test('must validate user defined events', () => {
    const el = createPage('<span @NoSuchEvent="greeting()"></span>', () => ({}), { greeting: () => 'Hello' });
    expect(el.show).toThrow('event handler \'onnosuchevent\' does not exist');
  });
});
