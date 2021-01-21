import { isJsonString } from '../lib/utils';
import store, { chatMember } from '../lib/store';
import eventBus from '../lib/event-bus';
import { backendUrl, CONST } from '../lib/const';
import chatsController from '../controllers/chats';
import authController from '../controllers/auth';

const template = `<div class="mpy_chat_display_wrapper mpy_white">
  <div class="mpy_chat_display_tool">
    <div class="mpy_chat_display_avatar unselectable undraggable">
      <span class="material-icons mpy_chat_display_avatar_sign"> settings </span>
      <img class="mpy_avatar_preview unselectable undraggable"
        width="40"
        height="40"
        src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
        alt="">
    </div>
  </div>
  <div class="mpy_chat_display">
    <div class="mpy_chat_display_header">
      <div class="mpy_chat_display_title"></div>
      <div class="mpy_chat_display_sign blink_shadow"></div>
    </div>
    <div class="mpy_chat_display_users">
    </div>
  </div>
</div>
`;

class sChatDisplay extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['s-chat'];
  }

  chatTitle: HTMLElement;

  chatWrapper: HTMLElement;

  chatTool: HTMLElement;

  chatAvatar: HTMLImageElement;

  chatMessageCount: HTMLElement;

  chatUsersList: HTMLElement;

  chatId = 0;

  getMessageCountInterval = 0;

  members: typeof chatMember[] = [];

  constructor() {
    super();

    this.innerHTML = template;
    this.chatTitle = <HTMLElement> this.getElementsByClassName('mpy_chat_display_title')[0];
    this.chatAvatar = <HTMLImageElement> this.getElementsByClassName('mpy_avatar_preview')[0];
    this.chatWrapper = <HTMLElement> this.getElementsByClassName('mpy_chat_display_wrapper')[0];
    this.chatTool = <HTMLElement> this.getElementsByClassName('mpy_chat_display_tool')[0];
    this.chatMessageCount = <HTMLElement> this.getElementsByClassName('mpy_chat_display_sign')[0];
    this.chatUsersList = <HTMLElement> this.getElementsByClassName('mpy_chat_display_users')[0];
    eventBus.on(CONST.update, () => this.update());
    eventBus.on(CONST.chatChange, () => this.getMembers());
  }

  update(): void {
    if (this.chatId && this.chatId === store.state.currentChat.id) {
      this.chatWrapper.classList.add('mpy_chat_display_wrapper__active');
      this.chatTool.style.pointerEvents = CONST.auto;
    } else {
      this.chatTool.style.pointerEvents = CONST.none;
      this.chatWrapper.classList.remove('mpy_chat_display_wrapper__active');
    }
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    if (name === 's-chat') {
      if (isJsonString(newValue)) {
        const chat = JSON.parse(newValue);
        this.chatTitle.innerText = chat.title || 'chat title';
        this.chatId = chat.id;
        this.chatAvatar.src = chat.avatar ? backendUrl + chat.avatar : '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200';
        this.getMembers();
        this.chatTool.onclick = (e) => {
          if (store.state.currentChat.id !== this.chatId) return;
          window.router.go('/#/chat/edit');
          e.preventDefault();
          e.stopPropagation();
        };
        this.chatWrapper.onclick = (e) => {
          Object.assign(store.state.currentChat, chat);
          eventBus.emit(CONST.chatChange);
          window.setTimeout(() => this.getUnreadMessagesCount(), 500);
          e.preventDefault();
          e.stopPropagation();
        };
        eventBus.emit(CONST.update);
      }
    }
  }

  getMembers = (): void => {
    if (!this.chatId) return;
    chatsController.getChatUsers(this.chatId)
      .then((members) => {
        this.members = members;
        let res = 'you, ';
        this.members.forEach((m) => {
          if (m.id === store.state.currentUser.id) return;
          res += m.display_name || m.first_name || m.login;
          res += ', ';
        });
        this.chatUsersList.textContent = res.slice(0, -2);
        eventBus.emit(CONST.update);
      }).catch((error) => {
        console.warn(error);
      });
  }

  getUnreadMessagesCount(): void {
    if (!authController.isUserLoggedIn()) return;
    chatsController.getUnreadMessagesCount(this.chatId).then((res) => {
      if (res.unread_count > 0) {
        this.chatMessageCount.textContent = res.unread_count;
        this.chatMessageCount.style.display = 'inline-block';
      } else {
        this.chatMessageCount.textContent = '';
        this.chatMessageCount.style.display = 'none';
      }
    });
  }

  connectedCallback(): void {
    this.getMessageCountInterval = window.setInterval(() => this.getUnreadMessagesCount(),
      5 * 1000 + Math.floor(Math.random() * 1000));
  }

  disconnectedCallback(): void {
    window.clearInterval(this.getMessageCountInterval);
  }
}

export default sChatDisplay;
