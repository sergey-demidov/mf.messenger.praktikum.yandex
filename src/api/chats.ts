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

  // saveProfileAvatar(data: FormData): Promise<XMLHttpRequest> {
  //   return this.fetch.put('/profile/avatar', { data });
  // }
  //
  // changePassword(data: HttpDataType): Promise<XMLHttpRequest> {
  //   return this.fetch.put('/password', { data, headers });
  // }
}

export default ChatsAPI;
