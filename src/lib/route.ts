import { sCustomElementConstructor, sHTMLElement } from './types';

class Route {
  protected pathname: string;

  readonly view: sCustomElementConstructor;

  public element: sHTMLElement;

  protected root: HTMLElement;

  constructor(pathname: string, view: sCustomElementConstructor, root: HTMLElement) {
    this.pathname = pathname.charAt(0) === '/' ? pathname.substring(1) : pathname;
    this.view = view;
    this.root = root;
    this.element = <sHTMLElement>document.createElement(view.name);
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this.pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this.view) {
      this.element.hide();
    }
  }

  match(pathname: string): boolean {
    return pathname === this.pathname;
  }

  render(): void {
    if (!this.element.parentElement) {
      this.root.appendChild(this.element);
    }
    this.element.show();
  }

  path(): string {
    return this.pathname;
  }
}

export default Route;
