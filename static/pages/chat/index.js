import sue from "../../lib/sue.js";
import sInput from "../../components/input.js";
import sButton from "../../components/button.js";
import template from "./template.js";
import sUser from "../../components/user.js";
import sChatDisplay from "../../components/chat-display.js";
import sChatMember from "../../components/chat-member.js";
import eventBus from "../../lib/event-bus.js";
import store from "../../lib/store.js";
import { CONST } from "../../lib/const.js";
import chatsController from "../../controllers/chats.js";
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
        deleteUser() {
            chatsController.deleteUsers();
        },
        getChats() {
            if (!this.isVisible())
                return;
            chatsController.getChats()
                .then((c) => {
                const chats = c;
                this.data.chats.length = Object.keys(chats).length;
                let currentChatPresent = false;
                Object.keys(chats).forEach((key, index) => {
                    if (chats[key].id === store.state.currentChat.id)
                        currentChatPresent = true;
                    this.data.chats[index] = JSON.stringify(chats[key]);
                });
                if (!currentChatPresent) {
                    store.state.currentChat.id = 0;
                }
                eventBus.emit(CONST.chatChange);
            });
        },
        isChatSelected() {
            return store.state.currentChat.id > 0;
        },
        getMembers() {
            if (!store.state.currentChat.id || store.state.currentChat.id === 0) {
                this.data.chatMembers = [];
                return;
            }
            chatsController.getChatUsers()
                .then((m) => {
                const members = m;
                this.data.chatMembers.length = Object.keys(members).length;
                Object.keys(members).forEach((key, index) => {
                    this.data.chatMembers[index] = JSON.stringify(members[key]);
                });
                eventBus.emit(CONST.update);
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