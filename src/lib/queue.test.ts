import {
  expect, beforeAll, describe, it, test,
} from '@jest/globals';
import Queue from './queue';

// jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
// jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())

describe('test user input', () => {
  // beforeAll(() => {
  // });

  test('', () => {
    expect(Queue).toBeDefined();
    const queue = new Queue();
    const strings = {
      one: 'one',
      two: 'two',
      three: 'three',
    };
    expect(queue.dequeue()).toBeUndefined();
    expect(queue.enqueue(strings.one)).toEqual(1);
    expect(queue.peek()).toMatch(strings.one);
    queue.enqueue(strings.two);
    queue.enqueue(strings.three);
    expect(Array.from(queue.values())).toEqual([strings.one, strings.two, strings.three]);
    expect(queue.dequeue()).toMatch(strings.one);
    expect(queue.dequeue()).toMatch(strings.two);
    expect(queue.isEmpty()).toBeFalsy();
    expect(queue.dequeue()).toMatch(strings.three);
    expect(queue.dequeue()).toBeUndefined();
    expect(queue.isEmpty()).toBeTruthy();
  });

  // it('read fs recursive', async () => {
  //   await expect((await lib.getFiles('./test/mocks/pages', ['*.vue']))[0]).toMatch(/index.vue/);
  // });
  //
  // it('directory warning', () => {
  //   expect(lib.directoryWarn('./test/mocks/pages')).toMatch(/\/test\/mocks\/pages/i);
  // });
  //
  // it('import file', async () => {
  //   expect(lib.importFile('./test/mocks/lang/en.js')).toHaveProperty('Welcome');
  //   expect(lib.importFile('./test/mocks/lang/empty.js')).toMatchObject({});
  //   expect(lib.importFile('./XXX')).toMatchObject({});
  //   expect(await lib.loadConfig()).toHaveProperty('i18nEasy');
  // });
  // afterAll(() => {
  // });
});
