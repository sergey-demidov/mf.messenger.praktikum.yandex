import {
  expect, describe, test, jest, beforeAll,
} from '@jest/globals';

import auth from './auth';
import eventBus from './event-bus';
import { CONST } from './utils';
import mocks from './mock-utils';

describe('test auth module', () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    eventBus.on(CONST.update, () => {});
  });

  test('is defined', () => {
    expect(auth).toBeDefined();
  });

  test('authentication', async () => {
    expect(auth.isUserLoggedIn()).toBeFalsy();

    mocks.fetchXmlHttp(401, {});
    expect(await auth.fillUserState()).toBeFalsy();

    mocks.fetchXmlHttp(200, mocks.apiUserResponse);
    expect(await auth.fillUserState()).toBeTruthy();
    expect(await auth.fillUserState()).toBeTruthy();

    expect(auth.isUserLoggedIn()).toBeTruthy();

    auth.clearUserState();
    expect(auth.isUserLoggedIn()).toBeFalsy();
  });
});
