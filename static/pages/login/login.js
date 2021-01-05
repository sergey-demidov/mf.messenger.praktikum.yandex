import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import { formDataToObject } from "../../lib/utils.js";
import toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import authController from "../../controllers/auth.js";
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
            if (!this.methods.formIsValid(formName)) { // validate
                toaster.bakeError('form is not valid');
                return;
            }
            const formData = new FormData(form);
            const res = formDataToObject(formData);
            authController.signIn(res)
                .then((result) => {
                this.data.password = '';
                if (result) {
                    toaster.toast('Logged in successfully', ToasterMessageTypes.info);
                    window.router.go('/#/chat');
                }
            });
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default login;
//# sourceMappingURL=login.js.map