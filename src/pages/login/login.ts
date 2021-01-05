import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import toaster, { ToasterMessageTypes } from '../../lib/toaster';
import authController from '../../controllers/auth';

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
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!this.methods.formIsValid(formName)) { // validate
        toaster.bakeError('form is not valid');
        return;
      }
      const formData = new FormData(form as HTMLFormElement);
      const res = formDataToObject(formData);
      authController.signIn(res as HttpDataType)
        .then((result) => {
          this.data.password = '';
          if (result) {
            toaster.toast('Logged in successfully', ToasterMessageTypes.info);
            window.router.go('/#/chat');
          }
        }).catch((error) => {
          if (error.message && error.message === 'user already in system') {
            window.router.go('/#/chat');
          } else {
            toaster.bakeError(error);
          }
        });
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default login;
