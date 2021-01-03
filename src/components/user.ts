import eventBus from '../lib/event-bus';
import Toaster, { ToasterMessageTypes } from '../lib/toaster';
import ICONS from '../lib/icons';
import auth from '../lib/auth';
import store from '../lib/store';
import AuthAPI from '../api/auth';
import { CONST } from '../lib/const';

const toaster = new Toaster();
const authApi = new AuthAPI();

class sUser extends HTMLElement {
  eventBus = eventBus;

  menuOpened = false;

  wrapper: HTMLElement;

  constructor() {
    super();

    this.wrapper = document.createElement(CONST.div);
    this.createResources();

    this.eventBus.on(CONST.userDataChange, () => this.update());

    this.addEventListener('click', (e: MouseEvent) => this.showMenu(e));
    window.addEventListener('hashchange', () => this.update());
    window.addEventListener('popstate', () => this.update());
    document.body.addEventListener('click', () => this.hideMenu());
    eventBus.on(CONST.update, () => this.update());
  }

  showMenu(e: MouseEvent):void {
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

  hideMenu():void {
    this.menuOpened = false;
    this.wrapper.style.display = CONST.none;
  }

  isPresent():boolean {
    const style = window.getComputedStyle(this);
    return (style.visibility === CONST.visible);
  }

  update(): void {
    if (!this.isPresent()) return;
    auth.fillUserState().then((res) => {
      if (res) this.innerText = <string>store.state.currentUser.login;
    });
  }

  connectedCallback(): void {
    this.update();
  }

  createResources():void {
    this.dataset.icon = ICONS.person;
    this.classList.add('mpy_navigation_link');
    this.wrapper.classList.add('mpy_navigation_menu');

    const profile = document.createElement('div');
    profile.dataset.icon = ICONS.settings;
    profile.innerText = 'Profile';
    profile.classList.add('mpy_navigation_link');
    profile.addEventListener('click', () => window.router.go('/#/profile'));
    this.wrapper.appendChild(profile);

    const logout = document.createElement(CONST.div);
    logout.classList.add('mpy_navigation_link');
    logout.innerText = 'Logout';
    logout.dataset.icon = ICONS.logout;
    logout.addEventListener('click', () => this.logout());
    this.wrapper.appendChild(logout);

    this.wrapper.style.display = CONST.none;
    document.body.appendChild(this.wrapper);
  }

  logout(): void {
    authApi.logOut().then((response) => {
      if (response.status === 200) {
        auth.clearUserState();
        toaster.toast('Successfully exited', ToasterMessageTypes.info);
        setTimeout(() => window.router.go('/#/login'), 100);
      } else {
        toaster.toast('Error: Can not logout', ToasterMessageTypes.error);
      }
    });
  }
}

export default sUser;
