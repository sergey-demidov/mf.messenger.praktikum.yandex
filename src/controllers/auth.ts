import eventBus from '../lib/event-bus';
import store from '../lib/store';
import { isJsonString } from '../lib/utils';
import AuthApi from '../api/auth';
import { backendUrl, CONST } from '../lib/const';
import { HttpDataType } from '../lib/http-transport';

const authApi = new AuthApi();

class AuthController {
  eventBus = eventBus

  private static instance: AuthController;

  constructor() {
    if (AuthController.instance) {
      return AuthController.instance;
    }
    AuthController.instance = this;
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
  }

  signIn(res: HttpDataType) {
    return authApi.signIn(res)
      .then((response) => {
        if (response.status === 200) {
          return this.fillUserState();
        }
        throw new Error(response.response);
      });
  }

  signUp(res: HttpDataType) {
    return authApi.signUp(res)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        throw new Error(response.response);
      });
  }
}

const authController = new AuthController();

export default authController;
