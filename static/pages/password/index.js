import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import toaster from "../../lib/toaster.js";
import { formDataToObject } from "../../lib/utils.js";
import userController from "../../controllers/user.js";
const password = sue({
    name: 's-app-password-modal',
    template,
    authorisationRequired: true,
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            newPasswordAgain: '',
        };
    },
    methods: {
        concat(...args) {
            return args.join('');
        },
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            return form.checkValidity();
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (!form) {
                throw new Error(`form '${formName}' is not exist`);
            }
            if (!this.methods.formIsValid(formName)) { // validate
                toaster.bakeError('form is not valid');
                return;
            }
            if (this.data.newPassword !== this.data.newPasswordAgain) {
                toaster.bakeError('passwords is not match');
                return;
            }
            const formData = new FormData(form);
            const res = formDataToObject(formData);
            userController.changePassword(res)
                .then(() => {
                toaster.toast('Password saved successfully');
                this.data.oldPassword = '';
                this.data.newPassword = '';
                this.data.newPasswordAgain = '';
                window.router.back();
            }).catch((error) => {
                toaster.bakeError(error);
            });
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default password;
//# sourceMappingURL=index.js.map