/* eslint-disable class-methods-use-this */
import HttpTransport, { HttpDataType } from '../lib/http-transport';
import { ApiBaseUrl } from '../lib/const';

const headers = {
  'Content-type': 'application/json',
};

class ChatsApi {
  fetch: HttpTransport;

  constructor() {
    this.fetch = new HttpTransport(ApiBaseUrl, '/chats');
  }

  getChats(): Promise<XMLHttpRequest> {
    return this.fetch.get('', {});
  }

  createChat(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.post('', { data, headers });
  }

  saveChatAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.fetch.put('/avatar', { data });
  }

  deleteChat(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.delete('', { data, headers });
  }

  getChatUsers(chatId: number): Promise<XMLHttpRequest> {
    return this.fetch.get(`/${chatId}/users`, {});
  }

  addUsers(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.put('/users', { data, headers });
  }

  deleteUsers(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.delete('/users', { data, headers });
  }
}

export default ChatsApi;
