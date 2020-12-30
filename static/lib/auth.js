import eventBus from "./event-bus.js";
import store from "./store.js";
import { CONST, isJsonString } from "./utils.js";
import { baseUrl } from "./http-transport.js";
import AuthAPI from "../api/auth.js";
const authAPI = new AuthAPI();
class Auth {
    constructor() {
        this.eventBus = eventBus;
        if (Auth.instance) {
            return Auth.instance;
        }
        Auth.instance = this;
    }
    // eslint-disable-next-line class-methods-use-this
    isUserLoggedIn() {
        return !!store.state.currentUser.login;
    }
    fillUserState() {
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
            user.avatar = baseUrl + user.avatar;
            Object.assign(store.state.currentUser, user);
            this.eventBus.emit(CONST.update);
            return true;
        }).catch(() => false);
    }
    clearUserState() {
        store.state.currentUser.login = '';
    }
}
const auth = new Auth();
export default auth;
//# sourceMappingURL=auth.js.map