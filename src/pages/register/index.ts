import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import AuthAPI from '../../api/auth';
import { formDataToObject, isJsonString } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';

const auth = new AuthAPI();
const toaster = new Toaster();

const register = sue({
  name: 's-app-register-modal',
  template,
  data() {
    return {
      toaster: HTMLElement,
    };
  },
  methods: {
    // onReset(): void {
    //   (this as sApp).EventBus.emit('reset');
    // },
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      return (form as HTMLFormElement).checkValidity();
    },
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if ((this as sApp).methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = formDataToObject(formData);
        auth.signUp(res as HttpDataType)
          .then((response) => {
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
          })
          .catch((error) => {
            let message = error;
            if (error instanceof ProgressEvent) message = 'Error: Internet has broken down';
            toaster.toast(message, ToasterMessageTypes.error);
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

export default register;
