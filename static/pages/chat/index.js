import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
const chat = sue({
    name: 's-app-chat',
    template,
    data() {
        return {};
    },
    methods: {
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            const formData = new FormData(form);
            const res = Array.from(formData.entries()).reduce((memo, pair) => (Object.assign(Object.assign({}, memo), { [pair[0]]: pair[1] })), {});
            // eslint-disable-next-line no-console
            console.dir(res); // print result
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default chat;
//# sourceMappingURL=index.js.map