import eventBus from "../lib/event-bus.js";
// import store from '../lib/store';
// import { isJsonString } from '../lib/utils';
// import AuthApi from '../api/auth';
// import { backendUrl, CONST } from '../lib/const';
import UserApi from "../api/user.js";
import { isJsonString } from "../lib/utils.js";
import toaster from "../lib/toaster.js";
const userApi = new UserApi();
class UserController {
    constructor() {
        this.eventBus = eventBus;
        if (UserController.instance) {
            return UserController.instance;
        }
        UserController.instance = this;
    }
    findUsers(login) {
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
    changePassword(res) {
        return userApi.changePassword(res)
            .then((response) => {
            if (response.status === 200) {
                return response;
            }
            throw new Error(response.response);
        })
            .catch((error) => {
            toaster.bakeError(error);
        });
    }
    saveProfile(res) {
        return userApi.saveProfile(res)
            .then((response) => {
            if (response.status === 200) {
                eventBus.emit('userDataChange');
                return;
            }
            throw new Error(response.response);
        })
            .catch((error) => {
            toaster.bakeError(error);
        });
    }
    saveProfileAvatar(formData) {
        return userApi.saveProfileAvatar(formData)
            .then((response) => {
            if (response.status === 200) {
                return response;
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
//# sourceMappingURL=user.js.map