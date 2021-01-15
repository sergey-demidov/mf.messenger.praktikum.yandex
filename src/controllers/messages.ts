/* eslint-disable no-console */

import { CONST, WsBaseUrl } from '../lib/const';
import { isJsonString } from '../lib/utils';
import eventBus from '../lib/event-bus';

class MessagesController {
  private socket: WebSocket;

  chatId: number;

  protected pinger: number;

  constructor(userId: number, chatId: number, tokenValue: string) {
    this.socket = new WebSocket(
      `${WsBaseUrl}/${userId}/${chatId}/${tokenValue}`,
    );

    this.chatId = chatId;

    this.pinger = window.setInterval(() => {
      this.ping();
    }, 5 * 1000);

    this.socket.onopen = (() => {
      if (window.debug) console.log('WebSocket: connected');
      this.send('get old', '0');
    });

    this.socket.onmessage = (event) => {
      let data = { type: '', content: '' };
      if (!isJsonString(event.data)) {
        if (window.debug) console.log('WebSocket: unexpected message');
        if (window.debug) console.dir(event);
        return;
      }
      data = JSON.parse(event.data);
      if (data.type === 'error') {
        if (data.content === 'Wrong message type') return; // pong
        if (window.debug) console.log('WebSocket: unexpected error');
        if (window.debug) console.dir(data);
        return;
      }
      if (Array.isArray(data)) {
        eventBus.emit(CONST.messagesBulkReceived, JSON.stringify(data));
      } else {
        eventBus.emit(CONST.messageReceived, JSON.stringify(data));
      }
    };

    this.socket.onclose = (event) => {
      if (event.wasClean) {
        if (window.debug) console.log('WebSocket: disconnected');
      } else {
        console.warn('WebSocket: unexpected disconnect');
        eventBus.emit(CONST.websocketDisconnected);
      }
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
}

export default MessagesController;
