import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import Toaster from '../../lib/toaster';
import eventBus from '../../lib/event-bus';
import ChatsAPI from '../../api/chats';
import store from '../../lib/store';
import { CONST, isJsonString } from '../../lib/utils';
import UserAPI from '../../api/user';

const chatsAPI = new ChatsAPI();
const toaster = new Toaster();
const userApi = new UserAPI();

const addUser = sue({
  name: 's-app-chat-add-user-modal',
  template,
  authorisationRequired: true,
  data() {
    return {
      userName: '',
      userId: 0,
      title: '',
      possibleNames: [],
      allowInvite: false,
    };
  },
  methods: {
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      return form.checkValidity();
    },
    matchUser() {
      return true;
    },
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      chatsAPI.addUsers({
        users: [
          <number> this.data.userId,
        ],
        chatId: <number>store.state.currentChat.id,
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.response);
          }
          this.data.userId = 0;
          this.data.userName = '';
          eventBus.emit(CONST.chatChange);
          window.router.go('/#/chat');
        })
        .catch((error) => {
          toaster.bakeError(error);
        });
    },
    checkChat(this: sApp) {
      if (!this.isVisible()) return;
      if (!store.state.currentChat.id) {
        setTimeout(() => window.router.go('/#/chat'), 100);
        return;
      }
      if (!this.data.title) {
        this.data.title = store.state.currentChat.title;
      }
    },
    fillForm(this: sApp, ...args: string[]) {
      const [validateResult] = args;
      if (!(this as sApp).isVisible()) return;
      if (validateResult !== CONST.true || (this.data.userName as string).length === 0) {
        this.data.possibleNames = [];
        return;
      }

      userApi.findUsers({ login: <string> this.data.userName })
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error(response.response);
        })
        .then((users) => {
          const res = [];
          if (!Array.isArray(users)) throw new Error('response result is not array');
          for (let i = 0; i < users.length; i += 1) {
            res.push(users[i].login);
          }
          if (res.length === 1 && res[0] === this.data.userName) {
            this.data.allowInvite = true;
            this.data.userId = users[0].id;
          } else {
            this.data.allowInvite = false;
            this.data.possibleNames = res;
            console.dir(users);
          }
        })
        .catch((error) => {
          toaster.bakeError(error);
        });
    },
  },
  created() {
    eventBus.on(CONST.validateFinished, (args) => (this as unknown as sApp).methods.fillForm(args));
    eventBus.on(CONST.hashchange, () => (this as unknown as sApp).methods.checkChat());
  },

  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default addUser;
