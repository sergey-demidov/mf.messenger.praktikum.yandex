import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import eventBus from '../../lib/event-bus';
import store from '../../lib/store';
import { backendUrl, CONST } from '../../lib/const';
import chatsController from '../../controllers/chats';

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
    matchTitle(this: sApp) {
      return this.data.deleteConfirm !== this.data.title;
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
    deleteChat(this: sApp):void {
      chatsController.deleteChat(<number> this.data.id)
        .then(() => {
          toaster.toast(`Chat ${this.data.title} deleted successfully`, ToasterMessageTypes.info);
          window.router.go('/#/chat');
        });
    },
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      const formData = new FormData(form);
      if (!this.methods.isAvatarChanged(formName)) {
        return;
      }
      chatsController.saveChatAvatar(formData)
        .then(() => {
          const fileInput = <HTMLInputElement>document.getElementById('avatarInput');
          if (fileInput) fileInput.value = '';
        });
    },
    // Превью аватара с обработкой ошибок
    loadImage(this: sApp): void {
      const fileInput = <HTMLInputElement>document.getElementById('chatAvatarInput');
      const avatarPreview = <HTMLSourceElement>document.getElementById('chatAvatarPreview');
      if (!avatarPreview || !fileInput || !fileInput.files) {
        throw new Error(`chatAvatarPreview: ${avatarPreview}, fileInput: ${fileInput}`);
      }
      const backupSrc = avatarPreview.src; // сохраняем старое изображение
      this.data.avatar = URL.createObjectURL(fileInput.files[0]); // показываем новое

      // в случае ошибки
      avatarPreview.onerror = () => {
        fileInput.value = '';
        this.data.avatar = backupSrc; // возвращаем старое изображение
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
    fillForm(this: sApp) {
      if (!this.isVisible()) return;
      if (!store.state.currentChat.id) {
        setTimeout(() => window.router.go('/#/chat'), 100);
        return;
      }
      Object.assign(this.data, store.state.currentChat);
      if (store.state.currentChat.avatar === null) {
        this.data.avatar = this.data.emptyAvatar;
      } else {
        this.data.avatar = backendUrl + store.state.currentChat.avatar;
      }
    },
  },
  created(this: sApp) {
    eventBus.on(CONST.hashchange, () => this.methods.fillForm());
  },
  mounted(this: sApp) {
    this.methods.fillForm();
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default chatEdit;
