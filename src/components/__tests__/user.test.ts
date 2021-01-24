// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sUser from '../user';
import { CONST } from '../../lib/const';
import eventBus from '../../lib/event-bus';
import authController from '../../controllers/auth';
import store from '../../lib/store';
import mocks from '../../lib/mock-utils';

let userComponent;

customElements.define('s-input', sUser);

eventBus.on(CONST.update, jest.fn);

authController.fillUserState = () => Promise.resolve(true);

describe('test sUser module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    userComponent = new sUser();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('must be defined', () => {
    expect(sUser).toBeDefined();
  });

  test('must set user login as textContent', async () => {
    store.state.currentUser.login = 'login';
    await document.body.appendChild(userComponent);
    expect(userComponent.textContent).toEqual(store.state.currentUser.login);
  });

  test('must create a menu wrapper', async () => {
    await document.body.appendChild(userComponent);
    expect(document.getElementsByClassName('mpy_navigation_menu').length).toEqual(1);
  });

  test('must chow menu on click', async () => {
    await document.body.appendChild(userComponent);
    const menu = document.getElementsByClassName('mpy_navigation_menu')[0];
    expect(menu.style.display).toEqual('none');
    await userComponent.click();
    expect(menu.style.display).toEqual('flex');
  });
  test('must hide opened menu on click', async () => {
    await document.body.appendChild(userComponent);
    const menu = document.getElementsByClassName('mpy_navigation_menu')[0];
    await userComponent.click();
    expect(menu.style.display).toEqual('flex');
    await userComponent.click();
    expect(menu.style.display).toEqual('none');
  });

  test('must logout', async () => {
    await document.body.appendChild(userComponent);
    const logout = jest.fn();
    window.router = {
      go: jest.fn(),
    };
    authController.logOut = () => Promise.resolve(logout());
    await userComponent.logoutElement.click();
    await mocks.sleep(100);
    expect(logout).toHaveBeenCalled();
    expect(window.router.go).toHaveBeenCalledWith('/#/login');
  });
});
