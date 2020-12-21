import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
const password = sue({
    name: 's-app-password-modal',
    template,
    data() {
        return {
            newPassword: '',
        };
    },
    methods: {
        concat(...args) {
            return args.join('');
        },
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            console.log(`formIsValid ${formName}`);
            console.log(form.checkValidity());
            return form.checkValidity();
        },
        submitForm(formName) {
            console.log('submitForm');
            const form = document.forms.namedItem(formName);
            if (this.methods.formIsValid(formName)) { // validate
                const formData = new FormData(form);
                const res = Array.from(formData.entries()).reduce((memo, pair) => (Object.assign(Object.assign({}, memo), { [pair[0]]: pair[1] })), {});
                // eslint-disable-next-line no-console
                console.dir(res); // print result
            }
            else {
                // eslint-disable-next-line no-console
                console.log('form is not valid');
            }
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default password;
//# sourceMappingURL=index.js.map