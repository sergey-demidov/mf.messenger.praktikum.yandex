export default `<nav class="mpy_navigation">
  <div>
    <a href="/pages/chat" class="mpy_navigation_link">Chat</a>
  </div>
  <div>
    <a href="/pages/login" class="mpy_navigation_link">Login</a>
  </div>
</nav>
<div class="mpy_container">
  <form action="/" name="profile" autocomplete="off" spellcheck="false" @reset="onReset()">
    <div class="mpy_main_wrapper">
      <input name="avatar" type='file' accept="image/*" @change="loadImage(this)" hidden/>
      <div class="mpy_content">
        <div class="mpy_dialog_content mpy_white mpy_pt10" style="max-width: 400px;">
          <div class="mpy_avatar_output_wrapper unselectable">
            <img id="avatarPreview" class="mpy_avatar_preview unselectable undraggable"
                 src="//avatars.mds.yandex.net/get-yapic/0/0-0/islands-200"
                 width="150" height="150" alt="avatar preview">
            <div class="mpy_avatar_output_icon unselectable" onclick="forms.profile.avatar.click();">
              <span class="material-icons">camera_alt</span>
            </div>
            <span id="errorSign" class="material-icons mpy_avatar_error_sign">
               image_not_supported
            </span>
          </div>
          <s-input
            name="first_name"
            :model="first_name"
            autofocus
            s-validate="min_6 no_spaces letters_only">
          </s-input>
          <s-input
            name="second_name"
            :model="second_name"
            s-validate="min_6 no_spaces letters_only">
          </s-input>
          <s-input
            name="email"
            :model="email"
            s-validate="email">
          </s-input>
          <s-input
            name="phone"
            :model="phone"
            s-validate="phone">
          </s-input>
          <s-input
            name="login"
            :model="login"
            s-validate="min_6 no_spaces letters_only">
          </s-input>

        </div>
        <div class="mpy_dialog_footer mpy_white mpy_pt10">
          <s-btn
            tabindex="0"
            :disabled="!formIsValid('profile')"
            @click="submitForm('profile')">
            Submit
          </s-btn>
          <s-btn
            tabindex="0"
            onclick="forms.profile.reset()">
            Reset
          </s-btn>
          <!-- need to return focus on tab -->
          <div tabindex="0" onFocus="document.querySelector('[autofocus]').focus()"></div>
        </div>
      </div>
    </div>
  </form>
</div>
`;
//# sourceMappingURL=template.js.map