import eventBus from '../lib/event-bus';
// import store from '../lib/store';
// import { isJsonString } from '../lib/utils';
// import AuthApi from '../api/auth';
// import { backendUrl, CONST } from '../lib/const';
import UserApi from '../api/user';
import { isJsonString } from '../lib/utils';
import toaster from '../lib/toaster';

const userApi = new UserApi();

class UserController {
  eventBus = eventBus

  private static instance: UserController;

  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }
    UserController.instance = this;
  }

  findUsers(login: string) {
    return userApi.findUsers({ login })
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error(response.response);
      })
      .catch((error) => {
        toaster.bakeError(error);
      });
  }
}

const userController = new UserController();

export default userController;
