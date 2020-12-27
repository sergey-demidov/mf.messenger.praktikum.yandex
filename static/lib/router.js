import Route from "./route.js";
class Router {
    constructor(root) {
        this.routes = [];
        this.history = window.history;
        if (Router.instance) {
            return Router.instance;
        }
        Router.instance = this;
        this.routes = [];
        this.root = root;
        this.root.innerText = '';
    }
    use(pathname, view) {
        const route = new Route(pathname, view, this.root);
        this.routes.push(route);
        return this;
    }
    start() {
        window.onhashchange = (event) => {
            this._onRoute(event.currentTarget.location.hash);
        };
        // window.onpopstate = (event: PopStateEvent): void => {
        //   console.log('onpopstate');
        //   this._onRoute((event.currentTarget as Window).location.hash);
        // };
        this._onRoute(window.location.hash);
    }
    _onRoute(pathname) {
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
    go(pathname) {
        this.history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname) {
        return this.routes.find((r) => r.match(pathname.charAt(0) === '/' ? pathname.substring(1) : pathname));
    }
}
export default Router;
//# sourceMappingURL=router.js.map