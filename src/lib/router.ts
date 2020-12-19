import Route from './route.js';
import { sCustomElementConstructor } from './types';

class Router {
  public routes: Route[] = [];

  protected history: History = window.history;

  protected currentRoute!: Route;

  protected readonly root!: HTMLElement;

  // protected overlay: HTMLElement;

  protected static instance: Router;

  constructor(root: HTMLElement) {
    if (Router.instance) {
      return Router.instance;
    }
    Router.instance = this;
    this.routes = [];
    this.root = root;
    this.root.innerText = '';
    // this.overlay = document.createElement('div');
    // this.overlay.style.display = 'none';
    // this.overlay.classList.add('mpy_overlay');
    // document.body.appendChild(this.overlay);
  }

  use(pathname: string, view: sCustomElementConstructor): Router {
    const route = new Route(pathname, view, this.root);
    this.routes.push(route);

    return this;
  }

  start(): void {
    window.onhashchange = ((event: HashChangeEvent): void => {
      this._onRoute((event.currentTarget as Window).location.hash);
    });

    window.onpopstate = ((event: PopStateEvent): void => {
      this._onRoute((event.currentTarget as Window).location.hash);
    });

    this._onRoute(window.location.hash);
  }

  _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);
    if (!route) {
      if (pathname !== '/#/404') {
        this.go('/#/404');
      }
      return;
    }

    // if (this.currentRoute && this.currentRoute !== route && this.currentRoute.element.tagName.match(/modal$/i)) {
    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find((route) => route.match(pathname));
  }
}

export default Router;
