import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import sUser from '../../components/user';
import sChatDisplay from '../../components/chat-display';
import sChatMember from '../../components/chat-member';
import { CONST, isJsonString } from '../../lib/utils';
import ChatsAPI from '../../api/chats';
import Toaster from '../../lib/toaster';
import { sApp } from '../../lib/types';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';

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
    getChats():void {
      if (!(this as sApp).isVisible()) return;
      const that = <sApp> this;
      chatsApi.getChats()
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('Getting chats failed');
        })
        .then((c) => {
          const chats = c;
          (that.data.chats as string[]).length = Object.keys(chats).length;
          Object.keys(chats).forEach((key, index) => {
            (that.data.chats as string[])[index] = JSON.stringify(chats[key]);
          });
          eventBus.emit(CONST.update);
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
    isChatSelected(): boolean {
      return < number > store.state.currentChat.id > 0;
    },
    getMembers():void {
      console.log('getMembers');
      // if (!(this as sApp).isVisible()) return;
      const that = <sApp> this;
      chatsApi.getChatUsers(<number>store.state.currentChat.id)
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('Getting users failed');
        })
        .then((m) => {
          const members = m;
          (that.data.chatMembers as string[]).length = Object.keys(members).length;
          Object.keys(members).forEach((key, index) => {
            (that.data.chatMembers as string[])[index] = JSON.stringify(members[key]);
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
  mounted() {
    console.log('CHATS mounted');
  },
  created() {
    eventBus.on(CONST.hashchange, () => (this as unknown as sApp).methods.getChats());
    eventBus.on(CONST.chatChange, () => (this as unknown as sApp).methods.getMembers());
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
