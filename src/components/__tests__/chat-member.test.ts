// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sChatMember from '../chat-member';
import store from '../../lib/store';
import eventBus from '../../lib/event-bus';
import { CONST } from '../../lib/const';

let chatMember;

const member = {
  display_name: 'user name',
  id: 777,
  login: 'login',
  role: 'admin',
};

eventBus.on(CONST.update, jest.fn);

customElements.define('s-chat-member', sChatMember);

describe('test sChatMember module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    chatMember = new sChatMember();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('is defined', () => {
    expect(sChatMember).toBeDefined();
  });

  test('must process "s-member" attribute', async () => {
    document.body.appendChild(chatMember);
    chatMember.setAttribute('s-member', JSON.stringify(member));
    const title = chatMember.getElementsByClassName('mpy_chat_display_nick')[0];
    expect(title.innerText).toEqual(member.display_name);
  });

  test('must set store currentMember on click', async () => {
    store.state.currentMember.id = 0;
    document.body.appendChild(chatMember);
    chatMember.setAttribute('s-member', JSON.stringify(member));
    const wrapper = chatMember.getElementsByClassName('mpy_chat_member_wrapper')[0];

    wrapper.onclick();

    expect(store.state.currentMember.id).toEqual(member.id);
  });

  test('must set store currentMember on dragStart', async () => {
    store.state.currentMember.id = 0;
    document.body.appendChild(chatMember);
    chatMember.setAttribute('s-member', JSON.stringify(member));
    const wrapper = chatMember.getElementsByClassName('mpy_chat_member_wrapper')[0];

    wrapper.ondragstart();

    expect(store.state.currentMember.id).toEqual(member.id);
  });
});
