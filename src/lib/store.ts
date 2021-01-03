import eventBus from './event-bus';
import { CONST } from './utils';

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
    currentUser: new Proxy(<Record<string, string | number>>{}, this.handler),
    currentMember: new Proxy(<Record<string, string | number>>{}, this.handler),
    currentChat: new Proxy({
      id: 0,
      title: '',
      avatar: '',
      created_by: 0,
    }, this.handler),
  }

  private static instance: Store;
}

const store = new Store();

export default store;
