import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import { formDataToObject } from "../../lib/utils.js";
import authController from "../../controllers/auth.js";
const register = sue({
    name: 's-app-register',
    template,
    data() {
        return {
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
            if (!this.methods.formIsValid(formName)) { // validate
                toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
                return;
            }
            const formData = new FormData(form);
            const res = formDataToObject(formData);
            authController.signUp(res)
                .then(() => {
                this.data.password = '';
                window.router.go('/#/chat');
                toaster.toast('Logged in successfully', ToasterMessageTypes.info);
            });
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default register;
//# sourceMappingURL=index.js.map