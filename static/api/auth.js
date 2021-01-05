/* eslint-disable class-methods-use-this */
import HttpTransport from "../lib/http-transport.js";
import { ApiBaseUrl } from "../lib/const.js";
const headers = {
    'Content-type': 'application/json',
};
class AuthApi {
    constructor() {
        this.fetch = new HttpTransport(ApiBaseUrl, '/auth');
    }
    signUp(userData) {
        return this.fetch.post('/signup', { data: userData, headers });
    }
    signIn(userData) {
        return this.fetch.post('/signin', { data: userData, headers });
    }
    getUser() {
        return this.fetch.get('/user', {});
    }
    logOut() {
        return this.fetch.post('/logout', { headers });
    }
}
export default AuthApi;
//# sourceMappingURL=auth.js.map