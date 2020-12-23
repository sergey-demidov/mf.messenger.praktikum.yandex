import EventBus from "../lib/event-bus.js";
import AuthAPI from "../api/auth.js";
import { isJsonString } from "../lib/utils.js";
const auth = new AuthAPI();
class sUser extends HTMLElement {
    constructor() {
        super();
        this.eventBus = new EventBus();
        this.not = false;
        this.menuOpened = false;
        this.wrapper = document.createElement('div');
        this.template = '';
        if (this.hasAttribute('not')) {
            this.not = true;
        }
        this.classList.add('mpy_navigation_link');
        this.wrapper.classList.add('mpy_navigation_menu');
        this.addEventListener('click', (e) => this.showMenu(e));
        // this.addEventListener('mouseover', (e) => this.showMenu(e));
        // window.addEventListener('popstate', () => this.onPopstate());
        window.addEventListener('hashchange', () => this.onPopstate());
        document.body.addEventListener('click', () => this.hideMenu());
        this.makeMenu();
    }
    showMenu(e) {
        if (this.menuOpened) {
            this.hideMenu();
            return;
        }
        this.menuOpened = true;
        const targetRect = this.getBoundingClientRect();
        this.wrapper.style.top = `${targetRect.bottom + 10}px`;
        this.wrapper.style.right = '0';
        this.wrapper.style.display = 'flex';
        e.stopPropagation();
    }
    hideMenu() {
        this.menuOpened = false;
        this.wrapper.style.display = 'none';
    }
    isPresent() {
        const style = window.getComputedStyle(this);
        return (style.visibility === 'visible');
    }
    onPopstate() {
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
            this.innerText = user.login;
            document.body.style.opacity = '1';
        }).catch(() => {
            window.router.go('/#/login');
            document.body.style.opacity = '1';
        });
    }
    makeMenu() {
        const logout = document.createElement('div');
        logout.classList.add('mpy_navigation_link');
        logout.innerText = 'Logout';
        logout.addEventListener('click', () => this.logout());
        const profile = document.createElement('div');
        profile.classList.add('mpy_navigation_link');
        profile.innerText = 'Profile';
        profile.addEventListener('click', () => window.router.go('/#/profile'));
        this.wrapper.style.display = 'none';
        this.wrapper.appendChild(profile);
        this.wrapper.appendChild(logout);
        document.body.appendChild(this.wrapper);
    }
    logout() {
        auth.logOut().then((response) => {
            console.dir(response);
            this.connectedCallback();
        });
    }
}
export default sUser;
//# sourceMappingURL=user.js.map