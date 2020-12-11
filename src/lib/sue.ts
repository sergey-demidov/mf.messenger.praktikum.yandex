/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-empty-function, no-param-reassign, class-methods-use-this, no-restricted-syntax */
import EventBus from './event-bus.js';
import { sInit, sParsed } from './types';

declare global {
  interface Window {
    sApp: HTMLElement;
  }
}

const sue = (i: Record<string, unknown>): CustomElementConstructor => {
  // need to merge with incomplete init definitions
  const emptyInit: sInit = {
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
    EventBus: EventBus;

    protected data: Record<string, unknown>

    methods: Record<string, Function>;

    protected rendering = false;

    // template: HTMLElement;

    init: () => sInit

    constructor() {
      super();
      window.sApp = this;
      this.init = () => init;
      // this.init = this.init.bind(this);
      this.EventBus = new EventBus();
      this.EventBus.on('update', this.update);
      this.EventBus.on('dataChange', this.setData);

      // define each components
      Object.keys(init.components).forEach((key) => {
        if (!window.customElements.get(key)) {
          customElements.define(key, init.components[key]);
        }
      });
      this.init().methods._get = (param: string): string => param;
      this.methods = {};
      Object.keys(this.init().methods).forEach((key) => {
        this.methods[key] = this.init().methods[key].bind(this);
      });

      this.data = new Proxy(init.data(), {
        get(target, prop: string) {
          return target[prop];
        },
        set: (target, prop: string, value) => {
          if (this.rendering) {
            // eslint-disable-next-line no-console
            console.log(`%c Setting data property '${prop}' ('${target[prop]}' => '${value}') during render `,
              'background: #333; color: #f55');
          }
          target[prop] = value;
          this.EventBus.emit('update');
          return true;
        },
        deleteProperty(target, prop: string) {
          throw new Error(`Cant delete property ${prop} from ${target}`);
        },
      });

      this.innerHTML = init.template;

      this.init().created = this.init().created.bind(this);
      this.init().mounted = this.init().mounted.bind(this);

      this.init().created();
      this.EventBus.emit('update');
    }

    // dataChange event handler
    protected setData = (...args: string[]) => {
      const [variable, value] = args;
      // console.log(`sue setData '${variable}' => '${value}'`)
      if (!Object.hasOwnProperty.call(this.data, variable)) {
        throw new Error(`${variable} undefined`);
      }
      this.data[variable] = value;
    }

    // update event handler
    protected update = () => {
      if (!this.rendering) this.render();
    }

    // get result from user defined methods
    protected run(parsed: sParsed): string {
      if (!this.methods[parsed.func]) {
        throw new Error(`Method ${parsed.func} is not defined`);
      }
      const res = this.methods[parsed.func](...parsed.params.map((e) => {
        // param is plain string
        const stringRes = e.match(/^['"]([a-z0-9_]+)['"]$/i);
        if (stringRes) {
          return stringRes[1];
        }
        // param is undefined data property
        if (typeof this.data[e] === 'undefined') {
          throw new Error(`${e} undefined`);
        }
        // param is data property
        return this.data[e];
      }));
      return (parsed.not ? !res : res).toString();
    }

    // это не оптимальный метод и точно не окончательный
    // он работает напрямую с ДОМ и не учитывает вложенность
    // был создан только для отработки динамических атрибутов.
    protected render(): void {
      this.rendering = true;
      const content = this.querySelectorAll('*');
      [].forEach.call(content, (element: HTMLElement) => { // each element in template
        const el = element;
        const { attributes } = el;
        [].forEach.call(attributes, (a: Attr) => { // each attribute
          const attribute = a.name;
          if (attribute.charAt(0) === ':') { // dynamic props
            const parsed = this.parse(el.getAttribute(attribute) || '');
            const native = attribute.substring(1);
            const res = this.run(parsed);
            switch (native) {
              case 'text':
                el.innerText = res;
                break;
              case 'disabled':
                (el as HTMLInputElement).disabled = (res === 'true');
                break;
              default:
                el.setAttribute(native, res);
            }
          }
          if (attribute.charAt(0) === '@') { // inline event handlers
            const parsed = this.parse(el.getAttribute(attribute) || '');
            if (this.methods[parsed.func]) {
              // работает правильно, но нарушает слабую связанность. Будет реализован через addEventListener
              el.setAttribute(`on${attribute.substring(1)}`, `sApp.methods.${el.getAttribute(attribute)}`);
            } else {
              throw new Error(`Method ${parsed.func} does not exist`);
            }
          }
        });
      });
      this.rendering = false;
    }

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
      this.init().mounted();
    }

    disconnectedCallback() {
      this.EventBus.off('update', this.update);
      this.EventBus.off('dataChange', this.setData);
    }
  };
  customElements.define('s-app', app);
  return app;
};

export default sue;
