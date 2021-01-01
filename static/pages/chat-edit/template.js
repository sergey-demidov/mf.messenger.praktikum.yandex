export default `<div class="mpy_overlay">
  <div class="mpy_container">
    <div class="mpy_dialog">
      <header class="mpy_dialog_header">
        <span>Chat </span> &nbsp; <b><span :text="title"></span></b>
      </header>
      <main>
        <form name="chatEdit"
          action="/">
          <div class="mpy_dialog_content mpy_lightgrey mpy_py10">
            <div class="mpy_avatar_output_wrapper unselectable">
            <input type="hidden" name="chatId" :value="id"/>
              <input id="chatAvatarInput"
                name="avatar"
                type="file"
                accept="image/*"
                @change="loadImage()"
                hidden />
              <img id="chatAvatarPreview"
              class="mpy_avatar_preview unselectable undraggable"
              :src="avatar"
              src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
              width="150"
              height="150"
              alt="">
              <div class="mpy_avatar_output_icon unselectable"
                onclick="forms.chatEdit.avatar.click();">
                <span class="material-icons">camera_alt</span>
              </div>
              <span id="chatErrorSign"
                class="material-icons mpy_avatar_error_sign">
              image_not_supported
            </span>
            </div>
            <s-input name="deleteConfirm"
              :model="deleteConfirm"
              label="enter chat name to delete"></s-input>
            <s-btn tabindex="0" style="background-color: #f33;"
              @click="deleteChat()"
              :disabled="matchTitle()"
              block>
              Delete chat
            </s-btn>
          </div>
        </form>
      </main>
      <footer class="mpy_dialog_footer mpy_lightgrey mpy_pt10">
        <s-btn tabindex="0"
          :disabled="!isAvatarChanged('chatEdit')"
          @click="submitForm('chatEdit')">
          
          Save
        </s-btn>
        <s-btn tabindex="0"
          onclick="window.history.go(-1)">
          Back
        </s-btn>
        <!-- need to return focus on tab-->
        <div tabindex="0"
          onFocus="document.querySelector('input[name=deleteConfirm]').focus()"></div>
      </footer>
    </div>
  </div>
</div>
`;
//# sourceMappingURL=template.js.map