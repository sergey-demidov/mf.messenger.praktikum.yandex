import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import { formDataToObject } from "../../lib/utils.js";
import UserAPI from "../../api/user.js";
const userAPI = new UserAPI();
const toaster = new Toaster();
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
                toaster.toast('Error: form is not valid', ToasterMessageTypes.error);
                return;
            }
            if (this.data.newPassword !== this.data.newPasswordAgain) {
                toaster.toast('Error: passwords is not match', ToasterMessageTypes.error);
                return;
            }
            const formData = new FormData(form);
            const res = formDataToObject(formData);
            res.display_name = res.first_name;
            userAPI.changePassword(res)
                .then((response) => {
                if (response.status !== 200) {
                    throw new Error(response.response);
                }
                toaster.toast('Password saved successfully', ToasterMessageTypes.info);
                this.data.oldPassword = '';
                this.data.newPassword = '';
                this.data.newPasswordAgain = '';
                window.router.back();
            })
                .catch((error) => {
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