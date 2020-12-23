import EventBus from '../lib/event-bus';
import AuthAPI from '../api/auth';
import { CONST, isJsonString } from '../lib/utils';
import Toaster, { ToasterMessageTypes } from '../lib/toaster';

const auth = new AuthAPI();
const toaster = new Toaster();

class sUser extends HTMLElement {
  eventBus = new EventBus();

  not = false

  menuOpened = false

  wrapper = document.createElement(CONST.div)

  template = ''

  constructor() {
    super();
    if (this.hasAttribute('not')) {
      this.not = true;
    }
    this.classList.add('mpy_navigation_link');
    this.wrapper.classList.add('mpy_navigation_menu');
    this.addEventListener('click', (e: MouseEvent) => this.showMenu(e));
    // this.addEventListener('mouseover', (e) => this.showMenu(e));
    // window.addEventListener('popstate', () => this.onPopstate());
    window.addEventListener('hashchange', () => this.onPopstate());
    document.body.addEventListener('click', () => this.hideMenu());
    this.makeMenu();
  }

  showMenu(e: MouseEvent):void {
    if (this.menuOpened) {
      this.hideMenu();
      return;
    }
    this.menuOpened = true;
    const targetRect = this.getBoundingClientRect();
    this.wrapper.style.top = `${targetRect.bottom + 10}px`;
    this.wrapper.style.right = '0';
    this.wrapper.style.display = CONST.flex;
    e.stopPropagation();
  }

  hideMenu():void {
    this.menuOpened = false;
    this.wrapper.style.display = CONST.none;
  }

  isPresent():boolean {
    const style = window.getComputedStyle(this);
    return (style.visibility === CONST.visible);
  }

  onPopstate(): void {
    if (!this.isPresent()) return;
    this.connectedCallback();
  }

  connectedCallback(): void {
    document.body.style.opacity = '0';
    auth.getUser()
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('unauthorized');
      }).then((user) => {
        this.innerText = user.login;
        this.eventBus.emit('dataChange', 'login', user.login);
        document.body.style.opacity = '1';
      }).catch((e) => {
        console.warn(e);
        window.router.go('/#/login');
        document.body.style.opacity = '1';
      });
  }

  makeMenu():void {
    const logout = document.createElement(CONST.div);
    logout.classList.add('mpy_navigation_link');
    logout.innerText = 'Logout';
    logout.addEventListener('click', () => this.logout());
    const profile = document.createElement(CONST.div);
    profile.classList.add('mpy_navigation_link');
    profile.innerText = 'Profile';
    profile.addEventListener('click', () => window.router.go('/#/profile'));
    this.wrapper.style.display = CONST.none;
    this.wrapper.appendChild(profile);
    this.wrapper.appendChild(logout);
    document.body.appendChild(this.wrapper);
  }

  logout(): void {
    auth.logOut().then((response) => {
      if (response.status === 200) {
        this.connectedCallback();
        toaster.toast('Successfully exited', ToasterMessageTypes.info);
      } else {
        toaster.toast('Error: Can not logout', ToasterMessageTypes.error);
      }
    });
  }
}

export default sUser;
