// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach,
} from '@jest/globals';
import nock from 'nock';
import chatsController from '../chats';
import { ApiBaseUrl, CONST } from '../../lib/const';
import store from '../../lib/store';
import eventBus from '../../lib/event-bus';
import mocks from '../../lib/mock-utils';
import toaster from '../../lib/toaster';

eventBus.on(CONST.update, jest.fn);
eventBus.on(CONST.hashchange, jest.fn);

jest.mock('../../lib/const', () => ({
  get ApiBaseUrl() {
    return 'http://localhost/api/v2';
  },
  get CONST() {
    return {
      undefined: 'undefined',
      string: 'string',
      hashchange: 'hashchange',
    };
  },
}));

const chatId = 777;
const userId = 999;
const chatToCreate = {
  title: 'string',
};
const chatToDelete = {
  chatId,
};
const ok = 'Ok';

describe('test chatsController module', () => {
  beforeEach(() => {
    store.state.currentChat.id = 0;
    store.state.currentMember.id = 0;
  });

  test('is defined', () => {
    expect(chatsController).toBeDefined();
  });

  test('getChatUsers(chatId) must get chat users', async () => {
    nock(ApiBaseUrl)
      .get(`/chats/${chatId}/users`)
      .reply(200, { id: chatId });

    expect(await chatsController.getChatUsers(chatId)).toEqual({ id: chatId });
  });

  test('getChatUsers() without params must get chat users from current chat id', async () => {
    store.state.currentChat.id = chatId;

    nock(ApiBaseUrl)
      .get(`/chats/${chatId}/users`)
      .reply(200, { id: chatId });

    expect(await chatsController.getChatUsers()).toEqual({ id: chatId });
  });

  test('getChatUsers(chatId) must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .get(`/chats/${chatId}/users`)
      .reply(400);

    await expect(chatsController.getChatUsers(chatId)).rejects.toThrow(Error);
  });

  test('getChats() must get chats', async () => {
    nock(ApiBaseUrl)
      .get('/chats')
      .reply(200, { id: chatId });

    expect(await chatsController.getChats()).toEqual({ id: chatId });
  });

  test('getChats() must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .get('/chats')
      .reply(400);

    await expect(chatsController.getChats()).rejects.toThrow(Error);
  });

  test('deleteUsers() must delete current user from current chat', async () => {
    store.state.currentChat.id = chatId;
    store.state.currentMember.id = 777;
    nock(ApiBaseUrl)
      .delete('/chats/users')
      .reply(200, ok);
    await chatsController.deleteCurrentMember();
    await mocks.sleep(100);

    expect(store.state.currentMember.id).toEqual(0);
  });

  test('deleteUsers() must throw error if response code not equal 200', async () => {
    store.state.currentChat.id = chatId;
    store.state.currentMember.id = 777;
    toaster.bakeError = jest.fn();
    nock(ApiBaseUrl)
      .delete('/chats/users')
      .reply(400);
    await chatsController.deleteCurrentMember();
    await mocks.sleep(100);

    expect(toaster.bakeError).toHaveBeenCalled();
    expect(toaster.bakeError.mock.calls[0][0]).toEqual(new Error('User deletion failed'));
  });

  test('addUser(userId) must works', async () => {
    store.state.currentChat.id = chatId;
    nock(ApiBaseUrl)
      .put('/chats/users')
      .reply(200, ok);

    expect(await chatsController.addUser(userId)).toEqual(ok);
  });

  test('addUser(userId) must throw error if response code not equal 200', async () => {
    store.state.currentChat.id = chatId;
    nock(ApiBaseUrl)
      .put('/chats/users')
      .reply(400);

    await expect(chatsController.addUser(userId)).rejects.toThrow(Error);
  });

  test('createChat() must works', async () => {
    nock(ApiBaseUrl)
      .post('/chats')
      .reply(200, ok);

    expect(await chatsController.createChat(chatToCreate)).toEqual(ok);
  });

  test('createChat() must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .post('/chats')
      .reply(400);

    await expect(chatsController.createChat(chatToCreate)).rejects.toThrow(Error);
  });

  test('deleteChat() must works', async () => {
    nock(ApiBaseUrl)
      .delete('/chats')
      .reply(200, ok);

    expect(await chatsController.deleteChat(chatToDelete)).toEqual(ok);
  });

  test('deleteChat() must set values', async () => {
    store.state.currentMember.id = userId;
    store.state.currentChat.id = chatId;
    nock(ApiBaseUrl)
      .delete('/chats')
      .reply(200, ok);

    await chatsController.deleteChat(chatToDelete);

    expect(store.state.currentChat.id).toEqual(0);
    expect(store.state.currentMember.id).toEqual(0);
  });

  test('deleteChat() must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .delete('/chats')
      .reply(400);

    await expect(chatsController.deleteChat(chatToDelete)).rejects.toThrow(Error);
  });

  test('saveChatAvatar() must works', async () => {
    nock(ApiBaseUrl)
      .put('/chats/avatar')
      .reply(200, ok);

    expect(await chatsController.saveChatAvatar(new FormData())).toEqual(ok);
  });

  test('saveChatAvatar() must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .put('/chats/avatar')
      .reply(400);

    await expect(chatsController.saveChatAvatar(new FormData())).rejects.toThrow(Error);
  });

  test('getChatToken() must works', async () => {
    store.state.currentChat.id = chatId;
    const token = 'AnyChatToken';
    nock(ApiBaseUrl)
      .post(`/chats/token/${chatId}`)
      .reply(200, { token });

    expect(await chatsController.getChatToken()).toEqual({ token });
  });

  test('getChatToken() must throw error if response code not equal 200', async () => {
    store.state.currentChat.id = chatId;
    nock(ApiBaseUrl)
      .post(`/chats/token/${chatId}`)
      .reply(400);

    await expect(chatsController.getChatToken()).rejects.toThrow(Error);
  });

  test('getUnreadMessagesCount(chatId) must works', async () => {
    const unreadResponse = {
      unread_count: 0,
    };
    nock(ApiBaseUrl)
      .get(`/chats/new/${chatId}`)
      .reply(200, unreadResponse);

    expect(await chatsController.getUnreadMessagesCount(chatId)).toEqual(unreadResponse);
  });

  test('getUnreadMessagesCount(chatId) must throw error if response code not equal 200', async () => {
    nock(ApiBaseUrl)
      .get(`/chats/new/${chatId}`)
      .reply(400);

    await expect(chatsController.getUnreadMessagesCount(chatId)).rejects.toThrow(Error);
  });
});
