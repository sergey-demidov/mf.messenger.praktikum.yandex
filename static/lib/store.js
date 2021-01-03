import eventBus from "./event-bus.js";
import { CONST } from "./const.js";
const user = {
    id: 0,
    first_name: '',
    second_name: '',
    display_name: '',
    login: '',
    email: '',
    phone: '',
    avatar: '',
};
const chatMember = {
    id: 0,
    first_name: '',
    second_name: '',
    display_name: '',
    login: '',
    email: '',
    phone: '',
    avatar: '',
    role: '',
};
class Store {
    constructor() {
        this.eventBus = eventBus;
        this.handler = {
            get(target, key) {
                return target[key];
            },
            set(target, key, value) {
                if (typeof target[key] === CONST.undefined) {
                    // eslint-disable-next-line no-console
                    console.warn(`key '${key}' undefined in store '${target}'`);
                }
                // eslint-disable-next-line no-param-reassign
                target[key] = value;
                eventBus.emit(CONST.update);
                return true;
            },
            deleteProperty(target, key) {
                throw new Error(`Cant delete property ${key} from ${target}`);
            },
        };
        this.state = {
            currentUser: new Proxy(user, this.handler),
            currentMember: new Proxy(chatMember, this.handler),
            currentChat: new Proxy({
                id: 0,
                title: '',
                avatar: '',
                created_by: 0,
            }, this.handler),
        };
        if (Store.instance) {
            return Store.instance;
        }
        Store.instance = this;
    }
}
const store = new Store();
export default store;
//# sourceMappingURL=store.js.map