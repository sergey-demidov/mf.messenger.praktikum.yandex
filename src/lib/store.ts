import eventBus from './event-bus';
import { CONST } from './const';

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

const chat = {
  id: 0,
  title: '',
  avatar: '',
  created_by: 0,
  token: '',
};

class Store {
  eventBus = eventBus;

  constructor() {
    if (Store.instance) {
      return Store.instance;
    }
    Store.instance = this;
  }

  handler = {
    get(target: Record<string, string>, key: string): string {
      return target[key];
    },
    set(target: Record<string, unknown>, key: string, value: string | number): boolean {
      if (typeof target[key] === CONST.undefined) {
        // eslint-disable-next-line no-console
        if (window.debug) console.warn(`key '${key}' undefined in store '${target}'`);
      }
      // eslint-disable-next-line no-param-reassign
      target[key] = value;
      eventBus.emit(CONST.update);
      return true;
    },
    deleteProperty(target: Record<string, unknown>, key: string): boolean {
      throw new Error(`Cant delete property ${key} from ${target}`);
    },
  }

  state = {
    currentUser: new Proxy(<Record<string, string | number>>user, this.handler),
    currentMember: new Proxy(<Record<string, string | number>>chatMember, this.handler),
    currentChat: new Proxy(<Record<string, string | number>>chat, this.handler),
  }

  private static instance: Store;
}

const store = new Store();

export default store;
