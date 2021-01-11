// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, beforeEach, afterEach,
} from '@jest/globals';

import eventBus from '../event-bus';
import { CONST } from '../const';

describe('test EventBus', () => {
  // eslint-disable-next-line no-console
  const original = console.error;
  let output;

  beforeEach(() => {
    console.error = (e) => { output = e; };
  });

  afterEach(() => {
    console.error = original;
  });

  test('must be defined', () => {
    expect(eventBus).toBeDefined();
  });

  test('test EventBus functional', () => {
    let eventArgs = [];

    const strings = {
      one: 'one',
      two: 'two',
      three: 'three',
    };

    function callback(...args) {
      eventArgs = args;
    }

    eventBus.emit(CONST.update, strings.one, strings.two, strings.three);
    expect(eventArgs).toEqual([]);
    expect(output).toMatch('Нет события: update');

    expect(() => {
      eventBus.off(CONST.update, callback);
    }).toThrow('Нет события: update');

    eventBus.on(CONST.update, callback);
    eventBus.emit(CONST.update, strings.one, strings.two, strings.three);

    expect(eventArgs).toEqual([strings.one, strings.two, strings.three]);

    eventBus.off(CONST.update, callback);

    eventArgs = [];
    eventBus.emit(CONST.update, strings.one, strings.two, strings.three);
    expect(eventArgs).toEqual([]);
    expect(output).toMatch('Нет события: update');
  });
});
