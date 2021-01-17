import { isJsonString } from '../lib/utils';
import store from '../lib/store';
import eventBus from '../lib/event-bus';
import { backendUrl, CONST } from '../lib/const';
import chatsController from '../controllers/chats';

const template = `
<div class="mpy_chat_display_wrapper mpy_white">
  <div class="mpy_chat_display_tool">
    <div class="mpy_chat_display_avatar unselectable undraggable">
      <span class="material-icons mpy_chat_display_avatar_sign"> settings </span> 
      <img 
        class="mpy_avatar_preview unselectable undraggable"
        width="40"
        height="40"
        src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
        alt="">
    </div>
  </div>
  <div class="mpy_chat_display">
    <div class="mpy_chat_display_header">Lorem ipsum</div>
    <div class="mpy_chat_display_body">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div class="mpy_chat_display_status">
    <div class="mpy_chat_time mpy_pt10">
      09:20
    </div>
    <div class="mpy_chat_display_sign">
      
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

  chatId = 0;

  getMessageCountInterval = 0;

  constructor() {
    super();

    this.innerHTML = template;
    this.chatTitle = <HTMLElement> this.getElementsByClassName('mpy_chat_display_header')[0];
    this.chatAvatar = <HTMLImageElement> this.getElementsByClassName('mpy_avatar_preview')[0];
    this.chatWrapper = <HTMLElement> this.getElementsByClassName('mpy_chat_display_wrapper')[0];
    this.chatTool = <HTMLElement> this.getElementsByClassName('mpy_chat_display_tool')[0];
    this.chatMessageCount = <HTMLElement> this.getElementsByClassName('mpy_chat_display_sign')[0];
    eventBus.on(CONST.update, () => this.update());
  }

  update(): void {
    if (this.chatId && this.chatId === store.state.currentChat.id) {
      this.chatWrapper.classList.add('mpy_chat_display_wrapper__active');
    } else {
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
        this.chatTool.onclick = (e) => {
          Object.assign(store.state.currentChat, chat);
          eventBus.emit(CONST.chatChange);
          window.router.go('/#/chat/edit');
          e.preventDefault();
          e.stopPropagation();
        };
        this.chatWrapper.onclick = () => {
          Object.assign(store.state.currentChat, chat);
          eventBus.emit(CONST.chatChange);
          window.setTimeout(() => this.getUnreadMessagesCount(), 500);
          return false;
        };
        eventBus.emit(CONST.update);
      }
    }
  }

  getUnreadMessagesCount(): void {
    chatsController.getUnreadMessagesCount(this.chatId).then((res) => {
      if (res.unread_count > 0) {
        this.chatMessageCount.textContent = res.unread_count;
        this.chatMessageCount.style.display = CONST.block;
      } else {
        this.chatMessageCount.textContent = '';
        this.chatMessageCount.style.display = CONST.none;
      }
    });
  }

  connectedCallback(): void {
    this.getMessageCountInterval = window.setInterval(() => this.getUnreadMessagesCount(),
      10 * 1000 + Math.floor(Math.random() * 1000));
  }

  disconnectedCallback(): void {
    window.clearInterval(this.getMessageCountInterval);
  }
}

export default sChatDisplay;
