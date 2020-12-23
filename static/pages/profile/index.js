import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import { formDataToObject } from "../../lib/utils.js";
// import Toaster from '../../lib/toaster';
// import EventBus from '../../lib/event-bus';
// const toaster = new Toaster();
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
        onReset(formName) {
            const form = document.forms.namedItem(formName);
            if (form) {
                Array.from(form.elements).forEach((el) => {
                    const element = el;
                    if (typeof element.reset === 'function')
                        element.reset();
                });
            }
            return false;
        },
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            return form.checkValidity();
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (this.methods.formIsValid(formName)) { // validate
                const formData = new FormData(form);
                const res = formDataToObject(formData);
                // eslint-disable-next-line no-console
                console.dir(res); // print result
            }
            else {
                // eslint-disable-next-line no-console
                console.log('form is not valid');
            }
        },
        // Превью аватара с обработкой ошибок
        loadImage() {
            const fileInput = document.getElementById('avatarInput');
            const avatarPreview = document.getElementById('avatarPreview');
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
        's-user': sUser,
    },
});
export default profile;
//# sourceMappingURL=index.js.map