import {
  expect, describe, test,
} from '@jest/globals';

import Queue from './queue';

describe('test Queue class', () => {
  test('must be defined', () => {
    expect(Queue).toBeDefined();
  });

  const strings = {
    one: 'one',
    two: 'two',
    three: 'three',
  };

  test('empty queue.size returns 0', () => {
    const queue = new Queue();
    expect(queue.size).toEqual(0);
  });

  test('enqueue() empty queue returns 1', () => {
    const queue = new Queue();
    expect(queue.enqueue(strings.one)).toEqual(1);
  });

  test('peek() returns first element', () => {
    const queue = new Queue();
    queue.enqueue(strings.one);
    queue.enqueue(strings.two);
    expect(queue.peek()).toMatch(strings.one);
  });

  test('non empty queue isEmpty returns false', () => {
    const queue = new Queue();
    queue.enqueue(strings.one);
    expect(queue.isEmpty()).toBeFalsy();
  });

  test('enumerator returns all elements in right order', () => {
    const queue = new Queue();
    queue.enqueue(strings.one);
    queue.enqueue(strings.two);
    queue.enqueue(strings.three);
    expect(Array.from(queue.values())).toEqual([strings.one, strings.two, strings.three]);
  });

  test('dequeue() returns first element', () => {
    const queue = new Queue();
    queue.enqueue(strings.one);
    queue.enqueue(strings.two);
    queue.enqueue(strings.three);
    expect(queue.dequeue()).toMatch(strings.one);
    expect(queue.dequeue()).toMatch(strings.two);
    expect(queue.dequeue()).toMatch(strings.three);
  });

  test('dequeue() empty queue returns undef', () => {
    const queue = new Queue();
    expect(queue.dequeue()).toBeUndefined();
  });

  test('isEmpty() empty queue returns true', () => {
    const queue = new Queue();
    expect(queue.isEmpty()).toBeTruthy();
  });
});
