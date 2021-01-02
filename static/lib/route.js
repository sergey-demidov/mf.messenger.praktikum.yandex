class Route {
    constructor(pathname, view, root) {
        this.pathname = pathname.charAt(0) === '/' ? pathname.substring(1) : pathname;
        this.view = view;
        this.root = root;
        this.element = document.createElement(view.name);
    }
    navigate(pathname) {
        if (this.match(pathname)) {
            this.render();
        }
    }
    leave() {
        if (this.view) {
            this.element.hide();
        }
    }
    match(p) {
        const pathname = p.charAt(0) === '/' ? p.substring(1) : p;
        return pathname === this.pathname;
    }
    render() {
        if (!this.element.parentElement) {
            this.root.appendChild(this.element);
        }
        this.element.show();
    }
    path() {
        return this.pathname;
    }
}
export default Route;
//# sourceMappingURL=route.js.map