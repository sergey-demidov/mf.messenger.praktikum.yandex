import eventBus from "./event-bus.js";
import { cloneDeep, CONST } from "./utils.js";
class Store {
    constructor() {
        this.eventBus = eventBus;
        this.handler = {
            get(target, key) {
                return target[key];
            },
            set(target, key, value) {
                // eslint-disable-next-line no-param-reassign
                target[key] = value;
                eventBus.emit(CONST.update);
                return true;
            },
            deleteProperty(target, key) {
                throw new Error(`Cant delete property ${key} from ${target}`);
            },
        };
        this.initUser = {
            id: 0,
            first_name: '',
            second_name: '',
            display_name: '',
            login: '',
            email: '',
            phone: '',
            avatar: '',
        };
        this.state = {
            currentUser: new Proxy(cloneDeep(this.initUser), this.handler),
            currentChat: new Proxy({
                id: 0,
                title: '',
                avatar: '',
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