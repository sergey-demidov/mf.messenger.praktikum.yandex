import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import { CONST } from '../../lib/utils';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import eventBus from '../../lib/event-bus';
import ChatsAPI from '../../api/chats';
import store from '../../lib/store';
import { baseUrl } from '../../lib/http-transport';

const chatsAPI = new ChatsAPI();
const toaster = new Toaster();

const chatEdit = sue({
  name: 's-app-chat-edit-modal',
  template,
  authorisationRequired: true,
  data() {
    return {
      title: '',
      id: 0,
      avatar: '',
      deleteConfirm: '',
      emptyAvatar: '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200',
    };
  },
  methods: {
    formIsValid(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      return form.checkValidity();
    },
    matchTitle() {
      return (this as sApp).data.deleteConfirm !== (this as sApp).data.title;
    },
    isAvatarChanged(formName: string) {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      const formData = new FormData(form);
      const avatar = formData.get('avatar');
      return !!(avatar && (avatar as File).size);
    },
    deleteChat():void {
      chatsAPI.deleteChat({ chatId: <number>(this as sApp).data.id })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.response);
          }
          store.state.currentMember.id = 0;
          store.state.currentChat.id = 0;
          toaster.toast(`Chat ${(this as sApp).data.title} deleted successfully`, ToasterMessageTypes.info);
          window.router.go('/#/chat');
        })
        .catch((error) => {
          toaster.bakeError(error);
        });
    },
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      const formData = new FormData(form);
      if (!(this as sApp).methods.isAvatarChanged(formName)) {
        return;
      }
      chatsAPI.saveChatAvatar(formData)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.response);
          }
          toaster.toast('Avatar saved successfully', ToasterMessageTypes.info);
        })
        .catch((error) => {
          toaster.bakeError(error);
        });
      const fileInput = <HTMLInputElement>document.getElementById('avatarInput');
      if (fileInput) fileInput.value = '';
    },
    // Превью аватара с обработкой ошибок
    loadImage(): void {
      const fileInput = <HTMLInputElement>document.getElementById('chatAvatarInput');
      const avatarPreview = <HTMLSourceElement>document.getElementById('chatAvatarPreview');
      if (!avatarPreview || !fileInput || !fileInput.files) {
        throw new Error(`chatAvatarPreview: ${avatarPreview}, fileInput: ${fileInput}`);
      }
      const backupSrc = avatarPreview.src; // сохраняем старое изображение
      (this as sApp).data.avatar = URL.createObjectURL(fileInput.files[0]); // показываем новое

      // в случае ошибки
      avatarPreview.onerror = () => {
        fileInput.value = '';
        (this as sApp).data.avatar = backupSrc; // возвращаем старое изображение
        // моргаем красным значком
        const errorSign = document.getElementById('chatErrorSign');
        if (!errorSign) {
          throw new Error(`chatErrorSign: ${errorSign}`);
        }
        errorSign.classList.add('blink');
        setTimeout(() => {
          errorSign.classList.remove('blink');
        }, 2000);
      };
    },
    fillForm() {
      if (!(this as sApp).isVisible()) return;
      if (!store.state.currentChat.id) {
        setTimeout(() => window.router.go('/#/chat'), 100);
        return;
      }
      Object.assign((this as sApp).data, store.state.currentChat);
      if (store.state.currentChat.avatar === null) {
        (this as sApp).data.avatar = (this as sApp).data.emptyAvatar;
      } else {
        (this as sApp).data.avatar = baseUrl + store.state.currentChat.avatar;
      }
    },
  },
  created() {
    eventBus.on(CONST.hashchange, () => (this as unknown as sApp).methods.fillForm());
  },
  mounted() {
    (this as unknown as sApp).methods.fillForm();
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default chatEdit;
