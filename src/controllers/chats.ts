import eventBus from '../lib/event-bus';
import store from '../lib/store';
import { isJsonString } from '../lib/utils';
import ChatsApi from '../api/chats';
import { CONST } from '../lib/const';
import toaster, { ToasterMessageTypes } from '../lib/toaster';
import { HttpDataType } from '../lib/http-transport';

const chatsApi = new ChatsApi();

class ChatsController {
  eventBus = eventBus

  private static instance: ChatsController;

  constructor() {
    if (ChatsController.instance) {
      return ChatsController.instance;
    }
    ChatsController.instance = this;
  }

  getChatUsers() {
    return chatsApi.getChatUsers(<number>store.state.currentChat.id)
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('Getting users failed');
      });
  }

  getChats() {
    return chatsApi.getChats()
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('Getting chats failed');
      });
  }

  deleteUsers() {
    chatsApi.deleteUsers({ chatId: <number>store.state.currentChat.id, users: [<number>store.state.currentMember.id] })
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
      })
      .catch((error) => {
        toaster.bakeError(error);
      });
  }

  addUser(userId: number) {
    return chatsApi.addUsers({ users: [userId], chatId: <number>store.state.currentChat.id })
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        throw new Error(response.response);
      });
  }

  createChat(res: HttpDataType) {
    return chatsApi.createChat(res)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        throw new Error(response.response);
      });
  }

  deleteChat(chatId: number) {
    return chatsApi.deleteChat({ chatId })
      .then((response) => {
        if (response.status === 200) {
          store.state.currentMember.id = 0;
          store.state.currentChat.id = 0;
          return response;
        }
        throw new Error(response.response);
      });
  }

  saveChatAvatar(formData: FormData) {
    return chatsApi.saveChatAvatar(formData)
      .then((response) => {
        if (response.status === 200) {
          toaster.toast('Avatar saved successfully', ToasterMessageTypes.info);
          return response;
        }
        throw new Error(response.response);
      });
  }

  getChatToken() {
    return chatsApi.getChatToken(<number>store.state.currentChat.id)
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('Getting chat token failed');
      });
  }

  getUnreadMessagesCount(chatId: number) {
    return chatsApi.getUnreadMessagesCount(chatId)
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('Getting unread messages failed');
      });
  }
}

const chatsController = new ChatsController();

export default chatsController;
