import {
  expect, describe, test, beforeAll,
} from '@jest/globals';

import authController from '../../controllers/auth';
import eventBus from '../event-bus';
import mocks from './mock-utils';
import { CONST } from '../const';

describe('test auth module', () => {
  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    eventBus.on(CONST.update, () => {});
  });

  test('is defined', () => {
    expect(authController).toBeDefined();
  });

  test('authentication', async () => {
    expect(authController.isUserLoggedIn()).toBeFalsy();

    mocks.fetchXmlHttp(401, {});
    expect(await authController.fillUserState()).toBeFalsy();

    mocks.fetchXmlHttp(200, mocks.apiUserResponse);
    expect(await authController.fillUserState()).toBeTruthy();
    expect(await authController.fillUserState()).toBeTruthy();

    expect(authController.isUserLoggedIn()).toBeTruthy();

    authController.clearUserState();
    expect(authController.isUserLoggedIn()).toBeFalsy();
  });
});
