import Route from "./route.js";
import eventBus from "./event-bus.js";
import authController from "../controllers/auth.js";
import { CONST } from "./const.js";
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
        window.onhashchange = () => {
            authController.fillUserState().then(() => this._onRoute(window.location.hash));
        };
        authController.fillUserState().then(() => this._onRoute((window.location.hash)));
    }
    _onRoute(pathname) {
        const route = this.getRoute(pathname);
        if (route) {
            if (route.view.authorisationRequired && !authController.isUserLoggedIn() && pathname !== '/#/404') {
                this.go('/#/login');
                return;
            }
            if (!route.view.authorisationRequired && authController.isUserLoggedIn() && pathname !== '/#/404') {
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
        if (pathname.match(/^[#/]*$/)) {
            this.go('/#/login');
            return;
        }
        if (pathname !== '/#/404') {
            this.go('/#/404');
        }
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
    getRoute(p) {
        const pathname = p.charAt(0) === '/' ? p.substring(1) : p;
        return this.routes.find((r) => r.match(pathname));
    }
}
export default Router;
//# sourceMappingURL=router.js.map