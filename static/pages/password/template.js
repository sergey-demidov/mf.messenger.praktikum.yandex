export default `
<s-app>
<div class="mpy_overlay">
  <div class="mpy_container">
    <div class="mpy_dialog">
      <header class="mpy_dialog_header">
        Change password
      </header>
      <main>
        <form name="password" action="/">
          <div class="mpy_dialog_content mpy_lightgrey mpy_pt10">
            <s-input
              name="oldPassword"
              :model="oldPassword"
              label="old password"
              type="password"
              s-validate="required">
            </s-input>
            <s-input
              name="newPassword"
              label="new password"
              :model="newPassword"
              type="password"
              s-validate="min_8">
            </s-input>
            <s-input
              name="newPasswordAgain"
              :model="newPasswordAgain"
              label="new password again"
              type="password"
              :s-validate="concat('min_8 match:', newPassword)">
            </s-input>
          </div>
        </form>
      </main>
      <footer class="mpy_dialog_footer mpy_lightgrey">
        <s-btn
          tabindex="0"
          :disabled="!formIsValid('password')"
          @click="submitForm('password')">
          Submit
        </s-btn>
        <s-btn
          tabindex="0"
          onclick="window.router.go('/#/profile')">
          Back
        </s-btn>
        <!-- need to return focus on tab-->
        <div tabindex="0" onFocus="document.querySelector('input[name=oldPassword]').focus()"></div>
      </footer>
    </div>
  </div>
</div>
<s-app>
`;
//# sourceMappingURL=template.js.map