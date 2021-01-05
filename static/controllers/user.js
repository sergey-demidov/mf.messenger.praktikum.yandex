import eventBus from "../lib/event-bus.js";
import UserApi from "../api/user.js";
import { isJsonString } from "../lib/utils.js";
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
        });
    }
    changePassword(res) {
        return userApi.changePassword(res)
            .then((response) => {
            if (response.status === 200) {
                return response;
            }
            throw new Error(response.response);
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
        });
    }
    saveProfileAvatar(formData) {
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
//# sourceMappingURL=user.js.map