import eventBus from '../lib/event-bus';
import UserApi from '../api/user';
import { isJsonString } from '../lib/utils';
import { HttpDataType } from '../lib/http-transport';

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
      });
  }

  changePassword(res: HttpDataType) {
    return userApi.changePassword(res)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        throw new Error(response.response);
      });
  }

  saveProfile(res: HttpDataType) {
    return userApi.saveProfile(res as HttpDataType)
      .then((response) => {
        if (response.status === 200) {
          eventBus.emit('userDataChange');
          return;
        }
        throw new Error(response.response);
      });
  }

  saveProfileAvatar(formData: FormData) {
    return userApi.saveProfileAvatar(formData)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        throw new Error(response.response);
      });
  }
}

const userController = new UserController();

export default userController;
