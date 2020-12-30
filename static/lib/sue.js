import eventBus from "./event-bus.js";
import { CONST, hash8 } from "./utils.js";
import Queue from "./queue.js";
import store from "./store.js";
const sue = (i) => {
    // need to merge with incomplete init definitions
    const emptyInit = {
        authorisationRequired: false,
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
            this.eventBus = eventBus;
            this.store = store;
            this.name = '';
            this.data = {};
            // eslint-disable-next-line @typescript-eslint/ban-types
            this.methods = {};
            this.rendering = false;
            this.connected = false;
            this.active = false;
            this.authorisationRequired = false;
            this.renderQueue = new Queue();
            this.init = emptyInit;
            this.instanceId = hash8();
            this.createResources = () => {
                this.init = init;
                this.name = init.name;
                this.authorisationRequired = init.authorisationRequired;
                if (!this.name)
                    throw new Error('Component name is not defined');
                if (!this.name.match(/-/))
                    throw new Error('Component name must include at least one hyphen');
                setInterval(() => this.delayedUpdate(), 100);
                this.eventBus.on(CONST.update, this.update);
                this.eventBus.on('dataChange', this.setData);
                // define each components
                Object.keys(init.components).forEach((key) => {
                    if (!window.customElements.get(key)) {
                        customElements.define(key, init.components[key]);
                    }
                });
                this.init.methods._reflect = (param) => param;
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
            // если они прилетают во время выполнения render()
            // ставим в очередь
            this.update = () => {
                if (!this.isVisible())
                    return;
                if (!this.rendering) {
                    this.rendering = true;
                    const tStart = performance.now();
                    this.render();
                    const tEnd = performance.now();
                    this.rendering = false;
                    const renderTime = Math.ceil(tEnd - tStart);
                    // eslint-disable-next-line no-console
                    if (renderTime > 4)
                        console.log(`render ${this.name} took ${renderTime} milliseconds.`);
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
                    this.eventBus.emit(CONST.update);
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
                    // param is array member
                    const arrayRes = e.match(/^([a-z0-9_]+)\[(\d+)]$/i);
                    if (arrayRes) {
                        const [, array, strIndex] = arrayRes;
                        const index = parseInt(strIndex, 10);
                        if (!this.data[array] || !Array.isArray(this.data[array]) || !this.data[array][index]) {
                            throw new Error(`array member '${e}' undefined`);
                        }
                        return this.data[array][index];
                    }
                    // param is undefined data property
                    if (typeof this.data[e] === CONST.undefined) {
                        throw new Error(`property '${e}' undefined`);
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
                if (element.hasAttribute('s-for')) { // for loop
                    const sForAttribute = element.getAttribute('s-for') || '';
                    if (!sForAttribute) {
                        throw new Error('\'s-for\' attribute must have \'s-key\'');
                    }
                    const res = sForAttribute.match(/^([\w\d_]+) in ([\w\d_]+)$/);
                    if (!res) {
                        throw new Error(`Cant parse string '${sForAttribute}' in 's-for' attribute`);
                    }
                    const [, sFor, sIn] = res;
                    const sKey = element.getAttribute('s-key') || '';
                    if (!sIn || !this.data[sIn] || !Array.isArray(this.data[sIn])) {
                        throw new Error(`Attribute 's-in' '${sIn}' is not array`);
                    }
                    if (!sKey) {
                        throw new Error('Attribute \'s-key\' required');
                    }
                    const templateId = `${sFor}_${sIn}_${sKey}`;
                    let template = document.getElementById(templateId);
                    if (!template) {
                        // eslint-disable-next-line no-console
                        console.log(`creating template ${templateId}`);
                        template = document.createElement('template');
                        template.id = templateId;
                        const clone = element.cloneNode(true);
                        clone.removeAttribute('s-for');
                        clone.removeAttribute('s-in');
                        template.content.appendChild(clone);
                        element.innerHTML = '';
                        document.body.appendChild(template);
                    }
                    if (element.childElementCount !== this.data[sIn].length) {
                        const array = this.data[sIn];
                        // eslint-disable-next-line no-console
                        console.log(`childElementCount ${element.childElementCount} !== ${array.length}`);
                        element.innerHTML = '';
                        const content = template.content.firstChild;
                        for (let index = 0; index < array.length; index += 1) {
                            const cloned = content.cloneNode(true);
                            cloned.setAttribute('s-array-key', `${sKey}_${index}`);
                            cloned.innerHTML = cloned.innerHTML.replace(`${sIn}[${sFor}]`, `${sIn}[${index}]`);
                            element.appendChild(cloned);
                        }
                    }
                }
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
                        const eventHandler = `on${attribute.substring(1)}`;
                        // привязываем только один раз
                        if (typeof element[eventHandler] !== 'function') {
                            if (!(eventHandler in element)) {
                                throw new Error(`event handler '${eventHandler}' does not exist`);
                            }
                            const parsed = this.parse(element.getAttribute(attribute) || '');
                            if (!this.methods[parsed.func]) {
                                throw new Error(`Method '${parsed.func}' does not exist`);
                            }
                            element[eventHandler] = () => this.run(parsed);
                            // eslint-disable-next-line no-console
                            console.warn(`set ${eventHandler} to ${parsed.func}(${parsed.params.join(', ')})`);
                        }
                    }
                });
                Array.from(element.childNodes).forEach((child) => this.render(child));
            };
            this.show = () => {
                this.style.display = CONST.block;
                this.style.visibility = CONST.visible;
                this.active = true;
                this.eventBus.emit(CONST.update);
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
            // some_func(a,b), !some_func()
            const regFunc = new RegExp(/^\s*(!?)\s*([a-z0-9_]+)\(([^)]*)\)\s*$/i);
            const func = str.match(regFunc);
            if (func) {
                let strParams;
                [, not, result.func, strParams] = func;
                result.params = strParams.split(',').filter((r) => r !== '').map((e) => e.trim());
                result.not = (not === '!');
                return result;
            }
            // some_variable, !some_variable
            const regVariable = new RegExp(/^\s*(!?)\s*([a-z0-9_]+)\s*$/i);
            const variable = str.match(regVariable);
            if (variable) {
                result.func = '_reflect';
                [, not, result.params[0]] = variable;
                result.not = not === '!';
                return result;
            }
            // some_array[some_var], !some_array[some_var]
            const arrVariable = new RegExp(/^\s*(!?)\s*([a-z0-9_]+\[[a-z0-9_]+\])\s*$/i);
            const iterator = str.match(arrVariable);
            if (iterator) {
                result.func = '_reflect';
                [, not, result.params[0]] = iterator;
                result.not = (not === '!');
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
    return { constructor: app, name: init.name, authorisationRequired: init.authorisationRequired || false };
};
// export app;
export default sue;
//# sourceMappingURL=sue.js.map