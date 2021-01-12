export default `<div class="mpy_overlay">
  <div class="mpy_container">
    <div class="mpy_dialog">
      <header class="mpy_dialog_header">
        <span>Chat </span> &nbsp; <b><span :s-text="title"></span></b>
      </header>
      <main>
        <form name="addUser"
          action="/">
          <div class="mpy_dialog_content mpy_lightgrey mpy_py20">
            <s-input name="userName"
              list="possibleUserNames"
              :model="userName"
              s-validate="required no_special_chars"
              label="enter user name to invite"></s-input>
          </div>
        </form>
      </main>
      <footer class="mpy_dialog_footer mpy_lightgrey mpy_pt10">
        <s-btn tabindex="0"
          @click="submitForm('addUser')"
          :disabled="!allowInvite">
          Invite
        </s-btn>
        <s-btn tabindex="0"
          onclick="window.history.go(-1)">
          Back
        </s-btn>
        <!-- need to return focus on tab-->
        <div tabindex="0"
          onFocus="document.querySelector('input[name=userName]').focus()"></div>
      </footer>
    </div>
  </div>
<datalist id="possibleUserNames" s-for="name in possibleNames" s-key="p_name_list">
  <option  :s-text="possibleNames[name]"></option>
</datalist>
</div>
`;
