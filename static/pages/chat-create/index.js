import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import Toaster, { ToasterMessageTypes } from "../../lib/toaster.js";
import { formDataToObject } from "../../lib/utils.js";
import chatsController from "../../controllers/chats.js";
const toaster = new Toaster();
const createChat = sue({
    name: 's-app-chat-create-modal',
    authorisationRequired: true,
    template,
    data() {
        return {
            title: '',
        };
    },
    methods: {
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
            const formData = new FormData(form);
            const res = formDataToObject(formData);
            res.title = res.title.trim();
            chatsController.createChat(res)
                .then(() => {
                toaster.toast(`Chat ${this.data.title} created successfully`, ToasterMessageTypes.info);
                this.data.title = '';
                window.router.back();
            });
        },
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
    },
});
export default createChat;
//# sourceMappingURL=index.js.map