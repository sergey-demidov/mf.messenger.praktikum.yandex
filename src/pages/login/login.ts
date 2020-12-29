import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import { CONST, formDataToObject, isJsonString } from '../../lib/utils';
import { baseUrl, HttpDataType } from '../../lib/http-transport';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import AuthAPI from '../../api/auth';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';

const auth = new AuthAPI();
const toaster = new Toaster();

const login = sue({
  name: 's-app-login',
  template,
  data() {
    return {
      login: '',
      password: '',
    };
  },
  methods: {
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      return (form as HTMLFormElement).checkValidity();
    },
    fillUser() {
      auth.getUser()
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('unauthorized');
        })
        .then((u) => {
          const user = u;
          const that = <sApp> this;
          if (!user.avatar) {
            user.avatar = that.data.emptyAvatar;
          } else {
            user.avatar = baseUrl + user.avatar;
          }
          Object.assign(store.state.currentUser, user);
          eventBus.emit(CONST.update);
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if ((this as sApp).methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = formDataToObject(formData);
        auth.signIn(res as HttpDataType)
          .then((response) => {
            (this as sApp).data.password = '';
            if (response.status !== 200) {
              throw new Error(response.response);
            }
            toaster.toast('Logged in successfully', ToasterMessageTypes.info);
            (this as sApp).methods.fillUser();
            window.router.go('/#/chat');
          })
          .catch((error) => {
            if (error.message && error.message === 'user already in system') {
              window.router.go('/#/chat');
            } else {
              toaster.bakeError(error);
            }
          });
      } else {
        toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
      }
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default login;
