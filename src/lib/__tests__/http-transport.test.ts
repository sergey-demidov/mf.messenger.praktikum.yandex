// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test,
} from '@jest/globals';
import nock from 'nock';
import HttpTransport from '../http-transport';
import { queryStringify } from '../utils';

const apiUrl = 'http://localhost';

const fetch = new HttpTransport(apiUrl, '');
const data = { first_name: 'Vasiliy', second_name: 'Pupkin' };

describe('test HttpTransport module', () => {
  test('must be defined', () => {
    expect(HttpTransport).toBeDefined();
  });

  test('empty GET request', async () => {
    nock(apiUrl)
      .get('/')
      .reply(200, (uri) => uri);

    expect(await fetch.get('/').then((r) => r.response)).toEqual('/');
  });

  test('mirror GET request', async () => {
    const getQueryString = `/?${queryStringify(data)}`;
    nock(apiUrl)
      .get(getQueryString)
      .reply(200, (uri) => uri);

    expect(await fetch.get('/', { data }).then((r) => r.response)).toEqual(getQueryString);
  });

  test('mirror POST request', async () => {
    nock(apiUrl)
      .post('/', data)
      .reply(200, (uri, requestBody) => requestBody);

    expect(await fetch.post('/', { data }).then((r) => JSON.parse(r.response))).toEqual(data);
  });

  test('mirror POST request with headers', async () => {
    const headers = {
      'Content-type': 'application/json',
    };
    nock(apiUrl)
      .post('/', data)
      .reply(200, (uri, requestBody) => requestBody);

    expect(await fetch.post('/', { data, headers }).then((r) => JSON.parse(r.response))).toEqual(data);
  });

  test('mirror POST request with empty formData', async () => {
    const formData = new FormData();
    nock(apiUrl)
      .post('/')
      .reply(200, (uri, requestBody) => requestBody);

    expect(await fetch.post('/', { data: formData }).then((r) => r.response)).toEqual('');
  });

  test('mirror PUT request', async () => {
    nock(apiUrl)
      .put('/', data)
      .reply(200, (uri, requestBody) => requestBody);

    expect(await fetch.put('/', { data }).then((r) => JSON.parse(r.response))).toEqual(data);
  });

  test('mirror DELETE request', async () => {
    nock(apiUrl)
      .delete('/', data)
      .reply(200, (uri, requestBody) => requestBody);

    expect(await fetch.delete('/', { data }).then((r) => JSON.parse(r.response))).toEqual(data);
  });
});
