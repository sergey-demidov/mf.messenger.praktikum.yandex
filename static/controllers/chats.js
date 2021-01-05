import eventBus from "../lib/event-bus.js";
import store from "../lib/store.js";
import { isJsonString } from "../lib/utils.js";
import ChatsApi from "../api/chats.js";
import { CONST } from "../lib/const.js";
import toaster, { ToasterMessageTypes } from "../lib/toaster.js";
const chatsApi = new ChatsApi();
class ChatsController {
    constructor() {
        this.eventBus = eventBus;
        if (ChatsController.instance) {
            return ChatsController.instance;
        }
        ChatsController.instance = this;
    }
    getChatUsers() {
        return chatsApi.getChatUsers(store.state.currentChat.id)
            .then((response) => {
            if (response.status === 200 && isJsonString(response.response)) {
                return JSON.parse(response.response);
            }
            throw new Error('Getting users failed');
        }).catch((error) => {
            toaster.bakeError(error);
        });
    }
    getChats() {
        return chatsApi.getChats()
            .then((response) => {
            if (response.status === 200 && isJsonString(response.response)) {
                return JSON.parse(response.response);
            }
            throw new Error('Getting chats failed');
        })
            .catch((error) => {
            toaster.bakeError(error);
        });
    }
    deleteUsers() {
        chatsApi.deleteUsers({ chatId: store.state.currentChat.id, users: [store.state.currentMember.id] })
            .then((response) => {
            if (response.status === 200) {
                toaster.toast(`User ${store.state.currentMember.login} has been kicked`);
                store.state.currentMember.id = 0;
                setTimeout(() => {
                    eventBus.emit(CONST.hashchange);
                }, 0);
                return;
            }
            throw new Error('User deletion failed');
        }).catch((error) => {
            toaster.bakeError(error);
        });
    }
    addUser(userId) {
        return chatsApi.addUsers({ users: [userId], chatId: store.state.currentChat.id })
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
    createChat(res) {
        return chatsApi.createChat(res)
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
    deleteChat(chatId) {
        return chatsApi.deleteChat({ chatId })
            .then((response) => {
            if (response.status === 200) {
                store.state.currentMember.id = 0;
                store.state.currentChat.id = 0;
                return response;
            }
            throw new Error(response.response);
        })
            .catch((error) => {
            toaster.bakeError(error);
        });
    }
    saveChatAvatar(formData) {
        return chatsApi.saveChatAvatar(formData)
            .then((response) => {
            if (response.status === 200) {
                toaster.toast('Avatar saved successfully', ToasterMessageTypes.info);
                return response;
            }
            throw new Error(response.response);
        })
            .catch((error) => {
            toaster.bakeError(error);
        });
    }
}
const chatsController = new ChatsController();
export default chatsController;
//# sourceMappingURL=chats.js.map