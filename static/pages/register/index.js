import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import AuthAPI from "../../api/auth.js";
import { formDataToObject } from "../../lib/utils.js";
const auth = new AuthAPI();
const toaster = new Toaster();
const register = sue({
    name: 's-app-register-modal',
    template,
    data() {
        return {
            password: '',
            toaster: HTMLElement,
        };
    },
    methods: {
        // onReset(): void {
        //   (this as sApp).EventBus.emit('reset');
        // },
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            return form.checkValidity();
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (this.methods.formIsValid(formName)) { // validate
                const formData = new FormData(form);
                const res = formDataToObject(formData);
                auth.signUp(res)
                    .then((response) => {
                    this.data.password = '';
                    if (response.status === 200) {
                        return response;
                    }
                    throw new Error(response.response);
                })
                    .then(() => {
                    window.router.go('/#/');
                    toaster.toast('Logged in successfully', ToasterMessageTypes.info);
                })
                    .catch((error) => {
                    toaster.bakeError(error);
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
export default register;
//# sourceMappingURL=index.js.map