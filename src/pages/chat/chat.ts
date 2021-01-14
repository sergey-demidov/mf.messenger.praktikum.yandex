import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './chat-template';
import sUser from '../../components/user';
import sChatDisplay from '../../components/chat-display';
import sChatMember from '../../components/chat-member';
import { sApp } from '../../lib/types';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';
import { CONST } from '../../lib/const';
import chatsController from '../../controllers/chats';
import toaster from '../../lib/toaster';
import MessagesController from '../../controllers/messages';

const chat = sue({
  name: 's-app-chat',
  authorisationRequired: true,
  template,
  data() {
    return {
      chats: [],
      chatMembers: [],
      message: '',
      chatMessages: [],
      messagesController: {},
    };
  },
  methods: {
    deleteUser(): void {
      chatsController.deleteUsers();
    },
    getChats(this: sApp): void {
      if (!this.isVisible()) return;
      chatsController.getChats()
        .then((c) => {
          const chats = c;
          (this.data.chats as string[]).length = Object.keys(chats).length;
          let currentChatPresent = false;
          Object.keys(chats).forEach((key, index) => {
            if (chats[key].id === store.state.currentChat.id) currentChatPresent = true;
            (this.data.chats as string[])[index] = JSON.stringify(chats[key]);
          });
          if (!currentChatPresent) {
            store.state.currentChat.id = 0;
          }
          eventBus.emit(CONST.chatChange);
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
    isChatSelected(): boolean {
      return < number > store.state.currentChat.id > 0;
    },
    getMembers(this: sApp): void {
      if (!store.state.currentChat.id || store.state.currentChat.id === 0) {
        (this.data.chatMembers as string[]) = [];
        return;
      }
      chatsController.getChatUsers()
        .then((m) => {
          const members = m;
          (this.data.chatMembers as string[]).length = Object.keys(members).length;
          Object.keys(members).forEach((key, index) => {
            (this.data.chatMembers as string[])[index] = JSON.stringify(members[key]);
          });
          eventBus.emit(CONST.update);
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },

    fillChat(this: sApp) {
      chatsController.getChatToken()
        .then((response) => {
          store.state.currentChat.token = response.token;
          this.methods.getMembers();
          this.methods.getMessages();
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },

    getMessages(this: sApp) {
      const controller = <MessagesController> this.data.messagesController;
      if (!controller.chatId || controller.chatId !== store.state.currentChat.id) {
        if (controller.chatId) controller.close();
        this.data.messagesController = new MessagesController(
          store.state.currentUser.id as number,
          store.state.currentChat.id as number,
          store.state.currentChat.token as string,
        );
        console.dir(controller.chatId);
      }
    },
    messageReceived(data: string) {
      console.dir(data);
    },

    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      const formData = new FormData(form as HTMLFormElement);
      const res = Array.from(formData.entries()).reduce((memo, pair) => ({
        ...memo,
        [pair[0]]: pair[1],
      }), {});
      // eslint-disable-next-line no-console
      console.dir(res); // print result
    },
  },
  created(this: sApp) {
    eventBus.on(CONST.hashchange, () => this.methods.getChats());
    eventBus.on(CONST.chatChange, () => this.methods.fillChat());
    eventBus.on(CONST.messageReceived, () => this.methods.getMessages());
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
    's-user': sUser,
    's-chat-display': sChatDisplay,
    's-chat-member': sChatMember,
  },
});

export default chat;
