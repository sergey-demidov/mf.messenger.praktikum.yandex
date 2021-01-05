import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import toaster, { ToasterMessageTypes } from '../../lib/toaster';
import AuthApi from '../../api/auth';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';

const auth = new AuthApi();
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
    //   this.EventBus.emit('reset');
    // },
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      return (form as HTMLFormElement).checkValidity();
    },
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (this.methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = formDataToObject(formData);
        auth.signUp(res as HttpDataType)
          .then((response) => {
            this.data.password = '';
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
