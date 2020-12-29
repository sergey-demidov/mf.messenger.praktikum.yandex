import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import { formDataToObject } from "../../lib/utils.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import AuthAPI from "../../api/auth.js";
import eventBus from "../../lib/event-bus.js";
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
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (this.methods.formIsValid(formName)) { // validate
                const formData = new FormData(form);
                const res = formDataToObject(formData);
                auth.signIn(res)
                    .then((response) => {
                    eventBus.emit('dataChange', 'password', '');
                    if (response.status === 200) {
                        return response;
                    }
                    // if (isJsonString(response.response)) {
                    //   throw new Error(JSON.parse(response.response).reason);
                    // }
                    throw new Error(response.response);
                })
                    .then(() => {
                    window.router.go('/#/chat');
                    toaster.toast('Logged in successfully', ToasterMessageTypes.info);
                })
                    .catch((error) => {
                    if (error.message && error.message === 'user already in system') {
                        window.router.go('/#/');
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
//# sourceMappingURL=index.js.map