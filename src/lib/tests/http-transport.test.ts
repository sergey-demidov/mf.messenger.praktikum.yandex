import {
  expect, describe, test, beforeAll,
} from '@jest/globals';

import HttpTransport from '../http-transport';
import mocks from './mock-utils';

const fetch = new HttpTransport('/auth');

describe('test HttpTransport module', () => {
  test('is defined', () => {
    expect(HttpTransport).toBeDefined();
  });

  // test('get without payload', async () => fetch.get('/', {}).then((res) => expect(JSON.parse(res.response).message).toEqual('Ok')));
  //
  // test('get with payload', async () => {
  //   mocks.fetchXmlHttp(200, { message: 'Ok' });
  //   return fetch.get('/?what=that', {}).then((res) => expect(res).toEqual('Ok'));
  // });
});
