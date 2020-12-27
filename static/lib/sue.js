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
        // id = hash8()
        constructor() {
            super();
            this.EventBus = new EventBus();
            this.name = '';
            this.data = {};
            // eslint-disable-next-line @typescript-eslint/ban-types
            this.methods = {};
            this.rendering = false;
            this.connected = false;
            this.active = false;
            this.renderQueue = new Queue();
            this.init = emptyInit;
            this.createResources = () => {
                this.init = init;
                this.name = init.name;
                if (!this.name)
                    throw new Error('Component name is not defined');
                setInterval(() => this.delayedUpdate(), 100);
                this.EventBus.on(CONST.update, this.update);
                this.EventBus.on('dataChange', this.setData);
                // define each components
                Object.keys(init.components).forEach((key) => {
                    if (!window.customElements.get(key)) {
                        customElements.define(key, init.components[key]);
                    }
                });
                this.init.methods._get = (param) => param;
                Object.keys(this.init.methods).forEach((key) => {
                    this.methods[key] = this.init.methods[key].bind(this);
                });
                this.data = this.makeProxy(init.data());
                this.init.created = this.init.created.bind(this);
                this.init.mounted = this.init.mounted.bind(this);
                this.init.created();
            };
            // dataChange eventBus handler
            this.setData = (...args) => {
                const [variable, value] = args;
                if (Object.hasOwnProperty.call(this.data, variable)) {
                    this.data[variable] = value;
                }
            };
            // update eventBus handler
            // когда изменяются данные - запускаем рендер
            // если они прилетают во время render() - ставим в очередь
            this.update = () => {
                if (!this.isVisible())
                    return;
                if (!this.rendering) {
                    this.rendering = true;
                    const tStart = performance.now();
                    this.render();
                    const tEnd = performance.now();
                    this.rendering = false;
                    // eslint-disable-next-line no-console
                    console.log(`render ${this.name} took ${Math.round(tEnd - tStart)} milliseconds.`);
                }
                else {
                    this.renderQueue.enqueue('update');
                }
            };
            // setInterval(... ,100) handler
            // если очередь не пустая - очищает очередь и запускает update
            this.delayedUpdate = () => {
                if (!this.rendering && !this.renderQueue.isEmpty()) {
                    // eslint-disable-next-line no-console
                    console.warn(`delayedUpdate: ${this.renderQueue.size} queued`);
                    while (!this.renderQueue.isEmpty()) {
                        this.renderQueue.dequeue();
                    }
                    this.update();
                }
            };
            this.makeProxy = (data) => new Proxy(data, {
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
            // get result from user defined methods
            this.run = (parsed) => {
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
            };
            // TODO: метод не оптимален - работает напрямую с DOM
            this.render = (e = this) => {
                if (!this.isVisible() || e.nodeType !== 1)
                    return;
                const element = e;
                const { attributes } = element;
                Array.from(attributes).forEach((a) => {
                    const attribute = a.name;
                    if (attribute.charAt(0) === ':') { // dynamic props
                        const parsed = this.parse(element.getAttribute(attribute) || '');
                        const native = attribute.substring(1);
                        const res = this.run(parsed);
                        switch (native) {
                            case 'text':
                                if (element.innerText !== res)
                                    element.innerText = res;
                                break;
                            case 'disabled':
                                if (element.disabled !== (res === 'true')) {
                                    element.disabled = (res === 'true');
                                }
                                break;
                            default:
                                if (element.getAttribute(native) !== res) {
                                    element.setAttribute(native, res);
                                }
                        }
                    }
                    if (attribute.charAt(0) === '@') { // inline event handlers
                        const parsed = this.parse(element.getAttribute(attribute) || '');
                        if (!this.methods[parsed.func]) {
                            throw new Error(`Method '${parsed.func}' does not exist`);
                        }
                        const eventHandler = `on${attribute.substring(1)}`;
                        if (!(eventHandler in element)) {
                            throw new Error(`event handler '${eventHandler}' does not exist`);
                        }
                        if (typeof element[eventHandler] !== 'function') {
                            element[eventHandler] = () => this.run(parsed);
                            // eslint-disable-next-line no-console
                            console.warn(`set ${eventHandler} to ${parsed.func}(${parsed.params.join(', ')})`);
                        }
                    }
                });
                Array.from(e.childNodes).forEach((child) => this.render(child));
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
            this.createResources();
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