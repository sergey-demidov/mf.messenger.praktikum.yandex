import {
  expect, describe, test, beforeEach,
} from '@jest/globals';

import Route from '../route';
import sue from '../sue';
import { CONST } from '../utils';

describe('test Route class', () => {
  const root = window.document.body;
  const customElementName = 's-page';
  const page = sue({ name: customElementName });

  const newRoute = (path: string): Route => new Route(path, page, root);

  test('must be defined', () => {
    expect(Route).toBeDefined();
  });

  test('new route path with slash', () => {
    const route = newRoute('/test');
    expect(route.path()).toEqual('test');
  });

  test('new route path without slash', () => {
    const route = newRoute('test');
    expect(route.path()).toEqual('test');
  });

  test('new route element name', () => {
    const route = newRoute('/test');
    expect(route.element.tagName).toEqual(customElementName.toUpperCase());
  });

  test('new route is not mounted', () => {
    const route = newRoute('/test');
    expect(route.element.parentElement).toBeNull();
  });

  test('new route is not visible', () => {
    const route = newRoute('/test');
    expect(route.element.style.display).toEqual('');
    expect(route.element.style.visibility).toEqual('');
  });

  test('after navigate() element should be mounted', () => {
    const route = newRoute('/test');
    route.navigate('/test');
    expect(route.element.parentElement).toEqual(root);
  });

  test('after navigate() element should be visible', () => {
    const route = newRoute('/test');
    route.navigate('/test');
    expect(route.element.style.display).toEqual(CONST.block);
    expect(route.element.style.visibility).toEqual(CONST.visible);
  });

  test('after leave() element should be hidden', () => {
    const route = newRoute('/test');
    route.navigate('/test');
    route.leave();
    expect(route.element.style.display).toEqual(CONST.none);
    expect(route.element.style.visibility).toEqual(CONST.hidden);
  });
});
