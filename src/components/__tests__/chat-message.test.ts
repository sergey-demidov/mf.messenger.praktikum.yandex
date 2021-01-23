// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sChatMessage from '../chat-message';
import store from '../../lib/store';
import eventBus from '../../lib/event-bus';
import { CONST } from '../../lib/const';
import userController from '../../controllers/user';

let chatMessage;

const message = {
  chat_id: 888,
  content: 'content',
  id: 1,
  time: '2021-01-21T14:35:07+00:00',
  user_id: 777,
};

const member = {
  display_name: 'user name',
  id: 777,
  login: 'login',
  role: 'admin',
};

eventBus.on(CONST.update, jest.fn);

customElements.define('s-chat-message', sChatMessage);

userController.getUserInfo = () => Promise.resolve(member);

describe('test sChatMessage module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    chatMessage = new sChatMessage();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('is defined', () => {
    expect(sChatMessage).toBeDefined();
  });

  test('must process "s-message" attribute', async () => {
    document.body.appendChild(chatMessage);
    chatMessage.setAttribute('s-message', JSON.stringify(message));
    const messageContent = chatMessage.getElementsByClassName('mpy_chat_message_content')[0];
    expect(messageContent.innerText).toEqual(message.content);
  });

  test('must recognise messages match current user id as sended', async () => {
    store.state.currentUser.id = message.user_id;
    document.body.appendChild(chatMessage);
    chatMessage.setAttribute('s-message', JSON.stringify(message));
    expect(chatMessage.classList.contains('mpy_chat_content_sended')).toBeTruthy();
  });

  test('must recognise messages NOT match current user id as received', async () => {
    store.state.currentUser.id = message.user_id + 1;
    document.body.appendChild(chatMessage);
    chatMessage.setAttribute('s-message', JSON.stringify(message));
    expect(chatMessage.classList.contains('mpy_chat_content_received')).toBeTruthy();
  });

  test('must set user info', async () => {
    store.state.users[member.id] = member;
    document.body.appendChild(chatMessage);
    chatMessage.setAttribute('s-message', JSON.stringify(message));
    const messageSender = chatMessage.getElementsByClassName('mpy_chat_nickname')[0];
    expect(messageSender.textContent).toEqual(member.display_name);
  });
});
