import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import { formDataToObject, isJsonString } from "../../lib/utils.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import AuthAPI from "../../api/auth.js";
import auth from "../../controllers/auth.js";
import { backendUrl } from "../../lib/const.js";
const authAPI = new AuthAPI();
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
            authAPI.getUser()
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
                auth.fillUserState().then(() => window.router.go('/#/chat'));
            }).catch((error) => {
                toaster.bakeError(error);
            });
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (this.methods.formIsValid(formName)) { // validate
                const formData = new FormData(form);
                const res = formDataToObject(formData);
                authAPI.signIn(res)
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