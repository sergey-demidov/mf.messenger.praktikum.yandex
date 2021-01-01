import { isJsonString } from "../lib/utils.js";
import { baseUrl } from "../lib/http-transport.js";
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
    constructor() {
        super();
        this.chatId = 0;
        this.innerHTML = template;
        this.memberTitle = this.getElementsByClassName('mpy_chat_display_nick')[0];
        this.memberAvatar = this.getElementsByClassName('mpy_avatar_preview')[0];
        this.memberWrapper = this.getElementsByClassName('mpy_chat_member_wrapper')[0];
        this.memberTool = this.getElementsByClassName('mpy_chat_display_tool')[0];
        this.memberSign = this.getElementsByClassName('mpy_chat_member_avatar_sign')[0];
    }
    static get observedAttributes() {
        return ['s-member'];
    }
    attributeChangedCallback(name, _oldValue, newValue) {
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
//# sourceMappingURL=chat-member.js.map