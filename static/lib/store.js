import eventBus from "./event-bus.js";
import { CONST } from "./utils.js";
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
                console.log(`set ${key} => ${value}`);
                eventBus.emit(CONST.update);
                return true;
            },
            deleteProperty(target, key) {
                throw new Error(`Cant delete property ${key} from ${target}`);
            },
        };
        // initUser = {
        //   id: 0,
        //   first_name: '',
        //   second_name: '',
        //   display_name: '',
        //   login: '',
        //   email: '',
        //   phone: '',
        //   // avatar: '',
        // }
        //
        this.state = {
            currentUser: new Proxy({}, this.handler),
            currentMember: new Proxy({}, this.handler),
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