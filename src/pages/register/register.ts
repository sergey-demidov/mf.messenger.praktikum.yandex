import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './register-template';
import toaster, { ToasterMessageTypes } from '../../lib/toaster';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import authController from '../../controllers/auth';

const register = sue({
  name: 's-app-register',
  template,
  data() {
    return {
      password: '',
    };
  },
  methods: {
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      return (form as HTMLFormElement).checkValidity();
    },
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!this.methods.formIsValid(formName)) { // validate
        toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
        return;
      }
      const formData = new FormData(form as HTMLFormElement);
      const res = formDataToObject(formData);
      authController.signUp(res as HttpDataType)
        .then(() => {
          this.data.password = '';
          window.router.go('/#/chat');
          toaster.toast('Logged in successfully', ToasterMessageTypes.info);
        }).catch((error) => {
          toaster.bakeError(error);
        });
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default register;
