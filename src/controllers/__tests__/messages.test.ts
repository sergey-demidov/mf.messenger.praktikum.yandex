// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import WS from 'jest-websocket-mock';
import nock from 'nock';
import { cli } from 'webpack';
import MessagesController from '../messages';
import { ApiBaseUrl, CONST, WsBaseUrl } from '../../lib/const';
import eventBus from '../../lib/event-bus';
import mocks from '../../lib/mock-utils';
import store from '../../lib/store';

eventBus.on(CONST.update, jest.fn);

jest.mock('../../lib/const', () => ({
  get WsBaseUrl() {
    return 'ws://localhost';
  },
  get ApiBaseUrl() {
    return 'http://localhost/api/v2';
  },
  get CONST() {
    return {
      undefined: 'undefined',
      string: 'string',
      messagesBulkReceived: 'messagesBulkReceived',
      messageReceived: 'messageReceived',
      userConnected: 'userConnected',
    };
  },
}));

const userId = 777;
const chatId = 888;
const token = 'TokenString';
let server;
let client;
describe('test MessagesController module', () => {
  beforeEach(() => {
    server = new WS(`${WsBaseUrl}/${userId}/${chatId}/${token}`);
    client = new MessagesController(userId, chatId, token);
  });
  afterEach(() => {
    server.close();
  });

  test('is defined', () => {
    expect(MessagesController).toBeDefined();
  });

  test('must get old messages on connect', async () => {
    const oldMessages = [{
      user_id: userId, chat_id: chatId, content: 'lol', time: '2021-01-21T16:06:59+00:00', id: 1,
    }];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let messages = null;
    eventBus.on(CONST.messagesBulkReceived, (e) => { messages = e; });
    await server.connected;
    await expect(server).toReceiveMessage(JSON.stringify({ type: 'get old', content: '0' }));
    await server.send(JSON.stringify(oldMessages));

    expect(messages).toEqual(JSON.stringify(oldMessages));
  });

  test('must get new message', async () => {
    const newMessage = { type: 'message', content: 'message' };
    let message = null;
    eventBus.on(CONST.messageReceived, (e) => { message = e; });
    await server.connected;
    await server.send(JSON.stringify(newMessage));
    expect(message).toEqual(JSON.stringify(newMessage));
  });

  test('must send ping on socket', async () => {
    const pingResponse = { type: 'error', content: 'Wrong message type' };
    await server.connected;
    client.ping();
    const pong = jest.spyOn(client, 'pong');
    await server.send(JSON.stringify(pingResponse));
    expect(pong).toBeCalled();
  });

  test('must notify if member connected', async () => {
    store.state.users[777] = {
      display_name: 'member',
    };
    const userConnected = { type: 'user connected', content: 777 };
    const connected = jest.fn();
    eventBus.on(CONST.userConnected, () => { connected(); });
    await server.connected;
    await server.send(JSON.stringify(userConnected));
    expect(connected).toHaveBeenCalled();
  });

  test('must close socket', async () => {
    await server.connected;
    await client.close();
    await mocks.sleep(100);
    expect(client.socket.readyState).toEqual(WebSocket.CLOSED);
  });

  // test('must set store variable', async () => {
  //   nock(ApiBaseUrl)
  //     .get('/auth/user')
  //     .reply(200, { id: 777, login: 'user' });
  //   expect(await MessagesController.isUserLoggedIn()).toBeFalsy();
  //
  //   expect(await MessagesController.fillUserState()).toBeTruthy();
  //   expect(await MessagesController.fillUserState()).toBeTruthy();
  //
  //   expect(MessagesController.isUserLoggedIn()).toBeTruthy();
  //   expect(store.state.currentUser.id).toEqual(777);
  //   expect(store.state.currentUser.login).toEqual('user');
  // });
  //
  // test('must return false if unauthorized', async () => {
  //   nock(ApiBaseUrl)
  //     .get('/auth/user')
  //     .reply(401);
  //   expect(await MessagesController.isUserLoggedIn()).toBeFalsy();
  //   expect(await MessagesController.fillUserState()).toBeFalsy();
  // });
  //
  // test('must sign in and fill user state', async () => {
  //   nock(ApiBaseUrl)
  //     .get('/auth/user')
  //     .reply(200, { id: 777, login: 'user' });
  //
  //   nock(ApiBaseUrl)
  //     .post('/auth/signin')
  //     .reply(200, { id: 777, login: 'user' });
  //
  //   expect(await MessagesController.isUserLoggedIn()).toBeFalsy();
  //   expect(await MessagesController.signIn({})).toBeTruthy();
  //   expect(MessagesController.isUserLoggedIn()).toBeTruthy();
  //   expect(store.state.currentUser.id).toEqual(777);
  //   expect(store.state.currentUser.login).toEqual('user');
  // });
  //
  // test('must throw error if not sign In', async () => {
  //   nock(ApiBaseUrl)
  //     .post('/auth/signin')
  //     .reply(401);
  //
  //   expect(await MessagesController.isUserLoggedIn()).toBeFalsy();
  //   await expect(MessagesController.signIn({})).rejects.toThrow(Error);
  // });
  //
  // test('must clear user state', async () => {
  //   store.state.currentUser.id = 666;
  //   store.state.currentUser.login = 'XXX';
  //   expect(MessagesController.isUserLoggedIn()).toBeTruthy();
  //
  //   MessagesController.clearUserState();
  //
  //   expect(store.state.currentUser.id).toEqual(0);
  //   expect(store.state.currentUser.login).toEqual('');
  //   expect(MessagesController.isUserLoggedIn()).toBeFalsy();
  // });
  //
  // test('must sign Up', async () => {
  //   const response = { id: 777 };
  //   nock(ApiBaseUrl)
  //     .post('/auth/signup')
  //     .reply(200, response);
  //
  //   expect(await MessagesController.signUp({})).toEqual(JSON.stringify(response));
  // });
  //
  // test('must throw error if not sign Up', async () => {
  //   nock(ApiBaseUrl)
  //     .post('/auth/signup')
  //     .reply(400);
  //
  //   await expect(MessagesController.signUp({})).rejects.toThrow(Error);
  // });
  //
  // test('must log out', async () => {
  //   nock(ApiBaseUrl)
  //     .post('/auth/logout')
  //     .reply(200);
  //
  //   await expect(MessagesController.logOut({})).resolves.toBeTruthy();
  // });
});
