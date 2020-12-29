import eventBus from "./event-bus.js";
import { CONST } from "./utils.js";
class Store {
    constructor() {
        this.eventBus = eventBus;
        this.initState = {
            currentUser: {
                id: 0,
                first_name: '',
                second_name: '',
                display_name: '',
                login: '',
                email: '',
                phone: '',
                avatar: '',
            },
            currentChat: {
                id: 0,
                title: '',
                avatar: '',
            },
        };
        this.state = {
            currentUser: {},
            currentChat: {},
        };
        this.makeProxy = (data) => new Proxy(data, {
            get(target, prop) {
                return target[prop];
            },
            set: (target, prop, value) => {
                // eslint-disable-next-line no-param-reassign
                target[prop] = value;
                this.eventBus.emit(CONST.update);
                return true;
            },
            deleteProperty(target, prop) {
                throw new Error(`Cant delete property ${prop} from ${target}`);
            },
        });
        if (Store.instance) {
            return Store.instance;
        }
        Store.instance = this;
        this.state.currentUser = this.makeProxy(this.initState.currentUser);
        this.state.currentChat = this.makeProxy(this.initState.currentChat);
    }
}
//   validator = {
//     get(target: Record<string, string>, key: string): string {
//       return target[key];
//     },
//     set(target: Record<string, unknown>, key: string, value: string | number): boolean {
//       // eslint-disable-next-line no-param-reassign
//       target[key] = value;
//       return true;
//     },
//     deleteProperty(target: Record<string, unknown>, key: string): boolean {
//       throw new Error(`Cant delete property ${key} from ${target}`);
//     },
//   }
// }
const store = new Store();
export default store;
//# sourceMappingURL=store.js.map