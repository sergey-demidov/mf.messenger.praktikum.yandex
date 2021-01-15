import { isJsonString } from '../lib/utils';
import eventBus from '../lib/event-bus';
import { backendUrl, CONST } from '../lib/const';
import store from '../lib/store';

const template = `
        <div class="mpy_chat_content_wrapper">
          <div class="mpy_chat_content_avatar">
            <img class="mpy_avatar_preview unselectable undraggable"
              src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
              width="40"
              height="40"
              alt="">
            <div class="mpy_chat_nickname"></div>
            <div class="mpy_chat_time"></div>
          </div>
          <div  class="mpy_chat_message_content" >
          </div>
        </div>
`;

class sChatMessage extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['s-message'];
  }

  messageContent: HTMLElement;

  messageWrapper: HTMLElement;

  messageAvatar: HTMLImageElement;

  messageTime: HTMLElement;

  messageSender: HTMLElement;

  chatId = 0;

  constructor() {
    super();
    this.innerHTML = template;
    this.messageWrapper = <HTMLElement> this.getElementsByClassName('mpy_chat_content_wrapper')[0];
    this.messageContent = <HTMLElement> this.getElementsByClassName('mpy_chat_message_content')[0];
    this.messageTime = <HTMLElement> this.getElementsByClassName('mpy_chat_time')[0];
    this.messageSender = <HTMLElement> this.getElementsByClassName('mpy_chat_nickname')[0];
    this.messageAvatar = <HTMLImageElement> this.getElementsByClassName('mpy_avatar_preview')[0];

    // eventBus.on(CONST.update, () => this.update());
  }

  // update():void {
  //   if (this.chatId && this.chatId === store.state.currentChat.id) {
  //     this.chatWrapper.classList.add('mpy_chat_display_wrapper__active');
  //   } else {
  //     this.chatWrapper.classList.remove('mpy_chat_display_wrapper__active');
  //   }
  // }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    if (name === 's-message') {
      if (isJsonString(newValue)) {
        const message = JSON.parse(newValue);
        this.messageContent.innerText = message.content || '';
        const res = message.time.match(/^20(\d+)-(\d+)-(\d+)T(\d+:\d+)/);
        if (res) {
          const [, year, month, day, time] = res;
          this.messageTime.innerText = `${day}.${month}.${year}\n${time}`;
        }
        const userId = message.user_id || message.userId;
        if (userId === store.state.currentUser.id) {
          this.messageWrapper.classList.add('mpy_chat_content_sended');
          this.messageAvatar.remove();
        } else {
          this.messageWrapper.classList.add('mpy_chat_content_received');
          this.messageAvatar.src = message.avatar ? backendUrl + message.avatar : '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200';
        }
        eventBus.emit(CONST.update);
      }
    }
  }
}

export default sChatMessage;
