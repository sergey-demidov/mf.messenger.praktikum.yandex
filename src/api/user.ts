/* eslint-disable class-methods-use-this */
import HttpTransport, { HttpDataType } from '../lib/http-transport';

const headers = {
  'Content-type': 'application/json',
};

class UserAPI {
  fetch: HttpTransport;

  constructor() {
    this.fetch = new HttpTransport('/user');
  }

  saveProfile(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.put('/profile', { data, headers });
  }

  saveProfileAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.fetch.put('/profile/avatar', { data });
  }

  changePassword(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.put('/password', { data, headers });
  }
}

export default UserAPI;
