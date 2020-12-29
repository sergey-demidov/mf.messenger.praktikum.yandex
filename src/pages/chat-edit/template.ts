export default `<div class="mpy_overlay">
  <div class="mpy_container">
    <div class="mpy_dialog">
      <header class="mpy_dialog_header">
        Login
      </header>
      <main>
        <form action="/"
          name="chatEdit"
          autocomplete="off"
          spellcheck="false">
          <div class="mpy_main_wrapper">
            <input id="chatAvatarInput"
              name="avatar"
              type="file"
              accept="image/*"
              @change="loadImage()"
              hidden/>
            <div class="mpy_content">
              <div class="mpy_dialog_content mpy_white mpy_pt10"
                style="max-width: 400px;">
                <div class="mpy_avatar_output_wrapper unselectable">
                  <img id="chatAvatarPreview"
                    class="mpy_avatar_preview unselectable undraggable"
                    :src="avatar"
                    width="150"
                    height="150"
                    alt="avatar preview">
                  <div class="mpy_avatar_output_icon unselectable"
                    onclick="forms.profile.avatar.click();">
                    <span class="material-icons">camera_alt</span>
                  </div>
                  <span id="chatErrorSign"
                    class="material-icons mpy_avatar_error_sign">
              image_not_supported
            </span>
                </div>
                <s-input name="title"
                  label="title"
                  :model="title"
                  valid
                  s-validate="min_6 no_spaces letters_only"></s-input>
                <div style="width: 100%">
                  <s-btn tabindex="0"
                    onclick="window.router.go('/#/password')"
                    block>
                    Change password
                  </s-btn>
                </div>

              </div>
              <div class="mpy_dialog_footer mpy_white mpy_pt10">
                <s-btn tabindex="0"
                  :disabled="!formIsValid('chatEdit')"
                  @click="submitForm('chatEdit')">
                  Submit
                </s-btn>
                <s-btn tabindex="0"
                  @click="fillForm()">
                  Reset
                </s-btn>
                <!-- need to return focus on tab -->
                <div tabindex="0"
                  onFocus="document.querySelector('input[name=first_name]').focus()"></div>
              </div>
            </div>
          </div>
        </form>
      </main>
      <footer class="mpy_dialog_footer mpy_lightgrey">
        <s-btn tabindex="0"
          :disabled="!formIsValid('login')"
          @click="submitForm('login')">
          Submit
        </s-btn>
        <s-btn tabindex="0"
          onclick="window.history.go(-1)">
          Back
        </s-btn>
        <!-- need to return focus on tab-->
        <div tabindex="0"
          onFocus="document.querySelector('input[name=title]').focus()"></div>
      </footer>
    </div>
  </div>
</div>
`;
