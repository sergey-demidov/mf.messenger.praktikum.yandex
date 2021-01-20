// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  expect, describe, test, jest,
} from '@jest/globals';

import Validate from '../validate';
import eventBus from '../event-bus';
import { CONST } from '../const';

eventBus.on(CONST.validateFinished, jest.fn);

const validateInstance = new Validate();
const pass = { message: 'Ok', valid: true };

describe('test Validate class', () => {
  test('must be defined', () => {
    expect(Validate).toBeDefined();
  });

  test('must be a singleton', () => {
    expect(new Validate()).toEqual(validateInstance);
  });

  test('must pass without ruleset', () => {
    expect(validateInstance.validate('')).toEqual(pass);
  });

  test('must pass with empty ruleset', () => {
    expect(validateInstance.validate('', '')).toEqual(pass);
  });

  test('must throw error if rule dont exist', () => {
    expect(() => validateInstance.validate('', 'noSuchRule')).toThrow(TypeError);
  });

  test('must pass with match: rule', () => {
    expect(validateInstance.validate('PassWord', 'match:PassWord')).toEqual(pass);
  });

  test('must reject if match:XXX is not match XXX ', () => {
    expect(validateInstance.validate('InvalidPassWord', 'match:PassWord').valid).toEqual(false);
  });

  test('must pass with min_* rule and string length >= value', () => {
    expect(validateInstance.validate(' '.repeat(8), 'min_8')).toEqual(pass);
  });

  test('must reject with min_* rule and string length < value', () => {
    expect(validateInstance.validate(' '.repeat(7), 'min_8').valid).toEqual(false);
  });

  test('must pass with max_* rule and string length <= value', () => {
    expect(validateInstance.validate(' '.repeat(8), 'max_8')).toEqual(pass);
  });

  test('must reject with max_* rule and string length > value', () => {
    expect(validateInstance.validate(' '.repeat(9), 'max_8').valid).toEqual(false);
  });

  test('must pass with required rule and string length > 0', () => {
    expect(validateInstance.validate(' ', 'required')).toEqual(pass);
  });

  test('must reject with required rule and string length < 1', () => {
    expect(validateInstance.validate('', 'required').valid).toEqual(false);
  });
});
