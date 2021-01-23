/* eslint-disable no-console */

import { CONST, WsBaseUrl } from '../lib/const';
import { isJsonString } from '../lib/utils';
import eventBus from '../lib/event-bus';
import toaster from '../lib/toaster';
import userController from './user';
import store, { user } from '../lib/store';

class MessagesController {
  protected socket: WebSocket;

  chatId: number;

  protected pinger: number;

  constructor(userId: number, chatId: number, tokenValue: string) {
    this.socket = new WebSocket(
      `${WsBaseUrl}/${userId}/${chatId}/${tokenValue}`,
    );

    this.chatId = chatId;

    this.pinger = window.setInterval(() => {
      this.ping();
    }, 60 * 1000);

    this.socket.onopen = (() => {
      if (window.debug) console.log('WebSocket: connected');
      this.send('get old', '0');
    });

    this.socket.onmessage = async (event) => {
      let data = { type: '', content: '' };
      if (!isJsonString(event.data)) {
        if (window.debug) console.log('WebSocket: unexpected message');
        if (window.debug) console.dir(event);
        return;
      }
      data = JSON.parse(event.data);
      if (data.type === 'error') {
        if (data.content === 'Wrong message type') { // pong
          this.pong();
          return;
        }
        if (window.debug) console.log('WebSocket: unexpected error');
        if (window.debug) console.dir(data);
        return;
      }
      if (data.type === 'user connected') {
        if (!store.state.users[data.content]) {
          await userController.getUserInfo(parseInt(data.content, 10));
        }
        const u = <typeof user>store.state.users[data.content];
        const userName = u.display_name || u.first_name || u.login;
        toaster.toast(`user ${userName} connected`);

        eventBus.emit(CONST.userConnected);
        return;
      }
      if (Array.isArray(data)) {
        eventBus.emit(CONST.messagesBulkReceived, JSON.stringify(data));
      } else {
        eventBus.emit(CONST.messageReceived, JSON.stringify(data));
      }
    };

    this.socket.onclose = (event) => {
      if (!event.wasClean && window.debug) {
        console.warn('WebSocket: unexpected disconnect');
      }
      eventBus.emit(CONST.websocketDisconnected);
      if (window.debug) console.log(`Code: ${event.code}, Reason: ${event.reason}`);
    };
  }

  send(type: string, content: string): void {
    this.socket.send(
      JSON.stringify({
        type,
        content,
      }),
    );
  }

  close(): void {
    clearInterval(this.pinger);
    this.socket.close();
  }

  ping(): void {
    this.send('ping', 'ping');
  }

  pong():void {
    if (window.debug) console.dir('pong');
  }
}

export default MessagesController;
