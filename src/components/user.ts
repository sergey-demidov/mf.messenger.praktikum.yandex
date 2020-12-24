import EventBus from '../lib/event-bus';
import AuthAPI from '../api/auth';
import { CONST, isJsonString } from '../lib/utils';
import Toaster, { ToasterMessageTypes } from '../lib/toaster';
import ICONS from '../lib/icons';

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
    window.addEventListener('hashchange', () => this.onHashchange());
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
    this.wrapper.style.top = `${targetRect.bottom + 5}px`;
    this.wrapper.style.left = `${targetRect.left}px`;
    this.wrapper.style.minWidth = `${targetRect.width}px`;

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

  onHashchange(): void {
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
        this.innerText = `${user.login}`;
        this.dataset.icon = ICONS.person;
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
    logout.dataset.icon = '\ue9ba';

    logout.addEventListener('click', () => this.logout());
    const profile = document.createElement(CONST.div);
    profile.classList.add('mpy_navigation_link');
    profile.innerText = 'Profile';
    profile.dataset.icon = ICONS.settings;
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
