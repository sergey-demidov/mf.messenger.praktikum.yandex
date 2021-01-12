import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './chat-create-template';
import toaster, { ToasterMessageTypes } from '../../lib/toaster';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import chatsController from '../../controllers/chats';

const createChat = sue({
  name: 's-app-chat-create-modal',
  authorisationRequired: true,
  template,
  data() {
    return {
      title: '',
    };
  },
  methods: {
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
        toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
        return;
      }
      const formData = new FormData(form);
      const res = formDataToObject(formData);
      res.title = (res.title as string).trim();
      chatsController.createChat(res as HttpDataType)
        .then(() => {
          toaster.toast(`Chat ${this.data.title} created successfully`, ToasterMessageTypes.info);
          this.data.title = '';
          window.router.back();
        })
        .catch((error) => {
          toaster.bakeError(error);
        });
    },
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default createChat;
