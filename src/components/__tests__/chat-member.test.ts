// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sChatMember from '../chat-member';
import store from '../../lib/store';
import chatsController from '../../controllers/chats';
import mocks from '../../lib/mock-utils';
import eventBus from '../../lib/event-bus';
import { CONST } from '../../lib/const';

let chatMember;

// const chatId = 888;
//
// const userId = 777;
//
// const chatTitle = 'title';
//
// const userName = 'user';
//
// const chatProperties = {
//   avatar: '',
//   created_by: 777,
//   id: chatId,
//   title: chatTitle,
// };
//
// const members = [
//   {
//     display_name: userName,
//     id: userId,
//   },
//   {
//     display_name: 'guest',
//     id: 999,
//   },
// ];

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

  // test('must get new messages count every 10 sec', async () => {
  //   jest.useFakeTimers();
  //   document.body.appendChild(chatMember);
  //   chatMember.getUnreadMessagesCount = jest.fn();
  //   jest.advanceTimersByTime(12 * 1000);
  //
  //   expect(chatMember.getUnreadMessagesCount).toHaveBeenCalledTimes(1);
  //   jest.useRealTimers();
  // });
  //
  //
  // test('must be active if local chatId equal with store current chat id', async () => {
  //   chatMember.getMembers = jest.fn();
  //   store.state.currentChat.id = chatId;
  //   document.body.appendChild(chatMember);
  //   const wrapper = chatMember.getElementsByClassName('mpy_chat_display_wrapper')[0];
  //   await chatMember.setAttribute('s-chat', JSON.stringify(chatProperties));
  //
  //   expect(wrapper.classList.contains('mpy_chat_display_wrapper__active')).toBeTruthy();
  // });
  //
  // test('must set users list', async () => {
  //   store.state.currentUser.id = userId;
  //   chatMember.setAttribute('s-chat', JSON.stringify(chatProperties));
  //   const chatUsersList = chatMember.getElementsByClassName('mpy_chat_display_users')[0];
  //   document.body.appendChild(chatMember);
  //   await mocks.sleep(100);
  //
  //   expect(chatUsersList.textContent).toEqual('you, guest');
  // });
  //
  // test('must show unread message count if count > 0', async () => {
  //   store.state.currentUser.login = userName;
  //   const unreadCount = 5;
  //   const unreadMessages = {
  //     unread_count: unreadCount,
  //   };
  //   const chatMessageCount = chatMember.getElementsByClassName('mpy_chat_display_sign')[0];
  //   chatsController.getUnreadMessagesCount = () => Promise.resolve(unreadMessages);
  //
  //   await chatMember.getUnreadMessagesCount();
  //   expect(chatMessageCount.textContent).toEqual(unreadCount.toString());
  //   expect(chatMessageCount.style.display).toEqual('inline-block');
  // });
  //
  // test('must hide unread message count if count === 0', async () => {
  //   store.state.currentUser.login = userName;
  //   const unreadCount = 0;
  //   const unreadMessages = {
  //     unread_count: unreadCount,
  //   };
  //   const chatMessageCount = chatMember.getElementsByClassName('mpy_chat_display_sign')[0];
  //   chatsController.getUnreadMessagesCount = () => Promise.resolve(unreadMessages);
  //
  //   await chatMember.getUnreadMessagesCount();
  //   expect(chatMessageCount.textContent).toEqual('');
  //   expect(chatMessageCount.style.display).toEqual('none');
  // });
  //
  //
  // test('must show edit dialog', async () => {
  //   store.state.currentChat.id = chatId;
  //   document.body.appendChild(chatMember);
  //   const chatTool = chatMember.getElementsByClassName('mpy_chat_display_tool')[0];
  //   await chatMember.setAttribute('s-chat', JSON.stringify(chatProperties));
  //   window.router = {
  //     go: jest.fn(),
  //   };
  //   chatTool.click();
  //   await mocks.sleep(100);
  //
  //   expect(window.router.go).toHaveBeenCalledWith('/#/chat/edit');
  // });
});
