import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import sChatDisplay from "../../components/chat-display.js";
import sChatMember from "../../components/chat-member.js";
import { CONST, isJsonString } from "../../lib/utils.js";
import ChatsAPI from "../../api/chats.js";
import Toaster from "../../lib/toaster.js";
import eventBus from "../../lib/event-bus.js";
import store from "../../lib/store.js";
const chatsApi = new ChatsAPI();
const toaster = new Toaster();
const chat = sue({
    name: 's-app-chat',
    authorisationRequired: true,
    template,
    data() {
        return {
            chats: [],
            chatMembers: [],
            message: '',
        };
    },
    methods: {
        getChats() {
            if (!this.isVisible())
                return;
            const that = this;
            chatsApi.getChats()
                .then((response) => {
                if (response.status === 200 && isJsonString(response.response)) {
                    return JSON.parse(response.response);
                }
                throw new Error('Getting chats failed');
            })
                .then((c) => {
                const chats = c;
                that.data.chats.length = Object.keys(chats).length;
                Object.keys(chats).forEach((key, index) => {
                    that.data.chats[index] = JSON.stringify(chats[key]);
                });
                eventBus.emit(CONST.update);
            }).catch((error) => {
                toaster.bakeError(error);
            });
        },
        isChatSelected() {
            return store.state.currentChat.id > 0;
        },
        getMembers() {
            console.log('getMembers');
            // if (!(this as sApp).isVisible()) return;
            const that = this;
            chatsApi.getChatUsers(store.state.currentChat.id)
                .then((response) => {
                if (response.status === 200 && isJsonString(response.response)) {
                    return JSON.parse(response.response);
                }
                throw new Error('Getting users failed');
            })
                .then((m) => {
                const members = m;
                that.data.chatMembers.length = Object.keys(members).length;
                Object.keys(members).forEach((key, index) => {
                    that.data.chatMembers[index] = JSON.stringify(members[key]);
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
        eventBus.on(CONST.chatChange, () => this.methods.getMembers());
    },
    components: {
        's-input': sInput,
        's-btn': sButton,
        's-user': sUser,
        's-chat-display': sChatDisplay,
        's-chat-member': sChatMember,
    },
});
export default chat;
//# sourceMappingURL=index.js.map