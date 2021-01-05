import eventBus from '../lib/event-bus';
import store from '../lib/store';
import { isJsonString } from '../lib/utils';
import AuthApi from '../api/auth';
import { backendUrl, CONST } from '../lib/const';

const authApi = new AuthApi();

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
    return authApi.getUser()
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
    store.state.currentUser.id = 0;
  }
}

const auth = new Auth();

export default auth;
