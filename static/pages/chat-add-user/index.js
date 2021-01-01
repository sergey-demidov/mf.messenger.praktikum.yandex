import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import Toaster from "../../lib/toaster.js";
import eventBus from "../../lib/event-bus.js";
import ChatsAPI from "../../api/chats.js";
import store from "../../lib/store.js";
import { CONST, isJsonString } from "../../lib/utils.js";
import UserAPI from "../../api/user.js";
const chatsAPI = new ChatsAPI();
const toaster = new Toaster();
const userApi = new UserAPI();
const addUser = sue({
    name: 's-app-chat-add-user-modal',
    template,
    authorisationRequired: true,
    data() {
        return {
            userName: '',
            userId: 0,
            title: '',
            possibleNames: [],
            allowInvite: false,
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
        matchUser() {
            return true;
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (!form) {
                throw new Error(`form '${formName}' is not exist`);
            }
            chatsAPI.addUsers({
                users: [
                    this.data.userId,
                ],
                chatId: store.state.currentChat.id,
            })
                .then((response) => {
                if (response.status !== 200) {
                    throw new Error(response.response);
                }
                this.data.userId = 0;
                this.data.userName = '';
                eventBus.emit(CONST.chatChange);
                window.router.go('/#/chat');
            })
                .catch((error) => {
                toaster.bakeError(error);
            });
        },
        checkChat() {
            if (!this.isVisible())
                return;
            if (!store.state.currentChat.id) {
                setTimeout(() => window.router.go('/#/chat'), 100);
                return;
            }
            if (!this.data.title) {
                this.data.title = store.state.currentChat.title;
            }
        },
        fillForm(...args) {
            const [validateResult] = args;
            if (!this.isVisible())
                return;
            if (validateResult !== CONST.true || this.data.userName.length === 0) {
                this.data.possibleNames = [];
                return;
            }
            userApi.findUsers({ login: this.data.userName })
                .then((response) => {
                if (response.status === 200 && isJsonString(response.response)) {
                    return JSON.parse(response.response);
                }
                throw new Error(response.response);
            })
                .then((users) => {
                const res = [];
                if (!Array.isArray(users))
                    throw new Error('response result is not array');
                for (let i = 0; i < users.length; i += 1) {
                    res.push(users[i].login);
                }
                if (res.length === 1 && res[0] === this.data.userName) {
                    this.data.allowInvite = true;
                    this.data.userId = users[0].id;
                }
                else {
                    this.data.allowInvite = false;
                    this.data.possibleNames = res;
                    console.dir(users);
                }
            })
                .catch((error) => {
                toaster.bakeError(error);
            });
        },
    },
    created() {
        eventBus.on(CONST.validateFinished, (args) => this.methods.fillForm(args));
        eventBus.on(CONST.hashchange, () => this.methods.checkChat());
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default addUser;
//# sourceMappingURL=index.js.map