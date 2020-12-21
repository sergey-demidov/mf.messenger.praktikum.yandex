import { sApp, sHTMLInputElement } from '../../lib/types';
import sue from '../../lib/sue';
import sInput from '../../components/input';
import sButton from '../../components/button';
import template from './template';
// import EventBus from '../../lib/event-bus';

const profile = sue({
  name: 's-app-profile',
  template,
  data() {
    return {
      first_name: 'Сергей',
      second_name: 'Демидов',
      email: 'demid@podolsk.ru',
      phone: '+7(906)031-90-06',
      login: 'sergey',
    };
  },
  methods: {
    onReset(formName: string): boolean {
      const form = document.forms.namedItem(formName);
      if (form) {
        Array.from(form.elements).forEach((el) => {
          const element = <sHTMLInputElement>el;
          if (typeof element.reset === 'function') element.reset();
        });
      }
      return false;
    },
    formIsValid(formName: string): boolean {
      console.log(`${formName} validate`);
      const form = document.forms.namedItem(formName);
      // if (form) {
      //   Array.from(form.elements).forEach((el) => {
      //     const element = <sHTMLInputElement>el;
      //     if (typeof element.validate === 'function') element.reset();
      //   });
      // }
      return (form as HTMLFormElement).checkValidity();
    },
    submitForm(formName: string): void {
      const form = document.forms.namedItem(formName);
      if ((this as sApp).methods.formIsValid(formName)) { // validate
        const formData = new FormData(form as HTMLFormElement);
        const res = Array.from(formData.entries()).reduce((memo, pair) => ({
          ...memo,
          [pair[0]]: pair[1],
        }), {});
        // eslint-disable-next-line no-console
        console.dir(res); // print result
      } else {
        // eslint-disable-next-line no-console
        console.log('form is not valid');
      }
    },
    // Превью аватара с обработкой ошибок
    loadImage(): void {
      const fileInput = <HTMLInputElement>document.getElementById('avatarInput');
      const avatarPreview = <HTMLSourceElement>document.getElementById('avatarPreview');
      if (!avatarPreview || !fileInput || !fileInput.files) {
        throw new Error(`avatarPreview: ${avatarPreview}, fileInput: ${fileInput}`);
      }
      const backupSrc = avatarPreview.src; // сохраняем старое изображение
      avatarPreview.src = URL.createObjectURL(fileInput.files[0]); // показываем новое

      // в случае ошибки
      avatarPreview.onerror = () => {
        fileInput.value = '';
        avatarPreview.src = backupSrc; // возвращаем старое изображение
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
  },
  components: {
    's-input': sInput,
    's-btn': sButton,
  },
});

export default profile;
