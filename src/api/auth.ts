/* eslint-disable class-methods-use-this */
import HttpTransport, { HttpDataType } from '../lib/http-transport';

const headers = {
  'Content-type': 'application/json',
  // Origin: 'https://localhost:3443',
};

class AuthAPI {
  fetch: HttpTransport;

  constructor() {
    this.fetch = new HttpTransport('/auth');
  }

  signUp(userData: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.post('/signup', { data: userData, headers });
  }

  signIn(userData: HttpDataType): Promise<XMLHttpRequest> {
    return this.fetch.post('/signin', { data: userData, headers });
  }

  getUser(): Promise<XMLHttpRequest> {
    return this.fetch.get('/user', {});
  }

  logOut(): Promise<XMLHttpRequest> {
    return this.fetch.post('/logout', { headers });
  }
}

export default AuthAPI;
