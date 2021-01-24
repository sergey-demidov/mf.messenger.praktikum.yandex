// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest,
} from '@jest/globals';
import nock from 'nock';
import userController from '../user';
import { ApiBaseUrl, CONST } from '../../lib/const';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';

eventBus.on(CONST.update, jest.fn);
eventBus.on(CONST.hashchange, jest.fn);

const userId = 777;

jest.mock('../../lib/const', () => ({
  get ApiBaseUrl() {
    return 'http://localhost/api/v2';
  },
  get CONST() {
    return {
      undefined: 'undefined',
      string: 'string',
      hashchange: 'hashchange',
      userDataChange: 'userDataChange',
    };
  },
}));

describe('test userController module', () => {
  test('must be defined', () => {
    expect(userController).toBeDefined();
  });

  test('findUsers(login) must get chat users', async () => {
    nock(ApiBaseUrl)
      .post('/user/search')
      .reply(200, []);

    expect(await userController.findUsers('')).toEqual([]);
  });

  test('findUsers(login) must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .post('/user/search')
      .reply(400);

    await expect(userController.findUsers('')).rejects.toThrow(Error);
  });

  test('changePassword() must works', async () => {
    nock(ApiBaseUrl)
      .put('/user/password')
      .reply(200, '');

    expect(await userController.changePassword({})).toEqual('');
  });

  test('changePassword() must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .put('/user/password')
      .reply(400);

    await expect(userController.changePassword({})).rejects.toThrow(Error);
  });

  test('saveProfile() must works', async () => {
    nock(ApiBaseUrl)
      .put('/user/profile')
      .reply(200, '');
    const userDataChange = jest.fn();
    eventBus.on(CONST.userDataChange, userDataChange);
    await userController.saveProfile({});
    expect(userDataChange).toHaveBeenCalled();
  });

  test('saveProfile() must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .put('/user/profile')
      .reply(400);

    await expect(userController.saveProfile({})).rejects.toThrow(Error);
  });

  test('saveProfileAvatar(FormData) must works', async () => {
    nock(ApiBaseUrl)
      .put('/user/profile/avatar')
      .reply(200, '');

    expect(await userController.saveProfileAvatar(new FormData())).toEqual('');
  });

  test('saveProfileAvatar(FormData) must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .put('/user/profile/avatar')
      .reply(400);

    await expect(userController.saveProfileAvatar(new FormData())).rejects.toThrow(Error);
  });

  test('getUserInfo(userId) must works', async () => {
    const response = { id: userId, login: 'user' };
    nock(ApiBaseUrl)
      .get(`/user/${userId}`)
      .reply(200, response);

    await expect(userController.getUserInfo(userId)).resolves.toEqual(response);
    expect(store.state.users[userId]).toEqual(response);
  });

  test('getUserInfo(userId) must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .get(`/user/${userId}`)
      .reply(400);

    await expect(userController.getUserInfo(userId)).rejects.toThrow(Error);
  });
});
