export default `<div class="mpy_container__shadow">
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
        <div class="mpy_chat_content">
          <div class="mpy_chat_content__empty" :s-if="isChatSelected()">Please select chat</div>
          <div s-for="message in chatMessages"
            s-key="chat_messages">
            <s-chat-message :s-message="chatMessages[message]"></s-chat-message>
          </div>
        </div>
        <div class="mpy_chat_input"
          :s-if="!isChatSelected()">
          <s-input name="message"
            :model="message"></s-input>
          <s-btn class="mpy_text_input_icon"
            @click="submitForm('message')">
            <i class="material-icons ">send</i>
          </s-btn>
        </div>
      </div>
      <div class="mpy_chat_users_list mpy_lightgrey">
        <div class="mpy_chat_list_button_wrapper">
          <s-btn round
            @drop="deleteUser()"
            ondragover="return false"
            :disabled="!isChatSelected()"
            onclick="router.go('/#/chat/adduser')">
            <i class="material-icons s-trash">group_add</i>
          </s-btn>
        </div>
        <div s-for="member in chatMembers"
          s-key="member">
          <s-chat-member :s-member="chatMembers[member]"></s-chat-member>
        </div>
      </div>
    </div>
  </div>
</div>
`;
