import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import { formDataToObject } from "../../lib/utils.js";
import toaster from "../../lib/toaster.js";
import eventBus from "../../lib/event-bus.js";
import { CONST } from "../../lib/const.js";
import userController from "../../controllers/user.js";
import authController from "../../controllers/auth.js";
import store from "../../lib/store.js";
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
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            if (!form) {
                throw new Error(`form '${formName}' is not exist`);
            }
            return form.checkValidity();
        },
        submitForm(formName) {
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
            userController.saveProfile(res)
                .then(() => {
                toaster.toast('Profile saved successfully');
            }).catch((error) => {
                toaster.bakeError(error);
            });
            const avatar = formData.get('avatar');
            if (!avatar || !avatar.size) {
                return;
            }
            userController.saveProfileAvatar(formData)
                .then(() => {
                toaster.toast('Avatar saved successfully');
            }).catch((error) => {
                toaster.bakeError(error);
            });
            const fileInput = document.getElementById('avatarInput');
            if (fileInput)
                fileInput.value = '';
        },
        // Превью аватара с обработкой ошибок
        loadImage() {
            const fileInput = document.getElementById('avatarInput');
            const avatarPreview = document.getElementById('avatarPreview');
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
        fillForm() {
            if (!this.isVisible())
                return;
            if (authController.isUserLoggedIn()) {
                Object.assign(this.data, store.state.currentUser);
            }
        },
    },
    created() {
        eventBus.on(CONST.hashchange, () => this.methods.fillForm());
    },
    mounted() {
        this.methods.fillForm();
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
        's-user': sUser,
    },
});
export default profile;
//# sourceMappingURL=index.js.map