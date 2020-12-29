import EventBus from '../lib/event-bus';
import AuthAPI from '../api/auth';
import { CONST, isJsonString } from '../lib/utils';
import Toaster, { ToasterMessageTypes } from '../lib/toaster';
import ICONS from '../lib/icons';

const auth = new AuthAPI();
const toaster = new Toaster();

class sUser extends HTMLElement {
  eventBus = new EventBus();

  menuOpened = false

  wrapper: HTMLElement

  constructor() {
    super();

    this.wrapper = document.createElement(CONST.div);
    this.createResources();

    this.eventBus.on(CONST.userDataChange, () => this.onHashchange());

    this.addEventListener('click', (e: MouseEvent) => this.showMenu(e));
    window.addEventListener('hashchange', () => this.onHashchange());
    window.addEventListener('popstate', () => this.onHashchange());
    document.body.addEventListener('click', () => this.hideMenu());
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

  onHashchange(): void {
    if (!this.isPresent()) return;
    this.connectedCallback();
  }

  connectedCallback(): void {
    // document.body.style.opacity = '0';
    auth.getUser()
      .then((response) => {
        if (response.status === 200 && isJsonString(response.response)) {
          return JSON.parse(response.response);
        }
        throw new Error('unauthorized');
      }).then((user) => {
        this.innerText = `${user.login}`;
        this.dataset.icon = ICONS.person;
        // document.body.style.opacity = '1';
      }).catch(() => {
        window.router.go('/#/login');
        // document.body.style.opacity = '1';
      });
  }

  createResources():void {
    this.classList.add('mpy_navigation_link');
    this.wrapper.classList.add('mpy_navigation_menu');
    // const getNodes = (str: string): HTMLElement => new DOMParser().parseFromString(str, 'text/html').body.firstChild as HTMLElement || document.createElement('div');
    // const profile = getNodes('<div class="mpy_navigation_link"> Profile </div>');
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
