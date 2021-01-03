import eventBus from './event-bus';
import store from './store';
import { CONST, isJsonString } from './utils';
import { backendUrl } from './http-transport';
import AuthAPI from '../api/auth';

const authAPI = new AuthAPI();

class Auth {
  eventBus = eventBus

  private static instance: Auth;

  constructor() {
    if (Auth.instance) {
      return Auth.instance;
    }
    Auth.instance = this;
  }

  isUserLoggedIn(): boolean {
    return !!store.state.currentUser.login;
  }

  fillUserState(): Promise<boolean> {
    if (store.state.currentUser.login) {
      return Promise.resolve(true);
    }
    return authAPI.getUser()
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('unauthorized');
      })
      .then((u) => {
        const user = u;
        user.avatar = backendUrl + user.avatar;
        Object.assign(store.state.currentUser, user);
        this.eventBus.emit(CONST.update);
        return true;
      }).catch(() => false);
  }

  clearUserState(): void {
    store.state.currentUser.login = '';
  }
}

const auth = new Auth();

export default auth;
