/* eslint-disable class-methods-use-this */
import HttpTransport, { HttpDataType } from '../lib/http-transport';
import { ApiBaseUrl } from '../lib/const';

const headers = {
  'Content-type': 'application/json',
};

class UserApi {
  fetch: HttpTransport;

  constructor() {
    this.fetch = new HttpTransport(ApiBaseUrl, '/user');
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

  findUsers(data: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.post('/search', { data, headers });
  }
}

export default UserApi;
