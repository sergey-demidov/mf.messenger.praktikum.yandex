import { isJsonString } from '../lib/utils';
import eventBus from '../lib/event-bus';
import { backendUrl, CONST } from '../lib/const';
import store, { user } from '../lib/store';
import userController from '../controllers/user';

const template = `
          <div class="mpy_chat_content_info">
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
`;

class sChatMessage extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['s-message'];
  }

  messageContent: HTMLElement;

  messageAvatar: HTMLImageElement;

  messageTime: HTMLElement;

  messageSender: HTMLElement;

  chatId = 0;

  date: Date;

  constructor() {
    super();
    this.innerHTML = template;
    this.messageContent = <HTMLElement> this.getElementsByClassName('mpy_chat_message_content')[0];
    this.messageTime = <HTMLElement> this.getElementsByClassName('mpy_chat_time')[0];
    this.messageSender = <HTMLElement> this.getElementsByClassName('mpy_chat_nickname')[0];
    this.messageAvatar = <HTMLImageElement> this.getElementsByClassName('mpy_avatar_preview')[0];
    this.date = new Date();
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    if (name === 's-message' && isJsonString(newValue)) {
      const message = JSON.parse(newValue);
      this.messageContent.innerText = message.content || 'empty';
      this.date = new Date(message.time);
      this.messageTime.innerText = this.date
        .toLocaleTimeString('ru-RU')
        .replace(/:\d+$/, '');

      const userId = message.user_id || message.userId;
      if (userId === store.state.currentUser.id) {
        this.classList.add('mpy_chat_content_sended');
        this.messageAvatar.remove();
        (this.parentElement as HTMLElement).style.textAlign = 'right';
      } else {
        this.classList.add('mpy_chat_content_received');
        (this.parentElement as HTMLElement).style.textAlign = 'left';
        if (!store.state.users[userId]) {
          userController.getUserInfo(userId).then((u) => {
            this.setUserInfo(u);
          });
        } else {
          this.setUserInfo(store.state.users[userId] as typeof user);
        }
      }
      eventBus.emit(CONST.update);
    }
  }

  setUserInfo(u: typeof user): void {
    this.messageSender.textContent = u.display_name || u.first_name || u.login;
    this.messageAvatar.src = u.avatar ? backendUrl + u.avatar : '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200';
  }
}

export default sChatMessage;
