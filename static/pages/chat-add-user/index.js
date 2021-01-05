import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import eventBus from "../../lib/event-bus.js";
import store from "../../lib/store.js";
import { CONST } from "../../lib/const.js";
import userController from "../../controllers/user.js";
import chatsController from "../../controllers/chats.js";
import toaster from "../../lib/toaster.js";
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
            chatsController.addUser(this.data.userId)
                .then(() => {
                this.data.userId = 0;
                this.data.userName = '';
                this.data.allowInvite = false;
                eventBus.emit(CONST.chatChange);
                window.router.go('/#/chat');
            })
                .catch(() => {
                this.data.allowInvite = false;
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
            userController.findUsers(this.data.userName)
                .then((users) => {
                const res = [];
                if (!Array.isArray(users))
                    throw new Error('response result is not array');
                for (let i = 0; i < users.length; i += 1) {
                    res.push(users[i].login);
                }
                const index = res.indexOf(this.data.userName);
                if (index !== -1) {
                    this.data.allowInvite = true;
                    this.data.userId = users[index].id;
                }
                else {
                    this.data.allowInvite = false;
                    this.data.possibleNames = res;
                }
            }).catch((error) => {
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