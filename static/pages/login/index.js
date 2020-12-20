import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
const login = sue({
    name: 's-app-login-modal',
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
    mounted: () => {
        console.dir('login mounted');
    },
});
export default login;
//# sourceMappingURL=index.js.map