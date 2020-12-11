export default `
<nav class="mpy_navigation">
  <div>
  </div>
  <div>
    <a href="/pages/profile" class="mpy_navigation_link">Profile</a>
  </div>
</nav>
<div class="mpy_container">
  <div class="mpy_main_wrapper">
    <div class="mpy_chat_list mpy_lightgrey">
      <div class="mpy_text_input_wrapper">
        <!--          <div class="mpy_text_input_label">search</div>-->
        <div class="mpy_text_input_icon" title="search">
          <i class="material-icons">search</i>
        </div>

        <input name="search" class="mpy_text_input" type="text" spellcheck="false">
      </div>
      <!--здесь нужны компоненты и цикл, однако по времени уже не получается реализовать -->
      <ul>
        <li class="mpy_chat_display_wrapper mpy_white">
          <div class="mpy_chat_display_tool">
            <div class="mpy_chat_display_avatar">
              <span class="material-icons mpy_chat_display_avatar_sign"> settings </span>
              <img id="avatarPreview" class="mpy_avatar_preview unselectable undraggable"
                   src="//cdn.britannica.com/58/181058-050-9CC9F60F/Marcus-Tullius-Cicero-detail-marble-bust-Capitoline.jpg"
                   width="40" height="40" alt="avatar preview">
            </div>
          </div>
          <div class="mpy_chat_display">
            <div class="mpy_chat_display_header">Lorem ipsum</div>
            <div class="mpy_chat_display_body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
              deserunt mollit anim id est laborum.
            </div>
          </div>
          <div class="mpy_chat_display_status">
            <div class="mpy_chat_time mpy_pt10">
              09:20
            </div>
            <div class="mpy_chat_display_sign">
              4
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="mpy_chat_wrapper">
      <!--здесь нужны компоненты и цикл, однако по времени уже не получается реализовать -->
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
                 width="40" height="40" alt="Marcus Tullius Cicero">
            <div class="mpy_chat_nickname">Marcus Tullius Cicero</div>
            <div class="mpy_chat_time">09:20</div>
          </div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </div>
        </li>
      </ul>
      <form action="/" name="message" autocomplete="off" spellcheck="false">
        <div class="mpy_chat_input">
          <s-input name="message"></s-input>
          <s-btn class="mpy_text_input_icon" @click="submitForm('message')">
             <i class="material-icons ">send</i>
          </s-btn>
        </div>
      </form>
    </div>
  </div>
  <div id="mpy_dialog"></div>
</div>
</main>
`;
