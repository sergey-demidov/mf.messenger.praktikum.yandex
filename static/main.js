import sue from './lib/sue.js';
import sInput from './components/input.js';
import sButton from './components/button.js';
sue({
    methods: {
        formIsValid(formName) {
            const form = document.forms.namedItem(formName);
            return form.checkValidity();
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            if (this.formIsValid(formName)) {
                const formData = new FormData(form);
                const res = {};
                for (const pair of formData.entries()) {
                    const [key, val] = pair;
                    res[key] = val;
                }
                // eslint-disable-next-line no-console
                console.dir(res);
            }
            else {
                // eslint-disable-next-line no-console
                console.log('form is not valid');
            }
        },
    },
    created() {
        this.EventBus.on('validate', this.update);
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
//# sourceMappingURL=main.js.map