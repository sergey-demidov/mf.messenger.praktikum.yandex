import EventBus from "./event-bus.js";
import { CONST } from "./utils.js";
import Queue from "./queue.js";
const sue = (i) => {
    // need to merge with incomplete init definitions
    const emptyInit = {
        name: '',
        template: '',
        data: () => ({}),
        components: {},
        methods: {},
        created: () => ({}),
        mounted: () => ({}),
        destroyed: () => ({}),
    };
    const init = Object.assign(Object.assign({}, emptyInit), i);
    const app = class extends HTMLElement {
        constructor() {
            super();
            this.rendering = false;
            this.connected = false;
            this.active = false;
            // dataChange eventBus handler
            this.setData = (...args) => {
                const [variable, value] = args;
                if (this.active) {
                    if (!Object.hasOwnProperty.call(this.data, variable)) {
                        throw new Error(`${this.name}: trying to set ${value} to undefined variable ${variable}`);
                    }
                    this.data[variable] = value;
                }
            };
            // update eventBus handler
            // когда изменяются данные - запускаем рендер
            // если они прилетают пачкой - ставим в очередь
            this.update = () => {
                if (!this.rendering) {
                    this.render();
                }
                else {
                    this.renderQueue.enqueue('update');
                }
            };
            // setInterval handler
            // если очередь не пустая - очищает очередь и запускает render
            this.delayedUpdate = () => {
                if (!this.rendering && !this.renderQueue.isEmpty()) {
                    // eslint-disable-next-line no-console
                    console.warn(`delayedUpdate: ${this.renderQueue.size} queued`);
                    while (!this.renderQueue.isEmpty()) {
                        this.renderQueue.dequeue();
                    }
                    this.render();
                }
            };
            // это не оптимальный метод и точно не окончательный
            // он работает напрямую с ДОМ и не учитывает вложенность
            // был создан только для отработки динамических атрибутов.
            this.render = () => {
                if (!this.isVisible())
                    return;
                this.rendering = true;
                const content = this.querySelectorAll('*');
                Array.from(content).forEach((el) => {
                    const element = el;
                    const { attributes } = element;
                    Array.from(attributes).forEach((a) => {
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
                                    element.disabled = (res === 'true');
                                    break;
                                default:
                                    element.setAttribute(native, res);
                            }
                        }
                        if (attribute.charAt(0) === '@') { // inline event handlers
                            const parsed = this.parse(element.getAttribute(attribute) || '');
                            if (this.methods[parsed.func]) {
                                const key = `on${attribute.substring(1)}`;
                                if (key in element) {
                                    element[key] = () => this.run(parsed);
                                }
                                else {
                                    throw new Error(`event '${key}' does not exist`);
                                }
                            }
                            else {
                                throw new Error(`Method '${parsed.func}' does not exist`);
                            }
                        }
                    });
                });
                this.rendering = false;
            };
            this.show = () => {
                this.style.display = CONST.block;
                this.style.visibility = CONST.visible;
                this.active = true;
                this.EventBus.emit(CONST.update);
            };
            this.hide = () => {
                this.style.display = CONST.none;
                this.style.visibility = CONST.hidden;
                this.active = false;
            };
            this.init = init;
            this.name = init.name;
            this.renderQueue = new Queue();
            setInterval(() => this.delayedUpdate(), 100);
            if (!this.name)
                throw new Error('Component name is not defined');
            this.EventBus = new EventBus();
            this.EventBus.on(CONST.update, this.update);
            this.EventBus.on('dataChange', this.setData);
            // define each components
            Object.keys(init.components).forEach((key) => {
                if (!window.customElements.get(key)) {
                    customElements.define(key, init.components[key]);
                }
            });
            this.init.methods._get = (param) => param;
            this.methods = {};
            Object.keys(this.init.methods).forEach((key) => {
                this.methods[key] = this.init.methods[key].bind(this);
            });
            this.data = this.makeProxy(init.data());
            this.init.created = this.init.created.bind(this);
            this.init.mounted = this.init.mounted.bind(this);
            this.init.created();
        }
        makeProxy(data) {
            return new Proxy(data, {
                get(target, prop) {
                    return target[prop];
                },
                set: (target, prop, value) => {
                    // eslint-disable-next-line no-param-reassign
                    target[prop] = value;
                    this.EventBus.emit(CONST.update);
                    return true;
                },
                deleteProperty(target, prop) {
                    throw new Error(`Cant delete property ${prop} from ${target}`);
                },
            });
        }
        // get result from user defined methods
        run(parsed) {
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
        isVisible() {
            const style = window.getComputedStyle(this);
            return (style.visibility === CONST.visible);
        }
        // eslint-disable-next-line class-methods-use-this
        parse(str) {
            const result = { not: false, func: '', params: [] };
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
    };
    customElements.define(init.name, app);
    return { constructor: app, name: init.name };
};
// export app;
export default sue;
//# sourceMappingURL=sue.js.map