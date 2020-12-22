import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import template from './template';
import AuthAPI from '../../api/auth';
import { isJsonString } from '../../lib/utils';

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
        const res = Array.from(formData.entries()).reduce((memo, pair) => ({
          ...memo,
          [pair[0]]: pair[1],
        }), {});
        // eslint-disable-next-line no-console
        console.dir(res); // print result
        auth.singUp(res)
          .then((response) => {
            if (response.status === 200) {
              return response;
            }
            if (isJsonString(response.response)) {
              throw new Error(JSON.parse(response.response).reason);
            }
            throw new Error(response.response);
          })
          .then((r) => {
            console.log(r);
          })
          .catch((error) => {
            console.dir(error);
            let message = error;
            if (error instanceof ProgressEvent) message = 'Error: Internet has broken down';
            toaster.toast(message, ToasterMessageTypes.error);
          });
      } else {
        // eslint-disable-next-line no-console
        console.log('form is not valid');
      }
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default register;
