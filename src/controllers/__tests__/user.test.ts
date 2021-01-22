// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach,
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
  test('is defined', () => {
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
    // store.state.users[userId] = {};
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

  // test('getChatUsers(chatId) must get chat users', async () => {
  //   nock(ApiBaseUrl)
  //     .get(`/chats/${chatId}/users`)
  //     .reply(200, { id: chatId });
  //
  //   expect(await userController.getChatUsers(chatId)).toEqual({ id: chatId });
  // });
  //
  // test('getChatUsers() without params must get chat users from current chat id', async () => {
  //   store.state.currentChat.id = chatId;
  //
  //   nock(ApiBaseUrl)
  //     .get(`/chats/${chatId}/users`)
  //     .reply(200, { id: chatId });
  //
  //   expect(await userController.getChatUsers()).toEqual({ id: chatId });
  // });
  //
  // test('getChatUsers(chatId) must throw error if response code not equal 200', async () => {
  //   nock(ApiBaseUrl)
  //     .get(`/chats/${chatId}/users`)
  //     .reply(400);
  //
  //   await expect(userController.getChatUsers(chatId)).rejects.toThrow(Error);
  // });
  //
  // test('getChats() must get chats', async () => {
  //   nock(ApiBaseUrl)
  //     .get('/chats')
  //     .reply(200, { id: chatId });
  //
  //   expect(await userController.getChats()).toEqual({ id: chatId });
  // });
  //
  // test('getChats() must throw error if response code not equal 200', async () => {
  //   nock(ApiBaseUrl)
  //     .get('/chats')
  //     .reply(400);
  //
  //   await expect(userController.getChats()).rejects.toThrow(Error);
  // });
  //
  // test('deleteUsers() must delete current user from current chat', async () => {
  //   store.state.currentChat.id = chatId;
  //   store.state.currentMember.id = 777;
  //   nock(ApiBaseUrl)
  //     .delete('/chats/users')
  //     .reply(200, ok);
  //   await userController.deleteCurrentMember();
  //   await mocks.sleep(100);
  //
  //   expect(store.state.currentMember.id).toEqual(0);
  // });
  //
  // test('deleteUsers() must throw error if response code not equal 200', async () => {
  //   store.state.currentChat.id = chatId;
  //   store.state.currentMember.id = 777;
  //   toaster.bakeError = jest.fn();
  //   nock(ApiBaseUrl)
  //     .delete('/chats/users')
  //     .reply(400);
  //   await userController.deleteCurrentMember();
  //   await mocks.sleep(100);
  //
  //   expect(toaster.bakeError).toHaveBeenCalled();
  //   expect(toaster.bakeError.mock.calls[0][0]).toEqual(new Error('User deletion failed'));
  // });
  //
  // test('addUser(userId) must works', async () => {
  //   store.state.currentChat.id = chatId;
  //   nock(ApiBaseUrl)
  //     .put('/chats/users')
  //     .reply(200, ok);
  //
  //   expect(await userController.addUser(userId)).toEqual(ok);
  // });
  //
  // test('addUser(userId) must throw error if response code not equal 200', async () => {
  //   store.state.currentChat.id = chatId;
  //   nock(ApiBaseUrl)
  //     .put('/chats/users')
  //     .reply(400);
  //
  //   await expect(userController.addUser(userId)).rejects.toThrow(Error);
  // });
  //
  // test('createChat() must works', async () => {
  //   nock(ApiBaseUrl)
  //     .post('/chats')
  //     .reply(200, ok);
  //
  //   expect(await userController.createChat(chatToCreate)).toEqual(ok);
  // });
  //
  // test('createChat() must throw error if response code not equal 200', async () => {
  //   nock(ApiBaseUrl)
  //     .post('/chats')
  //     .reply(400);
  //
  //   await expect(userController.createChat(chatToCreate)).rejects.toThrow(Error);
  // });
  //
  // test('deleteChat() must works', async () => {
  //   nock(ApiBaseUrl)
  //     .delete('/chats')
  //     .reply(200, ok);
  //
  //   expect(await userController.deleteChat(chatToDelete)).toEqual(ok);
  // });
  //
  // test('deleteChat() must set values', async () => {
  //   store.state.currentMember.id = userId;
  //   store.state.currentChat.id = chatId;
  //   nock(ApiBaseUrl)
  //     .delete('/chats')
  //     .reply(200, ok);
  //
  //   await userController.deleteChat(chatToDelete);
  //
  //   expect(store.state.currentChat.id).toEqual(0);
  //   expect(store.state.currentMember.id).toEqual(0);
  // });
  //
  // test('deleteChat() must throw error if response code not equal 200', async () => {
  //   nock(ApiBaseUrl)
  //     .delete('/chats')
  //     .reply(400);
  //
  //   await expect(userController.deleteChat(chatToDelete)).rejects.toThrow(Error);
  // });
  //
  // test('saveChatAvatar() must works', async () => {
  //   nock(ApiBaseUrl)
  //     .put('/chats/avatar')
  //     .reply(200, ok);
  //
  //   expect(await userController.saveChatAvatar(new FormData())).toEqual(ok);
  // });
  //
  // test('saveChatAvatar() must throw error if response code not equal 200', async () => {
  //   nock(ApiBaseUrl)
  //     .put('/chats/avatar')
  //     .reply(400);
  //
  //   await expect(userController.saveChatAvatar(new FormData())).rejects.toThrow(Error);
  // });
  //
  // test('getChatToken() must works', async () => {
  //   store.state.currentChat.id = chatId;
  //   const token = 'AnyChatToken';
  //   nock(ApiBaseUrl)
  //     .post(`/chats/token/${chatId}`)
  //     .reply(200, { token });
  //
  //   expect(await userController.getChatToken()).toEqual({ token });
  // });
  //
  // test('getChatToken() must throw error if response code not equal 200', async () => {
  //   store.state.currentChat.id = chatId;
  //   nock(ApiBaseUrl)
  //     .post(`/chats/token/${chatId}`)
  //     .reply(400);
  //
  //   await expect(userController.getChatToken()).rejects.toThrow(Error);
  // });
  //
  // test('getUnreadMessagesCount(chatId) must works', async () => {
  //   const unreadResponse = {
  //     unread_count: 0,
  //   };
  //   nock(ApiBaseUrl)
  //     .get(`/chats/new/${chatId}`)
  //     .reply(200, unreadResponse);
  //
  //   expect(await userController.getUnreadMessagesCount(chatId)).toEqual(unreadResponse);
  // });
  //
  // test('getUnreadMessagesCount(chatId) must throw error if response code not equal 200', async () => {
  //   nock(ApiBaseUrl)
  //     .get(`/chats/new/${chatId}`)
  //     .reply(400);
  //
  //   await expect(userController.getUnreadMessagesCount(chatId)).rejects.toThrow(Error);
  // });
});
