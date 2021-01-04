import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import sUser from '../../components/user';
import sChatDisplay from '../../components/chat-display';
import sChatMember from '../../components/chat-member';
import { isJsonString } from '../../lib/utils';
import ChatsAPI from '../../api/chats';
import Toaster from '../../lib/toaster';
import { sApp } from '../../lib/types';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';
import { CONST } from '../../lib/const';

const chatsApi = new ChatsAPI();
const toaster = new Toaster();

const chat = sue({
  name: 's-app-chat',
  authorisationRequired: true,
  template,
  data() {
    return {
      chats: [],
      chatMembers: [],
      message: '',
    };
  },
  methods: {
    deleteUser(): void {
      chatsApi.deleteUsers({ chatId: <number>store.state.currentChat.id, users: [<number> store.state.currentMember.id] })
        .then((response) => {
          if (response.status === 200) {
            toaster.toast(`User ${store.state.currentMember.login} has been kicked`);
            store.state.currentMember.id = 0;
            setTimeout(() => { eventBus.emit(CONST.hashchange); }, 0);
            return;
          }
          throw new Error('User deletion failed');
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
    getChats(this: sApp): void {
      if (!this.isVisible()) return;
      chatsApi.getChats()
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('Getting chats failed');
        })
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
      chatsApi.getChatUsers(<number>store.state.currentChat.id)
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('Getting users failed');
        })
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
    eventBus.on(CONST.chatChange, () => this.methods.getMembers());
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
