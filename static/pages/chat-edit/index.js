import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import eventBus from "../../lib/event-bus.js";
import ChatsAPI from "../../api/chats.js";
import store from "../../lib/store.js";
import { backendUrl, CONST } from "../../lib/const.js";
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
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            if (!form) {
                throw new Error(`form '${formName}' is not exist`);
            }
            return form.checkValidity();
        },
        matchTitle() {
            return this.data.deleteConfirm !== this.data.title;
        },
        isAvatarChanged(formName) {
            const form = document.forms.namedItem(formName);
            if (!form) {
                throw new Error(`form '${formName}' is not exist`);
            }
            const formData = new FormData(form);
            const avatar = formData.get('avatar');
            return !!(avatar && avatar.size);
        },
        deleteChat() {
            chatsAPI.deleteChat({ chatId: this.data.id })
                .then((response) => {
                if (response.status !== 200) {
                    throw new Error(response.response);
                }
                store.state.currentMember.id = 0;
                store.state.currentChat.id = 0;
                toaster.toast(`Chat ${this.data.title} deleted successfully`, ToasterMessageTypes.info);
                window.router.go('/#/chat');
            })
                .catch((error) => {
                toaster.bakeError(error);
            });
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (!form) {
                throw new Error(`form '${formName}' is not exist`);
            }
            const formData = new FormData(form);
            if (!this.methods.isAvatarChanged(formName)) {
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
            const fileInput = document.getElementById('avatarInput');
            if (fileInput)
                fileInput.value = '';
        },
        // Превью аватара с обработкой ошибок
        loadImage() {
            const fileInput = document.getElementById('chatAvatarInput');
            const avatarPreview = document.getElementById('chatAvatarPreview');
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
        fillForm() {
            if (!this.isVisible())
                return;
            if (!store.state.currentChat.id) {
                setTimeout(() => window.router.go('/#/chat'), 100);
                return;
            }
            Object.assign(this.data, store.state.currentChat);
            if (store.state.currentChat.avatar === null) {
                this.data.avatar = this.data.emptyAvatar;
            }
            else {
                this.data.avatar = backendUrl + store.state.currentChat.avatar;
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
    },
});
export default chatEdit;
//# sourceMappingURL=index.js.map