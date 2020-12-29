import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import { CONST, formDataToObject, isJsonString } from "../../lib/utils.js";
import { baseUrl } from "../../lib/http-transport.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import AuthAPI from "../../api/auth.js";
import eventBus from "../../lib/event-bus.js";
import store from "../../lib/store.js";
const auth = new AuthAPI();
const toaster = new Toaster();
const login = sue({
    name: 's-app-login',
    template,
    data() {
        return {
            login: '',
            password: '',
        };
    },
    methods: {
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            return form.checkValidity();
        },
        fillUser() {
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
                Object.assign(store.state.currentUser, user);
                eventBus.emit(CONST.update);
            }).catch((error) => {
                toaster.bakeError(error);
            });
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (this.methods.formIsValid(formName)) { // validate
                const formData = new FormData(form);
                const res = formDataToObject(formData);
                auth.signIn(res)
                    .then((response) => {
                    this.data.password = '';
                    if (response.status !== 200) {
                        throw new Error(response.response);
                    }
                    toaster.toast('Logged in successfully', ToasterMessageTypes.info);
                    this.methods.fillUser();
                    window.router.go('/#/chat');
                })
                    .catch((error) => {
                    if (error.message && error.message === 'user already in system') {
                        window.router.go('/#/chat');
                    }
                    else {
                        toaster.bakeError(error);
                    }
                });
            }
            else {
                toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
            }
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default login;
//# sourceMappingURL=login.js.map