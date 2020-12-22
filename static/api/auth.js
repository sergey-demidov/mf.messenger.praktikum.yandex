/* eslint-disable class-methods-use-this */
import HttpTransport from "../lib/http-transport.js";
const headers = {
    'Content-type': 'application/json',
};
class AuthAPI {
    constructor() {
        this.fetch = new HttpTransport('/auth');
    }
    singUp(userData) {
        return this.fetch.post('/signup', { data: userData, headers });
    }
    signIn(userData) {
        return this.fetch.post('/signin', { data: userData, headers });
    }
    getUser() {
        return this.fetch.get('/user');
    }
    logOut() {
        return this.fetch.post('/logout', { headers });
    }
}
export default AuthAPI;
//# sourceMappingURL=auth.js.map