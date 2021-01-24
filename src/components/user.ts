import eventBus from '../lib/event-bus';
import toaster, { ToasterMessageTypes } from '../lib/toaster';
import ICONS from '../lib/icons';
import authController from '../controllers/auth';
import store from '../lib/store';
import { CONST } from '../lib/const';

class sUser extends HTMLElement {
  eventBus = eventBus;

  menuOpened = false;

  wrapper: HTMLElement;

  logoutElement: HTMLElement;

  constructor() {
    super();

    this.wrapper = document.createElement(CONST.div);
    this.logoutElement = document.createElement(CONST.div);
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
    this.wrapper.style.left = `${targetRect.left}px`;
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
    authController.fillUserState().then((res) => {
      if (res) this.textContent = <string>store.state.currentUser.login;
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
    profile.textContent = 'Profile';
    profile.classList.add('mpy_navigation_link');
    profile.addEventListener('click', () => window.router.go('/#/profile'));
    this.wrapper.appendChild(profile);

    this.logoutElement = document.createElement(CONST.div);
    this.logoutElement.classList.add('mpy_navigation_link');
    this.logoutElement.textContent = 'logout';
    this.logoutElement.dataset.icon = ICONS.logout;
    this.logoutElement.addEventListener('click', () => this.logout());
    this.wrapper.appendChild(this.logoutElement);

    this.wrapper.style.display = CONST.none;
    document.body.appendChild(this.wrapper);
  }

  logout(): void {
    authController.logOut().then(() => {
      authController.clearUserState();
      toaster.toast('Successfully exited', ToasterMessageTypes.info);
      setTimeout(() => window.router.go('/#/login'), 0);
    }).catch(() => {
      toaster.bakeError('Cant logout');
    });
  }
}

export default sUser;
