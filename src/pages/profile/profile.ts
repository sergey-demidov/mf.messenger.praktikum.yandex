import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './profile-template';
import sUser from '../../components/user';
import { formDataToObject } from '../../lib/utils';
import { HttpDataType } from '../../lib/http-transport';
import toaster from '../../lib/toaster';
import eventBus from '../../lib/event-bus';
import { CONST } from '../../lib/const';
import userController from '../../controllers/user';
import authController from '../../controllers/auth';
import store from '../../lib/store';

const profile = sue({
  name: 's-app-profile',
  template,
  authorisationRequired: true,
  data() {
    return {
      first_name: '',
      second_name: '',
      email: '',
      phone: '',
      login: '',
      avatar: '',
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
    submitForm(this: sApp, formName: string): void {
      const form = document.forms.namedItem(formName);
      if (!form) {
        throw new Error(`form '${formName}' is not exist`);
      }
      if (!this.methods.formIsValid(formName)) { // validate
        toaster.bakeError('form is not valid');
        return;
      }
      const formData = new FormData(form);
      const res = formDataToObject(formData);
      res.display_name = res.first_name;
      userController.saveProfile(res as HttpDataType)
        .then(() => {
          toaster.toast('Profile saved successfully');
        }).catch((error) => {
          toaster.bakeError(error);
        });
      const avatar = formData.get('avatar');
      if (!avatar || !(avatar as File).size) {
        return;
      }
      userController.saveProfileAvatar(formData)
        .then(() => {
          toaster.toast('Avatar saved successfully');
        }).catch((error) => {
          toaster.bakeError(error);
        });
      const fileInput = <HTMLInputElement>document.getElementById('avatarInput');
      if (fileInput) fileInput.value = '';
    },
    // Превью аватара с обработкой ошибок
    loadImage(this: sApp): void {
      const fileInput = <HTMLInputElement>document.getElementById('avatarInput');
      const avatarPreview = <HTMLSourceElement>document.getElementById('avatarPreview');
      if (!avatarPreview || !fileInput || !fileInput.files) {
        throw new Error(`avatarPreview: ${avatarPreview}, fileInput: ${fileInput}`);
      }
      const backupSrc = avatarPreview.src; // сохраняем старое изображение
      this.data.avatar = URL.createObjectURL(fileInput.files[0]); // показываем новое

      // в случае ошибки
      avatarPreview.onerror = () => {
        fileInput.value = '';
        this.data.avatar = backupSrc; // возвращаем старое изображение
        // моргаем красным значком
        const errorSign = document.getElementById('errorSign');
        if (!errorSign) {
          throw new Error(`errorSign: ${errorSign}`);
        }
        errorSign.classList.add('blink');
        setTimeout(() => {
          errorSign.classList.remove('blink');
        }, 2000);
      };
    },
    fillForm(this: sApp) {
      if (!this.isVisible()) return;
      if (authController.isUserLoggedIn()) {
        Object.assign(this.data, store.state.currentUser);
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
    's-user': sUser,
  },
});

export default profile;
