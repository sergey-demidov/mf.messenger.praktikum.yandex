// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, beforeAll,
} from '@jest/globals';
import toaster, { ToasterMessageTypes } from '../toaster';
import mocks from './mock-utils';

toaster.timeout = 1000;
const hello = 'Hello';
const world = 'World';
const toasterWrapper = document.body.querySelector('.mpy_toaster_wrapper');

describe('test toaster', () => {
  test('must be defined', () => {
    expect(toaster).toBeDefined();
  });

  test('creates own wrapper', () => {
    expect(toasterWrapper.tagName).toEqual('DIV');
  });

  describe('show messages', () => {
    beforeAll(() => {
      toaster.toast(hello);
      toaster.toast(world, ToasterMessageTypes.warn);
    });
    test('must show messages', () => {
      expect(toasterWrapper.firstChild.textContent).toMatch(hello);
      expect(toasterWrapper.lastChild.textContent).toMatch(world);
    });

    test('default message type should be "info"', () => {
      expect(toasterWrapper.firstChild.classList.toString()).toMatch('__info');
    });

    test('must hide message by user click', async () => {
      toasterWrapper.firstChild.onclick();
      await mocks.sleep(500);
      expect(toasterWrapper.firstChild.textContent).toMatch(world);
    });

    test('must hide messages by timeout', async () => {
      await mocks.sleep(1500);
      expect(toasterWrapper.firstChild).toBeNull();
    });
  });

  describe('prepares errors', () => {
    test('generates own message if nothing received', () => {
      expect(toaster.bakeError('', false)).toEqual('Error: Something wrong');
    });
    test('returns plain sting as string', () => {
      expect(toaster.bakeError('Error', false)).toEqual('Error');
    });
    test('processes Error instance', () => {
      expect(toaster.bakeError(new Error('ErrorMessage'), false)).toEqual('Error: ErrorMessage');
    });
    test('processes Api responses', () => {
      expect(toaster.bakeError(JSON.stringify({ reason: 'reason' }), false)).toEqual('reason');
    });
    test('processes Api Errors', () => {
      expect(toaster.bakeError(new Error(JSON.stringify({ reason: 'reason' })), false)).toEqual('reason');
    });
    test('tries to convert any object to string', () => {
      expect(toaster.bakeError({ whatHappen: 'nothing' }, false)).toEqual('whatHappen: nothing');
    });
    test('processes XMLHttpRequest ProgressEvent', () => {
      expect(toaster.bakeError(new ProgressEvent(0), false)).toEqual('Error: Internet has broken down');
    });
  });
});
