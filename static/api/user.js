/* eslint-disable class-methods-use-this */
import HttpTransport from "../lib/http-transport.js";
const headers = {
    'Content-type': 'application/json',
};
class UserAPI {
    constructor() {
        this.fetch = new HttpTransport('/user');
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
export default UserAPI;
//# sourceMappingURL=user.js.map