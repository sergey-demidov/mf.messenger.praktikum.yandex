// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import WS from 'jest-websocket-mock';
import MessagesController from '../messages';
import { CONST, WsBaseUrl } from '../../lib/const';
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
    store.state.users[userId] = {
      display_name: 'member',
    };
    const userConnected = { type: 'user connected', content: userId };
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
});

describe('test MessagesController module timer', () => {
  test('must ping server every minute', async () => {
    jest.useFakeTimers();
    client = new MessagesController(userId, chatId, token);
    client.ping = jest.fn();
    jest.advanceTimersByTime(61 * 1000);
    expect(client.ping).toHaveBeenCalledTimes(1);
  });
});
