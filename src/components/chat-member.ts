import { isJsonString } from '../lib/utils';
import { baseUrl } from '../lib/http-transport';

const template = `
<div class="mpy_chat_member_wrapper mpy_white">
  <div class="mpy_chat_member_avatar">
    <span class="material-icons mpy_chat_member_avatar_sign"> person </span>
    <img class="mpy_avatar_preview unselectable undraggable"
      width="40"
      height="40"
      src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
      alt="">
  </div>
  <div class="mpy_chat_display_nick">
  </div>
</div>
`;

class sChatMember extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['s-member'];
  }

  memberTitle: HTMLElement;

  memberWrapper: HTMLElement;

  memberTool: HTMLElement;

  memberAvatar: HTMLImageElement;

  memberSign: HTMLElement;

  chatId = 0;

  constructor() {
    super();

    this.innerHTML = template;
    this.memberTitle = <HTMLElement> this.getElementsByClassName('mpy_chat_display_nick')[0];
    this.memberAvatar = <HTMLImageElement> this.getElementsByClassName('mpy_avatar_preview')[0];
    this.memberWrapper = <HTMLElement> this.getElementsByClassName('mpy_chat_member_wrapper')[0];
    this.memberTool = <HTMLElement> this.getElementsByClassName('mpy_chat_display_tool')[0];
    this.memberSign = <HTMLElement> this.getElementsByClassName('mpy_chat_member_avatar_sign')[0];
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string): void {
    if (name === 's-member') {
      console.dir(newValue);
      if (isJsonString(newValue)) {
        const member = JSON.parse(newValue);
        if (member.role === 'admin') {
          this.memberSign.innerText = 'star';
        }
        this.memberTitle.innerText = member.display_name || member.login || 'unknown';
        this.memberAvatar.src = member.avatar ? baseUrl + member.avatar : '//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200';
        this.memberWrapper.onclick = () => {
          alert(member.title);
          return false;
        };
      }
    }
  }
}

export default sChatMember;
