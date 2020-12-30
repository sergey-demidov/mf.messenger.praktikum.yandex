import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import ChatsAPI from '../../api/chats';

const toaster = new Toaster();
const chatsApi = new ChatsAPI();

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
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      if (!(this as sApp).methods.formIsValid(formName)) { // validate
        toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
        return;
      }
      const formData = new FormData(form);
      const res = formDataToObject(formData);
      chatsApi.createChat(res as HttpDataType)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.response);
          }
          toaster.toast(`Chat ${(this as sApp).data.title} created successfully`, ToasterMessageTypes.info);
          (this as sApp).data.title = '';
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
