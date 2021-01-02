import {
  expect, describe, test,
} from '@jest/globals';

import Route from './route';
import sue from './sue';
import { CONST } from './utils';

describe('test Route class', () => {
  test('must be defined', () => {
    expect(Route).toBeDefined();
  });

  test('peek() returns first element', () => {
    const page = sue({ name: 's-mock-page' });
    const root = window.document.body;

    let route = new Route('test', page, root);
    expect(route.path()).toEqual('test');

    route = new Route('/test', page, root);
    expect(route.path()).toEqual('test');

    expect(route.element.tagName).toEqual('S-MOCK-PAGE');
    expect(route.element.parentElement).toBeNull();
    route.navigate('/test');
    expect(route.element.parentElement).toEqual(root);
    expect(route.element.style.display).toEqual(CONST.block);
    expect(route.element.style.visibility).toEqual(CONST.visible);
    route.leave();
    route.navigate('UNDEFINED');
    expect(route.element.parentElement).toEqual(root);
    expect(route.element.style.display).toEqual(CONST.none);
    expect(route.element.style.visibility).toEqual(CONST.hidden);
  });

  // test('peek() returns first element', () => {
  //   const queue = new Queue();
  //   queue.enqueue(strings.one);
  //   queue.enqueue(strings.two);
  //   expect(queue.peek()).toMatch(strings.one);
  // });
  //
  // test('non empty queue isEmpty returns false', () => {
  //   const queue = new Queue();
  //   queue.enqueue(strings.one);
  //   expect(queue.isEmpty()).toBeFalsy();
  // });
  //
  // test('enumerator returns all elements in right order', () => {
  //   const queue = new Queue();
  //   queue.enqueue(strings.one);
  //   queue.enqueue(strings.two);
  //   queue.enqueue(strings.three);
  //   expect(Array.from(queue.values())).toEqual([strings.one, strings.two, strings.three]);
  // });
  //
  // test('dequeue() returns first element', () => {
  //   const queue = new Queue();
  //   queue.enqueue(strings.one);
  //   queue.enqueue(strings.two);
  //   queue.enqueue(strings.three);
  //   expect(queue.dequeue()).toMatch(strings.one);
  //   expect(queue.dequeue()).toMatch(strings.two);
  //   expect(queue.dequeue()).toMatch(strings.three);
  // });
  //
  // test('dequeue() empty queue returns undef', () => {
  //   const queue = new Queue();
  //   expect(queue.dequeue()).toBeUndefined();
  // });
  //
  // test('isEmpty() empty queue returns true', () => {
  //   const queue = new Queue();
  //   expect(queue.isEmpty()).toBeTruthy();
  // });
});
