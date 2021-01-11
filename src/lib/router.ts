import Route from './route';
import { sCustomElementConstructor } from './types';
import eventBus from './event-bus';
import authController from '../controllers/auth';
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
    window.onhashchange = (): void => {
      authController.fillUserState().then(() => this._onRoute(window.location.hash));
    };

    authController.fillUserState().then(() => this._onRoute((window.location.hash)));
  }

  protected _onRoute(pathname: string):void {
    const route = this.getRoute(pathname);
    console.log(pathname);
    if (route && !pathname.match(/^[#/]*404$/)) {
      if (route.view.authorisationRequired && !authController.isUserLoggedIn()) {
        this.go('/#/login');
        return;
      }
      if (!route.view.authorisationRequired && authController.isUserLoggedIn()) {
        this.go('/#/chat');
        return;
      }
    }
    if (route) {
      if (this.currentRoute && this.currentRoute !== route && !route.view.name.match(/-modal$/)) {
        this.currentRoute.leave();
      }
      this.currentRoute = route;
      route.render();
      eventBus.emit(CONST.hashchange);
      return;
    }
    if (pathname.match(/^[#/]*$/) && !pathname.match(/[#/]*404$/)) {
      this.go('/#/login');
      return;
    }
    if (!pathname.match(/[#/]*404$/)) {
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
