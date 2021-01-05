/* eslint-disable class-methods-use-this */
import HttpTransport from "../lib/http-transport.js";
import { ApiBaseUrl } from "../lib/const.js";
const headers = {
    'Content-type': 'application/json',
};
class ChatsApi {
    constructor() {
        this.fetch = new HttpTransport(ApiBaseUrl, '/chats');
    }
    getChats() {
        return this.fetch.get('', {});
    }
    createChat(data) {
        return this.fetch.post('', { data, headers });
    }
    saveChatAvatar(data) {
        return this.fetch.put('/avatar', { data });
    }
    deleteChat(data) {
        return this.fetch.delete('', { data, headers });
    }
    getChatUsers(chatId) {
        return this.fetch.get(`/${chatId}/users`, {});
    }
    addUsers(data) {
        return this.fetch.put('/users', { data, headers });
    }
    deleteUsers(data) {
        return this.fetch.delete('/users', { data, headers });
    }
}
export default ChatsApi;
//# sourceMappingURL=chats.js.map