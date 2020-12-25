import EventBus from './event-bus';
import {
  sInit, sParsed, sCustomElementConstructor, sEvents, sHTMLElement,
} from './types';
import { CONST, hash8 } from './utils';
import Queue from './queue';

declare global {
  interface Window {
    sApp: HTMLElement;
  }
}

const sue = (i: Record<string, unknown>): sCustomElementConstructor => {
  // need to merge with incomplete init definitions
  const emptyInit: sInit = {
    name: '',
    template: '',
    data: () => ({}),
    components: {},
    methods: {},
    created: () => ({}),
    mounted: () => ({}),
    destroyed: () => ({}),
  };

  const init: sInit = { ...emptyInit, ...i };

  const app = class extends HTMLElement {
    EventBus: EventBus = new EventBus();

    name = ''

    protected data: Record<string, unknown> = {}

    // eslint-disable-next-line @typescript-eslint/ban-types
    methods: Record<string, Function> = {};

    protected rendering = false;

    protected connected = false;

    protected active = false

    renderQueue = new Queue<string>()

    init = emptyInit;

    // id = hash8()

    constructor() {
      super();
      this.createResources();
    }

    createResources = () => {
      this.init = init;
      this.name = init.name;
      if (!this.name) throw new Error('Component name is not defined');
      setInterval(() => this.delayedUpdate(), 100);

      this.EventBus.on(CONST.update, this.update);
      this.EventBus.on('dataChange', this.setData);

      // define each components
      Object.keys(init.components).forEach((key) => {
        if (!window.customElements.get(key)) {
          customElements.define(key, init.components[key]);
        }
      });
      this.init.methods._get = (param: string): string => param;
      Object.keys(this.init.methods).forEach((key) => {
        console.log(key);
        this.methods[key] = this.init.methods[key].bind(this);
      });

      this.data = this.makeProxy(init.data());

      this.init.created = this.init.created.bind(this);
      this.init.mounted = this.init.mounted.bind(this);

      this.init.created();
    }

    // dataChange eventBus handler
    protected setData = (...args: string[]) => {
      const [variable, value] = args;
      if (Object.hasOwnProperty.call(this.data, variable)) {
        this.data[variable] = value;
      }
    }

    // update eventBus handler
    // когда изменяются данные - запускаем рендер
    // если они прилетают пачкой - ставим в очередь
    protected update = () => {
      if (!this.rendering) {
        this.rendering = true;
        this.render();
        this.rendering = false;
      } else {
        this.renderQueue.enqueue('update');
      }
    }

    // setInterval handler
    // если очередь не пустая - очищает очередь и запускает render
    protected delayedUpdate = () => {
      if (!this.rendering && !this.renderQueue.isEmpty()) {
        // eslint-disable-next-line no-console
        console.warn(`delayedUpdate: ${this.renderQueue.size} queued`);
        while (!this.renderQueue.isEmpty()) {
          this.renderQueue.dequeue();
        }
        this.render();
      }
    }

    protected makeProxy = (data: Record<string, unknown>) => new Proxy(data, {
      get(target, prop: string) {
        return target[prop];
      },
      set: (target, prop: string, value) => {
        // eslint-disable-next-line no-param-reassign
        target[prop] = value;
        this.EventBus.emit(CONST.update);
        return true;
      },
      deleteProperty(target, prop: string) {
        throw new Error(`Cant delete property ${prop} from ${target}`);
      },
    })

    // get result from user defined methods
    protected run = (parsed: sParsed) => {
      if (!this.methods[parsed.func]) {
        throw new Error(`Method ${parsed.func} is not defined`);
      }
      let res = this.methods[parsed.func](...parsed.params.map((e) => {
        // param is plain string
        const stringRes = e.match(/^['"]([a-z0-9_: ]+)['"]$/i);
        if (stringRes) {
          return stringRes[1];
        }
        // param is undefined data property
        if (typeof this.data[e] === CONST.undefined) {
          throw new Error(`${e} undefined`);
        }
        // param is data property
        return this.data[e];
      }));
      // method returns undef
      if (typeof res === CONST.undefined) {
        res = false;
      }
      return (parsed.not ? !res : res).toString();
    }

    protected isVisible():boolean {
      const style = window.getComputedStyle(this);
      return (style.visibility === CONST.visible);
    }

    // TODO: метод не оптимален - работает напрямую с DOM
    protected render = (e: sHTMLElement = this) => {
      if (!this.isVisible() || e.nodeType !== 1) return;
      const element = <HTMLElement>e;
      const { attributes } = element;
      Array.from(attributes).forEach((a) => { // each attribute
        const attribute = a.name;
        if (attribute.charAt(0) === ':') { // dynamic props
          const parsed = this.parse(element.getAttribute(attribute) || '');
          const native = attribute.substring(1);
          const res = this.run(parsed);
          switch (native) {
            case 'text':
              element.innerText = res;
              break;
            case 'disabled':
              if (element instanceof HTMLInputElement) {
                element.disabled = (res === 'true');
              }
              break;
            default:
              element.setAttribute(native, res);
          }
        }
        if (attribute.charAt(0) === '@') { // inline event handlers
          const parsed = this.parse(element.getAttribute(attribute) || '');
          if (!this.methods[parsed.func]) throw new Error(`Method '${parsed.func}' does not exist`);
          const eventHandler = `on${attribute.substring(1)}`;
          if (!(eventHandler in element)) throw new Error(`event handler '${eventHandler}' does not exist`);
          element[eventHandler as sEvents] = () => this.run(parsed);
        }
      });
      Array.from(e.childNodes).forEach((child) => this.render(child as sHTMLElement));
    }

    // eslint-disable-next-line class-methods-use-this
    parse(str: string): sParsed {
      const result: sParsed = { not: false, func: '', params: [] };
      let not = '';
      const regFunc = new RegExp(/^\s*(!?)\s*([a-z0-9_]+)\(([^)]*)\)\s*$/i); // some_func(a,b), !some_func()
      const func = str.match(regFunc);
      if (func) {
        let strParams;
        [, not, result.func, strParams] = func;
        result.params = strParams.split(',').filter((r) => r !== '').map((e) => e.trim());
        result.not = (not === '!');
        return result;
      }
      const regVariable = new RegExp(/^\s*(!?)\s*([a-z0-9_]+)\s*$/i); // some_variable, !some_variable
      const variable = str.match(regVariable);
      if (variable) {
        result.func = '_get';
        [, not, result.params[0]] = variable;
        result.not = not === '!';
        return result;
      }
      throw new Error(`Cant parse string '${str}'`);
    }

    connectedCallback() {
      this.innerHTML = init.template;
      this.connected = true;
      this.init.mounted();
    }

    show = () => {
      this.style.display = CONST.block;
      this.style.visibility = CONST.visible;
      this.active = true;
      this.EventBus.emit(CONST.update);
    }

    hide = () => {
      this.style.display = CONST.none;
      this.style.visibility = CONST.hidden;
      this.active = false;
    }
  };
  customElements.define(init.name, app);
  return { constructor: app, name: init.name };
};

// export app;

export default sue;
