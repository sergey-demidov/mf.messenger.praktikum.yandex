import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import AuthAPI from '../../api/auth';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';

const auth = new AuthAPI();
const toaster = new Toaster();

const register = sue({
  name: 's-app-register',
  template,
  data() {
    return {
      password: '',
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
            (this as sApp).data.password = '';
            if (response.status === 200) {
              return response;
            }
            throw new Error(response.response);
          })
          .then(() => {
            window.router.go('/#/chat');
            toaster.toast('Logged in successfully', ToasterMessageTypes.info);
          })
          .catch((error) => {
            toaster.bakeError(error);
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
