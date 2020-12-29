import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import sChatDisplay from "../../components/chat-display.js";
import { CONST, isJsonString } from "../../lib/utils.js";
import ChatsAPI from "../../api/chats.js";
import Toaster from "../../lib/toaster.js";
import eventBus from "../../lib/event-bus.js";
const chatsApi = new ChatsAPI();
const toaster = new Toaster();
const chat = sue({
    name: 's-app-chat',
    template,
    data() {
        return {
            chats: [],
            message: '',
        };
    },
    methods: {
        getChats() {
            if (!this.isVisible())
                return;
            chatsApi.getChats()
                .then((response) => {
                if (response.status === 200 && isJsonString(response.response)) {
                    return JSON.parse(response.response);
                }
                throw new Error('Getting chats failed');
            })
                .then((c) => {
                const chats = c;
                this.data.chats = [];
                Object.keys(chats).forEach((key) => {
                    this.data.chats.push(JSON.stringify(chats[key]));
                });
                eventBus.emit(CONST.update);
            }).catch((error) => {
                toaster.bakeError(error);
            });
        },
        submitForm(formName) {
            const form = document.forms.namedItem(formName);
            const formData = new FormData(form);
            const res = Array.from(formData.entries()).reduce((memo, pair) => (Object.assign(Object.assign({}, memo), { [pair[0]]: pair[1] })), {});
            // eslint-disable-next-line no-console
            console.dir(res); // print result
        },
    },
    mounted() {
        console.log('CHATS mounted');
    },
    created() {
        eventBus.on(CONST.hashchange, () => this.methods.getChats());
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
        's-user': sUser,
        's-chat-display': sChatDisplay,
    },
});
export default chat;
//# sourceMappingURL=index.js.map