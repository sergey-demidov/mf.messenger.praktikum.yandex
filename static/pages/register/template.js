export default `<div class="mpy_overlay">
  <div class="mpy_container">
    <div class="mpy_dialog">
      <header class="mpy_dialog_header">
        Register
      </header>
      <main>
        <form name="register" action="/">
          <div class="mpy_dialog_content mpy_lightgrey mpy_pt10">
            <s-input
              name="login"
              s-validate="min_6 no_spaces letters_only">
            </s-input>
            <s-input
              name="password"
              type="password"
              s-validate="min_8">
            </s-input>
            <s-input
              name="first_name"
              s-validate="min_6 no_spaces letters_only">
            </s-input>
            <s-input
              name="second_name"
              s-validate="min_6 no_spaces letters_only">
            </s-input>
            <s-input
              name="email"
              s-validate="email">
            </s-input>
            <s-input
              name="phone"
              s-validate="phone">
            </s-input>
            <a tabindex="-1" class="mpy_dialog_link" href="/#/login"> Already have login? </a>
          </div>
        </form>
      </main>
      <footer class="mpy_dialog_footer mpy_lightgrey">
        <s-btn
          tabindex="0"
          :disabled="!formIsValid('register')"
          @click="submitForm('register')">
          Submit
        </s-btn>
        <s-btn
          tabindex="0"
          onclick="window.history.go(-1)">
          Back
        </s-btn>
        <!-- need to return focus on tab -->
        <div tabindex="0" onFocus="document.querySelector('input[name=login]').focus()"></div>
      </footer>
    </div>
  </div>
</div>
`;
//# sourceMappingURL=template.js.map