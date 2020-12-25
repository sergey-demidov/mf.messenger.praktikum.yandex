import EventBus from "../lib/event-bus.js";
import AuthAPI from "../api/auth.js";
import { CONST, isJsonString } from "../lib/utils.js";
import Toaster, { ToasterMessageTypes } from "../lib/toaster.js";
import ICONS from "../lib/icons.js";
const auth = new AuthAPI();
const toaster = new Toaster();
class sUser extends HTMLElement {
    constructor() {
        super();
        this.menuOpened = false;
        this.wrapper = document.createElement(CONST.div);
        this.createResources();
        this.eventBus = new EventBus();
        this.eventBus.on('userDataChange', () => this.onHashchange());
        this.addEventListener('click', (e) => this.showMenu(e));
        window.addEventListener('hashchange', () => this.onHashchange());
        document.body.addEventListener('click', () => this.hideMenu());
    }
    showMenu(e) {
        if (this.menuOpened) {
            this.hideMenu();
            return;
        }
        const menuWidth = 110;
        this.menuOpened = true;
        const targetRect = this.getBoundingClientRect();
        this.wrapper.style.top = `${targetRect.bottom + 5}px`;
        this.wrapper.style.right = '5px';
        this.wrapper.style.minWidth = `${menuWidth}px`;
        this.wrapper.style.display = CONST.flex;
        e.stopPropagation();
    }
    hideMenu() {
        this.menuOpened = false;
        this.wrapper.style.display = CONST.none;
    }
    isPresent() {
        const style = window.getComputedStyle(this);
        return (style.visibility === CONST.visible);
    }
    onHashchange() {
        if (!this.isPresent())
            return;
        this.connectedCallback();
    }
    connectedCallback() {
        document.body.style.opacity = '0';
        auth.getUser()
            .then((response) => {
            if (response.status === 200 && isJsonString(response.response)) {
                return JSON.parse(response.response);
            }
            throw new Error('unauthorized');
        }).then((user) => {
            this.innerText = `${user.login}`;
            this.dataset.icon = ICONS.person;
            document.body.style.opacity = '1';
        }).catch(() => {
            window.router.go('/#/login');
            document.body.style.opacity = '1';
        });
    }
    createResources() {
        this.classList.add('mpy_navigation_link');
        this.wrapper.classList.add('mpy_navigation_menu');
        const getNodes = (str) => new DOMParser().parseFromString(str, 'text/html').body.firstChild || document.createElement('div');
        const profile = getNodes('<div class="mpy_navigation_link"> Profile </div>');
        profile.dataset.icon = ICONS.settings;
        profile.addEventListener('click', () => window.router.go('/#/profile'));
        this.wrapper.appendChild(profile);
        const logout = document.createElement(CONST.div);
        logout.classList.add('mpy_navigation_link');
        logout.innerText = 'Logout';
        logout.dataset.icon = '\ue9ba';
        logout.addEventListener('click', () => this.logout());
        this.wrapper.appendChild(logout);
        this.wrapper.style.display = CONST.none;
        document.body.appendChild(this.wrapper);
    }
    logout() {
        auth.logOut().then((response) => {
            if (response.status === 200) {
                this.connectedCallback();
                toaster.toast('Successfully exited', ToasterMessageTypes.info);
            }
            else {
                toaster.toast('Error: Can not logout', ToasterMessageTypes.error);
            }
        });
    }
}
export default sUser;
//# sourceMappingURL=user.js.map