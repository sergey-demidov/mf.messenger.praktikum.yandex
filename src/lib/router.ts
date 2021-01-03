import Route from './route';
import { sCustomElementConstructor } from './types';
import eventBus from './event-bus';
import auth from './auth';
import { CONST } from './const';

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
  }

  use(pathname: string, view: sCustomElementConstructor): Router {
    const route = new Route(pathname, view, this.root);
    this.routes.push(route);
    return this;
  }

  start(): void {
    // window.onhashchange = (event: HashChangeEvent): void => {
    //   auth.fillUserState().then(() => this._onRoute((event.currentTarget as Window).location.hash));
    // };
    window.onhashchange = (): void => {
      auth.fillUserState().then(() => this._onRoute(window.location.hash));
    };

    auth.fillUserState().then(() => this._onRoute((window.location.hash)));
  }

  protected _onRoute(pathname: string):void {
    const route = this.getRoute(pathname);
    if (route) {
      if (route.view.authorisationRequired && !auth.isUserLoggedIn()) {
        this.go('/#/login');
        return;
      }
      if (!route.view.authorisationRequired && auth.isUserLoggedIn()) {
        this.go('/#/chat');
        return;
      }
      // if (this.currentRoute && this.currentRoute !== route && !route.view.name.match(/-modal$/)) {
      if (this.currentRoute && this.currentRoute !== route) {
        this.currentRoute.leave();
      }
      this.currentRoute = route;
      route.render();
      eventBus.emit(CONST.hashchange);
      return;
    }
    if (pathname.match(/^[/#]?$/)) {
      this.go('/#/chat');
      return;
    }
    if (pathname !== '/#/404') {
      this.go('/#/404');
    }
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(p: string): Route | undefined {
    const pathname = p.charAt(0) === '/' ? p.substring(1) : p;
    return this.routes.find((r) => r.match(pathname));
  }
}

export default Router;
