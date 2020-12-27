import Route from './route';
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
  }

  use(pathname: string, view: sCustomElementConstructor): Router {
    const route = new Route(pathname, view, this.root);
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onhashchange = (event: HashChangeEvent): void => {
      this._onRoute((event.currentTarget as Window).location.hash);
    };

    // window.onpopstate = (event: PopStateEvent): void => {
    //   console.log('onpopstate');
    //   this._onRoute((event.currentTarget as Window).location.hash);
    // };

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

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((r) => r.match(pathname.charAt(0) === '/' ? pathname.substring(1) : pathname));
  }
}

export default Router;
