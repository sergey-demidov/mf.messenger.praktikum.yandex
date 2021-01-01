/* eslint-disable class-methods-use-this */
import HttpTransport, { HttpDataType } from '../lib/http-transport';

const headers = {
  'Content-type': 'application/json',
};

class ChatsAPI {
  fetch: HttpTransport;

  constructor() {
    this.fetch = new HttpTransport('/chats');
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
}

export default ChatsAPI;
