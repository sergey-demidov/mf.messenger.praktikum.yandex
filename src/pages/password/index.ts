import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import toaster from '../../lib/toaster';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import userController from '../../controllers/user';

const password = sue({
  name: 's-app-password-modal',
  template,
  authorisationRequired: true,
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    };
  },
  methods: {
    concat(...args: string[]): string {
      return args.join('');
    },
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      return (form as HTMLFormElement).checkValidity();
    },
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      if (!this.methods.formIsValid(formName)) { // validate
        toaster.bakeError('form is not valid');
        return;
      }
      if (this.data.newPassword !== this.data.newPasswordAgain) {
        toaster.bakeError('passwords is not match');
        return;
      }
      const formData = new FormData(form);
      const res = formDataToObject(formData);
      userController.changePassword(res as HttpDataType)
        .then(() => {
          toaster.toast('Password saved successfully');
          this.data.oldPassword = '';
          this.data.newPassword = '';
          this.data.newPasswordAgain = '';
          window.router.back();
        });
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default password;
