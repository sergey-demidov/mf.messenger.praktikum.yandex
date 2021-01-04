import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import { formDataToObject, isJsonString } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import AuthAPI from '../../api/auth';
import auth from '../../controllers/auth';
import { backendUrl } from '../../lib/const';

const authAPI = new AuthAPI();
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
      authAPI.getUser()
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
            user.avatar = backendUrl + user.avatar;
          }
          auth.fillUserState().then(() => window.router.go('/#/chat'));
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (this.methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = formDataToObject(formData);
        authAPI.signIn(res as HttpDataType)
          .then((response) => {
            this.data.password = '';
            if (response.status !== 200) {
              throw new Error(response.response);
            }
            toaster.toast('Logged in successfully', ToasterMessageTypes.info);
            this.methods.fillUser();
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
