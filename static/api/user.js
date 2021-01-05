/* eslint-disable class-methods-use-this */
import HttpTransport from "../lib/http-transport.js";
import { ApiBaseUrl } from "../lib/const.js";
const headers = {
    'Content-type': 'application/json',
};
class UserApi {
    constructor() {
        this.fetch = new HttpTransport(ApiBaseUrl, '/user');
    }
    saveProfile(data) {
        return this.fetch.put('/profile', { data, headers });
    }
    saveProfileAvatar(data) {
        return this.fetch.put('/profile/avatar', { data });
    }
    changePassword(data) {
        return this.fetch.put('/password', { data, headers });
    }
    findUsers(data) {
        return this.fetch.post('/search', { data, headers });
    }
}
export default UserApi;
//# sourceMappingURL=user.js.map