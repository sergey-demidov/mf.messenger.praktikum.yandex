/* eslint-disable class-methods-use-this */
import HttpTransport from "../lib/http-transport.js";
const headers = {
    'Content-type': 'application/json',
};
class ChatsAPI {
    constructor() {
        this.fetch = new HttpTransport('/chats');
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
}
export default ChatsAPI;
//# sourceMappingURL=chats.js.map