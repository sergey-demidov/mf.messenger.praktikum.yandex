// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-console,@typescript-eslint/no-unused-vars */
import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';

import store from '../store';
import eventBus from '../event-bus';
import { CONST } from '../const';

eventBus.on(CONST.update, jest.fn);

describe('test Store class', () => {
  const original = console.warn;
  let output;

  beforeEach(() => {
    // eslint-disable-next-line no-console,@typescript-eslint/no-unused-vars
    console.warn = (e) => { output = e; };
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.warn = original;
  });

  test('must be defined', () => {
    expect(store).toBeDefined();
  });

  test('must define pre-defined variables', () => {
    expect(store.state.currentUser).toBeDefined();
    expect(store.state.currentChat).toBeDefined();
    expect(store.state.currentMember).toBeDefined();
    expect(store.state.users).toBeDefined();
  });

  test('must set values to pre-defined objects', () => {
    store.state.currentUser.id = 777;
    expect(store.state.currentUser.id).toEqual(777);
  });

  test('must set values to pre-defined objects', () => {
    window.debug = true;
    store.state.currentUser.XXX = 777;
    expect(store.state.currentUser.XXX).toEqual(777);
  });

  test('must reject to delete pre-defined objects', () => {
    expect(() => delete store.state.currentUser).toThrow(Error);
  });

  test('must reject to delete values from pre-defined objects', () => {
    expect(() => delete store.state.currentUser.id).toThrow(Error);
  });
});
