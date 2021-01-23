// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {
  expect, describe, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import sChatDisplay from '../chat-display';
import store from '../../lib/store';
import chatsController from '../../controllers/chats';
import mocks from '../../lib/mock-utils';

let chatDisplay;

const chatId = 888;

const userId = 777;

const chatTitle = 'title';

const userName = 'user';

const chatProperties = {
  avatar: '',
  created_by: 777,
  id: chatId,
  title: chatTitle,
};

const members = [
  {
    display_name: userName,
    id: userId,
  },
  {
    display_name: 'guest',
    id: 999,
  },
];

chatsController.getChatUsers = () => Promise.resolve(members);

customElements.define('s-chat-display', sChatDisplay);

describe('test sChatDisplay module', () => {
  beforeEach(() => {
    // eslint-disable-next-line new-cap
    chatDisplay = new sChatDisplay();
  });
  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('is defined', () => {
    expect(sChatDisplay).toBeDefined();
  });

  test('must get new messages count every 10 sec', async () => {
    jest.useFakeTimers();
    document.body.appendChild(chatDisplay);
    chatDisplay.getUnreadMessagesCount = jest.fn();
    jest.advanceTimersByTime(12 * 1000);

    expect(chatDisplay.getUnreadMessagesCount).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  test('must process "s-chat" attribute', async () => {
    document.body.appendChild(chatDisplay);
    chatDisplay.setAttribute('s-chat', JSON.stringify(chatProperties));
    const title = chatDisplay.getElementsByClassName('mpy_chat_display_title')[0];

    expect(title.innerText).toEqual(chatTitle);
  });

  test('must be active if local chatId equal with store current chat id', async () => {
    chatDisplay.getMembers = jest.fn();
    store.state.currentChat.id = chatId;
    document.body.appendChild(chatDisplay);
    const wrapper = chatDisplay.getElementsByClassName('mpy_chat_display_wrapper')[0];
    await chatDisplay.setAttribute('s-chat', JSON.stringify(chatProperties));

    expect(wrapper.classList.contains('mpy_chat_display_wrapper__active')).toBeTruthy();
  });

  test('must set users list', async () => {
    store.state.currentUser.id = userId;
    chatDisplay.setAttribute('s-chat', JSON.stringify(chatProperties));
    const chatUsersList = chatDisplay.getElementsByClassName('mpy_chat_display_users')[0];
    document.body.appendChild(chatDisplay);
    await mocks.sleep(100);

    expect(chatUsersList.textContent).toEqual('you, guest');
  });

  test('must show unread message count if count > 0', async () => {
    store.state.currentUser.login = userName;
    const unreadCount = 5;
    const unreadMessages = {
      unread_count: unreadCount,
    };
    const chatMessageCount = chatDisplay.getElementsByClassName('mpy_chat_display_sign')[0];
    chatsController.getUnreadMessagesCount = () => Promise.resolve(unreadMessages);

    await chatDisplay.getUnreadMessagesCount();
    expect(chatMessageCount.textContent).toEqual(unreadCount.toString());
    expect(chatMessageCount.style.display).toEqual('inline-block');
  });

  test('must hide unread message count if count === 0', async () => {
    store.state.currentUser.login = userName;
    const unreadCount = 0;
    const unreadMessages = {
      unread_count: unreadCount,
    };
    const chatMessageCount = chatDisplay.getElementsByClassName('mpy_chat_display_sign')[0];
    chatsController.getUnreadMessagesCount = () => Promise.resolve(unreadMessages);

    await chatDisplay.getUnreadMessagesCount();
    expect(chatMessageCount.textContent).toEqual('');
    expect(chatMessageCount.style.display).toEqual('none');
  });

  test('must set active on click', async () => {
    store.state.currentChat.id = 0;
    document.body.appendChild(chatDisplay);
    const wrapper = chatDisplay.getElementsByClassName('mpy_chat_display_wrapper')[0];
    await chatDisplay.setAttribute('s-chat', JSON.stringify(chatProperties));
    wrapper.click();
    await mocks.sleep(100);

    expect(wrapper.classList.contains('mpy_chat_display_wrapper__active')).toBeTruthy();
    expect(store.state.currentChat.id).toEqual(chatId);
  });

  test('must show edit dialog', async () => {
    store.state.currentChat.id = chatId;
    document.body.appendChild(chatDisplay);
    const chatTool = chatDisplay.getElementsByClassName('mpy_chat_display_tool')[0];
    await chatDisplay.setAttribute('s-chat', JSON.stringify(chatProperties));
    window.router = {
      go: jest.fn(),
    };
    chatTool.click();
    await mocks.sleep(100);

    expect(window.router.go).toHaveBeenCalledWith('/#/chat/edit');
  });
});
