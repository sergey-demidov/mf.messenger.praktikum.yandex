import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import { formDataToObject, isJsonString } from "../../lib/utils.js";
import AuthApi from "../../api/auth.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import UserApi from "../../api/user.js";
import eventBus from "../../lib/event-bus.js";
import { backendUrl, CONST } from "../../lib/const.js";
const auth = new AuthApi();
const userApi = new UserApi();
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
            userApi.saveProfile(res)
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
            userApi.saveProfileAvatar(formData)
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
                if (!user.avatar) {
                    user.avatar = this.data.emptyAvatar;
                }
                else {
                    user.avatar = backendUrl + user.avatar;
                }
                Object.assign(this.data, user);
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