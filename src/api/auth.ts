/* eslint-disable class-methods-use-this */
import HttpTransport, { DataType } from '../lib/http-transport';

const headers = {
  'Content-type': 'application/json',
};

class AuthAPI {
  fetch: HttpTransport;

  constructor() {
    this.fetch = new HttpTransport('/auth');
  }

  singUp(userData: DataType) {
    return this.fetch.post('/signup', { data: userData, headers });
  }

  signIn(userData: DataType) {
    return this.fetch.post('/signin', { data: userData, headers });
  }

  getUser() {
    return this.fetch.get('/user');
  }

  logOut() {
    return this.fetch.post('/logout', { headers });
  }
}

export default AuthAPI;
