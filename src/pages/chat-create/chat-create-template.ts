export default `
<div class="mpy_overlay">
  <div class="mpy_container">
    <div class="mpy_dialog">
      <header class="mpy_dialog_header">
        Create new chat
      </header>
      <main>
        <form name="createChat" action="#">
          <div class="mpy_dialog_content mpy_lightgrey mpy_py20">
            <s-input
              name="title"
              label="title"
              :model="title"
              s-validate="required no_special_chars max_32">
            </s-input>
          </div>
        </form>
      </main>
      <footer class="mpy_dialog_footer mpy_lightgrey">
        <s-btn
          tabindex="0"
          :disabled="!formIsValid('createChat')"
          @click="submitForm('createChat')">
          Create
        </s-btn>
        <s-btn
          tabindex="0"
          onclick="router.go('/#/chat')">
          Back
        </s-btn>
        <!-- need to return focus on tab-->
        <div tabindex="0" onFocus="document.querySelector('input[name=title]').focus()"></div>
      </footer>
    </div>
  </div>
</div>
`;
