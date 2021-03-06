import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './chat-add-user-template';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';
import { CONST } from '../../lib/const';
import userController from '../../controllers/user';
import chatsController from '../../controllers/chats';
import toaster from '../../lib/toaster';

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
    submitForm(this: sApp): void {
      chatsController.addUser(<number> this.data.userId)
        .then(() => {
          toaster.toast(`User ${this.data.userName} has been added`);
          this.data.userId = 0;
          this.data.userName = '';
          eventBus.emit(CONST.chatChange);
          window.router.go('/#/chat');
        })
        .catch(() => {
          toaster.bakeError(`User ${this.data.userName} has not added`);
        });
      this.data.allowInvite = false;
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
      if (!this.isVisible()) return;
      if (validateResult !== CONST.true || (this.data.userName as string).length === 0) {
        this.data.possibleNames = [];
        return;
      }
      userController.findUsers(<string> this.data.userName)
        .then((users) => {
          const res = [];
          if (!Array.isArray(users)) throw new Error('response result is not array');
          for (let i = 0; i < users.length; i += 1) {
            res.push(users[i].login);
          }
          const index = res.indexOf(this.data.userName);
          if (index !== -1) {
            this.data.allowInvite = true;
            this.data.userId = users[index].id;
          } else {
            this.data.allowInvite = false;
            this.data.possibleNames = res;
          }
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
  },
  created(this: sApp) {
    eventBus.on(CONST.validateFinished, (args) => this.methods.fillForm(args));
    eventBus.on(CONST.hashchange, () => this.methods.checkChat());
  },

  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default addUser;
