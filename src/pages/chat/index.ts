import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import sUser from '../../components/user';
import sChatDisplay from '../../components/chat-display';
import sChatMember from '../../components/chat-member';
import { sApp } from '../../lib/types';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';
import { CONST } from '../../lib/const';
import chatsController from '../../controllers/chats';

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
