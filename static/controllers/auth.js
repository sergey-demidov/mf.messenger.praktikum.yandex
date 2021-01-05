import eventBus from "../lib/event-bus.js";
import store from "../lib/store.js";
import { isJsonString } from "../lib/utils.js";
import AuthApi from "../api/auth.js";
import { backendUrl, CONST } from "../lib/const.js";
import toaster from "../lib/toaster.js";
const authApi = new AuthApi();
class AuthController {
    constructor() {
        this.eventBus = eventBus;
        if (AuthController.instance) {
            return AuthController.instance;
        }
        AuthController.instance = this;
    }
    isUserLoggedIn() {
        return !!store.state.currentUser.login;
    }
    fillUserState() {
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
        }).catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            return false;
        });
    }
    clearUserState() {
        store.state.currentUser.login = '';
        store.state.currentUser.id = 0;
    }
    signIn(res) {
        return authApi.signIn(res)
            .then((response) => {
            if (response.status === 200) {
                return this.fillUserState();
            }
            throw new Error(response.response);
        })
            .catch((error) => {
            if (error.message && error.message === 'user already in system') {
                window.router.go('/#/chat');
            }
            else {
                toaster.bakeError(error);
            }
        });
    }
    signUp(res) {
        return authApi.signUp(res)
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
const authController = new AuthController();
export default authController;
//# sourceMappingURL=auth.js.map