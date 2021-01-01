export default `
<nav class="mpy_navigation">
  <div></div>
  <div>
    <s-user></s-user>
  </div>
</nav>
<div class="mpy_container">
  <div class="mpy_main_wrapper">
    <div class="mpy_chat_list mpy_lightgrey">
      <div class="mpy_chat_list_button_wrapper">
        <s-btn round
          onclick="router.go('/#/chat/create')">
          <i class="material-icons">playlist_add</i>
        </s-btn>
      </div>
      <div s-for="chat in chats"
        s-key="chat">
        <s-chat-display :s-chat="chats[chat]"></s-chat-display>
      </div>
    </div>
    <div class="mpy_chat_wrapper">
      <ul class="mpy_chat_content">
        <li class="mpy_chat_content_sended">
          <div class="mpy_chat_content_message">
            Ага
          </div>
          <div class="mpy_chat_time">
            09:20
          </div>
          <i class="material-icons mpy_chat_message_status mpy_chat_message_readed">done_all</i>
        </li>
        <li class="mpy_chat_content_received">
          <div class="mpy_chat_content_avatar">
            <img class="mpy_avatar_preview unselectable undraggable"
              src="//cdn.britannica.com/58/181058-050-9CC9F60F/Marcus-Tullius-Cicero-detail-marble-bust-Capitoline.jpg"
              width="40"
              height="40"
              alt="Marcus Tullius Cicero">
            <div class="mpy_chat_nickname">Marcus Tullius Cicero</div>
            <div class="mpy_chat_time">09:20</div>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </div>
        </li>
      </ul>
      <form action="/"
        name="message"
        autocomplete="off"
        spellcheck="false">
        <div class="mpy_chat_input">
          <s-input name="message"
            s-validate="required"></s-input>
          <s-btn class="mpy_text_input_icon"
            @click="submitForm('message')">
            <i class="material-icons ">send</i>
          </s-btn>
        </div>
      </form>
    </div>
    <div class="mpy_chat_users_list mpy_lightgrey">
      <div class="mpy_chat_list_button_wrapper">
        <s-btn round
          :disabled="!isChatSelected()"
          onclick="router.go('/#/chat/adduser')">
          <i class="material-icons">group_add</i>
        </s-btn>
      </div>
      <div s-for="member in chatMembers" s-key="member">
        <s-chat-member :s-member="chatMembers[member]"></s-chat-member>
      </div>
    </div>

  </div>
</div>
`;
//# sourceMappingURL=template.js.map