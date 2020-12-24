import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import { formDataToObject, isJsonString } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import AuthAPI from '../../api/auth';

const auth = new AuthAPI();
const toaster = new Toaster();

const login = sue({
  name: 's-app-login-modal',
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
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if ((this as sApp).methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = formDataToObject(formData);
        auth.signIn(res as HttpDataType)
          .then((response) => {
            (this as sApp).data.password = '';
            if (response.status === 200) {
              return response;
            }
            if (isJsonString(response.response)) {
              throw new Error(JSON.parse(response.response).reason);
            }
            throw new Error(response.response);
          })
          .then(() => {
            window.router.go('/#/');
            toaster.toast('Logged in successfully', ToasterMessageTypes.info);
          })
          .catch((error) => {
            let message = error;
            if (error instanceof ProgressEvent) message = 'Error: Internet has broken down';
            toaster.toast(message, ToasterMessageTypes.error);
            console.dir(message);
            if (error.message === 'user already in system') {
              window.router.go('/#/');
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
