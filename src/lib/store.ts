import eventBus from './event-bus';
import { CONST } from './utils';

class Store {
  eventBus = eventBus;

  protected initState = {
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
  }

  state = {
    currentUser: {},
    currentChat: {},
  }

  private static instance: Store;

  constructor() {
    if (Store.instance) {
      return Store.instance;
    }
    Store.instance = this;
    this.state.currentUser = this.makeProxy(this.initState.currentUser);
    this.state.currentChat = this.makeProxy(this.initState.currentChat);
  }

  protected makeProxy = (data: Record<string, unknown>) => new Proxy(data, {
    get(target, prop: string) {
      return target[prop];
    },
    set: (target, prop: string, value) => {
      // eslint-disable-next-line no-param-reassign
      target[prop] = value;
      this.eventBus.emit(CONST.update);
      return true;
    },
    deleteProperty(target, prop: string) {
      throw new Error(`Cant delete property ${prop} from ${target}`);
    },
  })
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
