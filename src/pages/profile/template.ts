export default `<nav class="mpy_navigation">
  <div>
    <a href="/#/"
      data-icon=""
      class="mpy_navigation_link">Chat</a>
  </div>
  <div>
    <!--    <a href="/#/login" class="mpy_navigation_link">Login</a>-->
    <s-user></s-user>
  </div>
</nav>
<div class="mpy_container">
  <form action="/"
    name="profile"
    autocomplete="off"
    spellcheck="false">
    <div class="mpy_main_wrapper">
      <input id="avatarInput"
        name="avatar"
        type="file"
        accept="image/*"
        @change="loadImage()"
        hidden/>
      <div class="mpy_content">
        <div class="mpy_dialog_content mpy_white mpy_pt10"
          style="max-width: 400px;">
          <div class="mpy_avatar_output_wrapper unselectable">
            <img id="avatarPreview"
              class="mpy_avatar_preview unselectable undraggable"
              :src="avatar"
              width="150"
              height="150"
              alt="avatar preview">
            <div class="mpy_avatar_output_icon unselectable"
              onclick="forms.profile.avatar.click();">
              <span class="material-icons">camera_alt</span>
            </div>
            <span id="errorSign"
              class="material-icons mpy_avatar_error_sign">
              image_not_supported
            </span>
          </div>
          <s-input name="first_name"
            label="first name"
            :model="first_name"
            valid
            s-validate="min_6 no_spaces letters_only"></s-input>
          <s-input name="second_name"
            label="second name"
            :model="second_name"
            valid
            s-validate="min_6 no_spaces letters_only"></s-input>
          <s-input name="email"
            :model="email"
            valid
            s-validate="email"></s-input>
          <s-input name="phone"
            :model="phone"
            valid
            s-validate="phone"></s-input>
          <s-input name="login"
            :model="login"
            valid
            s-validate="min_6 no_spaces letters_only"></s-input>
          <s-btn tabindex="0"
            onclick="window.router.go('/#/password')"
            block>
            Change password
          </s-btn>

        </div>
        <div class="mpy_dialog_footer mpy_white mpy_pt10">
          <s-btn tabindex="0"
            :disabled="!formIsValid('profile')"
            @click="submitForm('profile')">
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
  <div s-for="number in array" s-key="num">
    <div :text=array[number]></div>
  </div>

</div>`;
