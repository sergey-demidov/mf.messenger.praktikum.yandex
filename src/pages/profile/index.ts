import { sApp } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
import sUser from '../../components/user';
import { formDataToObject, isJsonString } from '../../lib/utils';
import AuthAPI from '../../api/auth';
import { HttpDataType } from '../../lib/http-transport';
import Toaster, { ToasterMessageTypes } from '../../lib/toaster';
import UserAPI from '../../api/user';
import eventBus from '../../lib/event-bus';
import { backendUrl, CONST } from '../../lib/const';

const auth = new AuthAPI();
const userAPI = new UserAPI();
const toaster = new Toaster();

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
    // resetForm(): void {
    //   this.methods.fillForm();
    // },
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
        toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
        return;
      }
      const formData = new FormData(form);
      const res = formDataToObject(formData);
      res.display_name = res.first_name;
      userAPI.saveProfile(res as HttpDataType)
        .then((response) => {
          if (response.status !== 200) {
            throw new Error(response.response);
          }
          toaster.toast('Profile saved successfully', ToasterMessageTypes.info);
          eventBus.emit('userDataChange');
        })
        .catch((error) => {
          toaster.bakeError(error);
        });
      const avatar = formData.get('avatar');
      if (!avatar || !(avatar as File).size) {
        return;
      }
      userAPI.saveProfileAvatar(formData)
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
      auth.getUser()
        .then((response) => {
          if (response.status === 200 && isJsonString(response.response)) {
            return JSON.parse(response.response);
          }
          throw new Error('unauthorized');
        })
        .then((u) => {
          const user = u;
          const that = <sApp> this;
          if (!user.avatar) {
            user.avatar = that.data.emptyAvatar;
          } else {
            user.avatar = backendUrl + user.avatar;
          }
          Object.assign(that.data, user);
          eventBus.emit(CONST.userDataChange);
          const fileInput = <HTMLInputElement>document.getElementById('avatarInput');
          if (fileInput) fileInput.value = '';
        }).catch((error) => {
          toaster.bakeError(error);
        });
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
    's-user': sUser,
  },
});

export default profile;
