import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import { CONST, formDataToObject, isJsonString } from "../../lib/utils.js";
import AuthAPI from "../../api/auth.js";
import { baseUrl } from "../../lib/http-transport.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import UserAPI from "../../api/user.js";
import EventBus from "../../lib/event-bus.js";
const auth = new AuthAPI();
const userAPI = new UserAPI();
const toaster = new Toaster();
const eventBus = new EventBus();
const profile = sue({
    name: 's-app-profile',
    template,
    data() {
        return {
            array: ['one', 'two', 'three'],
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
        //   (this as sApp).methods.fillForm();
        // },
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
                toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
                return;
            }
            const formData = new FormData(form);
            const res = formDataToObject(formData);
            res.display_name = res.first_name;
            userAPI.saveProfile(res)
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
            if (!avatar || !avatar.size) {
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
            auth.getUser()
                .then((response) => {
                if (response.status === 200 && isJsonString(response.response)) {
                    return JSON.parse(response.response);
                }
                throw new Error('unauthorized');
            })
                .then((u) => {
                const user = u;
                const that = this;
                if (!user.avatar) {
                    user.avatar = that.data.emptyAvatar;
                }
                else {
                    user.avatar = baseUrl + user.avatar;
                }
                Object.assign(that.data, user);
                eventBus.emit(CONST.userDataChange);
                const fileInput = document.getElementById('avatarInput');
                if (fileInput)
                    fileInput.value = '';
            }).catch((error) => {
                toaster.bakeError(error);
            });
        },
    },
    created() {
        eventBus.on(CONST.hashchange, () => this.methods.fillForm());
    },
    mounted() {
        console.log('Profile mounted');
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