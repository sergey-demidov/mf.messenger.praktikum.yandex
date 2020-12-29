import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import sUser from '../../components/user';
import sChatDisplay from '../../components/chat-display';
import { CONST, isJsonString } from '../../lib/utils';
import ChatsAPI from '../../api/chats';
import Toaster from '../../lib/toaster';
import { sApp } from '../../lib/types';
import eventBus from '../../lib/event-bus';

const chatsApi = new ChatsAPI();
const toaster = new Toaster();

const chat = sue({
  name: 's-app-chat',
  template,
  data() {
    return {
      chats: [],
      message: '',
    };
  },
  methods: {
    getChats():void {
      if (!(this as sApp).isVisible()) return;
      chatsApi.getChats()
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('Getting chats failed');
        })
        .then((c) => {
          const chats = c;
          this.data.chats = [];
          Object.keys(chats).forEach((key) => {
            this.data.chats.push(JSON.stringify(chats[key]));
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
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
    's-user': sUser,
    's-chat-display': sChatDisplay,
  },
});

export default chat;
